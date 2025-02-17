// Recursive function to traverse the object and collect keys
function traverseObject(obj, path = []) {
  let result = [];
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result = result.concat(traverseObject(obj[key], path.concat(key)));
    } else if (key === "value") {
      result.push({ path: path.concat(key), value: obj[key] });
    }
  }
  return result;
}

// Function to resolve the value including modes against the referenced object
function resolveValue(value, group) {
  const path = value.replace(/[{}]/g, "").split(".");
  const [groupName, ...restOfPath] = path;
  const groupObject = group[groupName];
  if (!groupObject) {
    return null;
  }

  const modes = Object.keys(groupObject);
  const resolvedValues = {};

  modes.forEach((mode) => {
    let resolvedValue = groupObject[mode];
    for (let key of restOfPath) {
      if (resolvedValue[key]) {
        resolvedValue = resolvedValue[key];
      } else {
        resolvedValue = null;
        break;
      }
    }
    // Recursively resolve until the 'value' key is found
    while (
      typeof resolvedValue === "object" &&
      resolvedValue !== null &&
      "value" in resolvedValue
    ) {
      resolvedValue = resolvedValue["value"];
    }
    resolvedValues[mode] = resolvedValue;
  });

  return resolvedValues;
}

function mergeDeep(target, source) {
  for (let key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeDeep(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

// Helper function to set an object by path
function setObjectByPath(obj, path, value) {
  let current = obj;
  path.forEach((key, index) => {
    if (index === path.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  });
  return obj;
}

function resolveFigmaReferences(dictionary) {
    console.log("Preprocessing: Resolving Figma References...");
    const elements = dictionary.element;
    const elementsGroups = Object.keys(elements);

    let newElementsObject = {};

    const allValues = traverseObject(elements);
    // console.log('All Values:', allValues);

    elementsGroups.forEach((group) => {
      const groupObject = elements[group];
      // console.log('Group:', group, ' Object:', groupObject);

      const filteredValues = allValues.filter((item) => item.path[0] === group);
      // console.log('Filtered Values for group', group, ':', filteredValues);

      filteredValues.forEach((item) => {
        // Extract the path and value
        const valuePath = item.path;
        const referenceValue = item.value;

        // Skip the last key to get the original object path
        const originalObjectPath = valuePath.slice(0, -1);

        // Function to get the object by path
        function getObjectByPath(obj, path) {
          return path.reduce((acc, key) => acc && acc[key], obj);
        }

        // Extract the original object
        const originalObject = getObjectByPath(elements, originalObjectPath);

        // Resolve the reference value against the dictionary
        const resolvedReferenceValues = resolveValue(
          referenceValue,
          dictionary
        );

        // Iterate through the modes and update the path with the mode
        Object.keys(resolvedReferenceValues).forEach((mode) => {
          const modePath = [group, mode, ...originalObjectPath.slice(1)];
          const modeValue = resolvedReferenceValues[mode];

          // Create a new object with the updated path and value
          const newObject = {
            ...originalObject,
            value: modeValue,
          };

          // console.log("Mode Path:", modePath);
          // console.log("New Object:", newObject);

          // Merge the new object back into the dictionary
          newElementsObject = mergeDeep(
            newElementsObject,
            setObjectByPath(newElementsObject, modePath, newObject)
          );
        });
      });
    });

    dictionary.element = newElementsObject;

    return dictionary;
};

export default resolveFigmaReferences;