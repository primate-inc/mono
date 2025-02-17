function transformJson(obj) {
  const paths = [];
  
  // Helper function to check if key starts with @ or #
  const isSpecialKey = (key) => key.startsWith('@') || key.startsWith('#');
  
  // Helper function to check if object is a leaf node
  const isLeafNode = (obj) => {
    return obj && typeof obj === 'object' && 
           ('value' in obj && 'type' in obj);
  };

  // Function to collect all paths and their associated data
  const collectPaths = (obj, currentPath = [], specialKeys = []) => {
    if (!obj || typeof obj !== 'object') return;

    // If we found a leaf node, save its path and data
    if (isLeafNode(obj)) {
      paths.push({
        path: currentPath,
        specialKeys: specialKeys,
        data: obj
      });
      return;
    }

    // Process each key
    Object.keys(obj).forEach(key => {
      const newPath = [...currentPath];
      if (!isSpecialKey(key)) {
        newPath.push(key);
        collectPaths(obj[key], newPath, specialKeys);
      } else {
        // For special keys, traverse their contents with the special key added to the specialKeys array
        collectPaths(obj[key], currentPath, [...specialKeys, key]);
      }
    });
  };

  // Function to set a value in nested object based on path
  const setNestedValue = (obj, path, value) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
  };

  // Collect all paths
  collectPaths(obj);

  // Build the new object
  const result = {};
  paths.forEach(({ path, specialKeys, data }) => {
    if (specialKeys.length === 0) {
      // If no special keys, just set the value directly
      setNestedValue(result, path, data);
    } else {
      // If there are special keys, create the structure with special keys as parents of leaf node
      let current = result;
      path.forEach((key, index) => {
        if (index === path.length - 1) {
          if (!(key in current)) {
            current[key] = {};
          }
          specialKeys.forEach(specialKey => {
            if (!(specialKey in current[key])) {
              current[key][specialKey] = {};
            }
            current[key][specialKey] = data;
          });
        } else {
          if (!(key in current)) {
            current[key] = {};
          }
          current = current[key];
        }
      });
    }
  });

  return result;
};

function moveFigmaModes(obj) {
  console.log('Preprocessing: Moving Figma modes...');
  return transformJson(obj);
}

export default moveFigmaModes;