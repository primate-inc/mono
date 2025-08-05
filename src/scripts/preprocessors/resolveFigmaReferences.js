// Helper function to check if a value is a reference
function isReference(value) {
  return typeof value === "string" && value.match(/^\{[^{}]+\}$/);
}

// Helper function to get a value from an object by path
function getValueByPath(obj, path) {
  return path.reduce((acc, key) => acc && acc[key], obj);
}

// Helper function to get the actual value (resolving references if needed)
function resolveValue(value, dictionary, currentMode = null) {
  // If it's not a reference, return as is
  if (!isReference(value)) {
    return value;
  }

  // Extract the path from inside the curly braces
  const path = value.slice(1, -1).split(".");
  const [collectionName, ...restOfPath] = path;

  // Get the collection object
  const collectionObject = dictionary[collectionName];
  if (!collectionObject) {
    console.warn(`Collection ${collectionName} not found for reference ${value}`);
    return value;
  }

  // Get all modes in the collection
  const modes = Object.keys(collectionObject);
  const validModes = modes.filter(mode => mode.startsWith('@') || mode.startsWith('#'));

  // If no valid modes, try to resolve directly
  if (validModes.length === 0) {
    const resolvedValue = getValueByPath(collectionObject, restOfPath);
    return resolvedValue?.value || value;
  }

  // If we're resolving for a specific mode, only resolve that mode
  if (currentMode) {
    let resolvedValue = collectionObject[currentMode];
    for (const key of restOfPath) {
      resolvedValue = resolvedValue?.[key];
      if (!resolvedValue) break;
    }

    // Get the final value
    while (resolvedValue && typeof resolvedValue === 'object' && 'value' in resolvedValue) {
      resolvedValue = resolvedValue.value;
      // If the new value is a reference, resolve it recursively in the same mode
      if (isReference(resolvedValue)) {
        resolvedValue = resolveValue(resolvedValue, dictionary, currentMode);
      }
    }

    return resolvedValue || value;
  }

  // If no specific mode, resolve for all modes
  const resolvedValues = {};
  validModes.forEach(mode => {
    let resolvedValue = collectionObject[mode];
    for (const key of restOfPath) {
      resolvedValue = resolvedValue?.[key];
      if (!resolvedValue) break;
    }

    // Get the final value
    while (resolvedValue && typeof resolvedValue === 'object' && 'value' in resolvedValue) {
      resolvedValue = resolvedValue.value;
      // If the new value is a reference, resolve it recursively in the same mode
      if (isReference(resolvedValue)) {
        resolvedValue = resolveValue(resolvedValue, dictionary, mode);
      }
    }

    if (resolvedValue) {
      resolvedValues[mode] = resolvedValue;
    }
  });

  return Object.keys(resolvedValues).length > 0 ? resolvedValues : value;
}

// Helper function to traverse object and collect values that need resolution
function traverseObject(obj, path = []) {
  let result = [];
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      // If it has a value property, check if it needs resolution
      if ('value' in obj[key]) {
        result.push({
          path: path.concat(key),
          value: obj[key].value,
          original: obj[key]
        });
      }
      // Continue traversing
      result = result.concat(traverseObject(obj[key], path.concat(key)));
    }
  }
  return result;
}

// Helper function to set a value in an object by path
function setValueByPath(obj, path, value) {
  const lastKey = path[path.length - 1];
  const parentPath = path.slice(0, -1);
  
  let current = obj;
  parentPath.forEach(key => {
    current[key] = current[key] || {};
    current = current[key];
  });

  if (typeof value === 'object' && !Array.isArray(value)) {
    current[lastKey] = current[lastKey] || {};
    Object.assign(current[lastKey], value);
  } else {
    current[lastKey] = value;
  }
}

function resolveFigmaReferences(dictionary) {
  console.log("Preprocessing: Resolving Figma References...");
  
  // Create a deep copy of the dictionary to work with
  const workingDictionary = JSON.parse(JSON.stringify(dictionary));

  // Process each collection
  Object.keys(workingDictionary).forEach(collectionKey => {
    const collection = workingDictionary[collectionKey];
    
    // Find all values that might need resolution
    const values = traverseObject(collection);

    // Resolve each value
    values.forEach(({ path, value, original }) => {
      if (isReference(value)) {
        // Find the current mode from the path if it exists
        const currentMode = path.find(p => p.startsWith('#') || p.startsWith('@'));
        
        const resolvedValue = resolveValue(value, dictionary, currentMode);
        
        // If resolution was successful, update the value
        if (resolvedValue !== value) {
          if (typeof resolvedValue === 'object' && !currentMode) {
            // For mode-based values without a current mode, create new objects for each mode
            Object.entries(resolvedValue).forEach(([mode, modeValue]) => {
              const modePath = [mode, ...path];
              setValueByPath(collection, modePath, {
                ...original,
                value: modeValue
              });
            });
          } else {
            // For direct values or mode-specific values, update in place
            original.value = resolvedValue;
          }
        }
      }
    });
  });

  return workingDictionary;
}

export default resolveFigmaReferences;