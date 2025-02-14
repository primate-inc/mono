import StyleDictionary from 'style-dictionary';
import config from '../defaultConfig.js';

import hexToHSL from './hexToHSL.js';
import deepMapSearch from './deepMapSearch.js';

// // Recursive function to traverse the object and collect keys
// function traverseObject(obj, path = []) {
//   let result = [];
//   for (let key in obj) {
//     if (typeof obj[key] === 'object' && obj[key] !== null) {
//       result = result.concat(traverseObject(obj[key], path.concat(key)));
//     } else if (key === 'value') {
//       result.push({ path: path.concat(key), value: obj[key] });
//     }
//   }
//   return result;
// }

// const elementReferences = {
//   name: 'element-references',
//   preprocessor: (dictionary, options) => {
//     console.log('Preprocessing element references');
//     const elements = dictionary.element;
//     console.log('Elements:', elements);

//     for (let element in elements) {
//       const value = traverseObject(elements[element]);
//       console.log('Element: ', element, ' Value:', value);
//     }

//     return dictionary;
//   },
// };



// Recursive function to traverse the object and collect keys
function traverseObject(obj, path = []) {
  let result = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      result = result.concat(traverseObject(obj[key], path.concat(key)));
    } else if (key === 'value') {
      result.push({ path: path.concat(key), value: obj[key] });
    }
  }
  return result;
}

// Function to resolve the value including modes against the referenced object
function resolveValue(value, group) {
  const path = value.replace(/[{}]/g, '').split('.');
  const [groupName, ...restOfPath] = path;
  const groupObject = group[groupName];
  if (!groupObject) {
    return null;
  }

  const modes = Object.keys(groupObject);
  const resolvedValues = {};

  modes.forEach(mode => {
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
    while (typeof resolvedValue === 'object' && resolvedValue !== null && 'value' in resolvedValue) {
      resolvedValue = resolvedValue['value'];
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

const elementReferences = {
  name: 'element-references',
  preprocessor: (dictionary, options) => {
    console.log('Preprocessing element references');
    const elements = dictionary.element;
    const elementsGroups = Object.keys(elements);

    const theme = dictionary.theme;
    console.log('Elements:', elements);
    console.log('Theme:', theme);

    const allValues = traverseObject(elements);
    console.log('All Values:', allValues);

    // allValues.forEach(item => {
    //   const valuePath = item.path;
    //   const referencePath = item.value.replace(/[{}]/g, '').split('.'); 
    //   const [referenceGroupName, ...referenceScope] = referencePath;
    //   const referenceGroupObject = dictionary[referenceGroupName];
    //   const modes = Object.keys(referenceGroupObject);

    //   modes.forEach(mode => {
    //     console.log('Group Name:', referenceGroupName, ' Mode:', mode, ' Path:', referencePath, ' Value scope:', referenceScope);
    //     // console.log('Value:', referenceGroupObject[mode]);
    //   });

    //   const newObject = {
    //     newKey: {
    //       nestedKey: 'newValue'
    //     }
    //   };
    //   // const resolvedValue = resolveValue(item.value, dictionary[valueGroup]);
    //   // console.log('Resolved Value for', item.path.join('.'), ':', resolvedValue);
    // });

    const newElementsObject = new Object();

    elementsGroups.forEach(group => {
      const groupObject = elements[group];
      

      console.log('Group:', group, ' Object:', groupObject);

      const filteredValues = allValues.filter(item => item.path[0] === group);
      console.log('Filtered Values for group', group, ':', filteredValues);
      
      filteredValues.forEach(item => {
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
      
        // Resolve the reference value against the theme object
        const referencePath = referenceValue.replace(/[{}]/g, '').split('.');
        const resolvedReferenceValue = resolveValue(referenceValue, dictionary);
      
        // Save both as variables
        console.log('Original Object:', originalObject);
        console.log('Resolved Reference Value:', resolvedReferenceValue);
      });
    });
    

    console.log('New Elements:', newElementsObject);
    // dictionary.element = mergeDeep(dictionary.element, newElementsObject);

    return dictionary;
  },
};

StyleDictionary.registerPreprocessor(elementReferences);







// Transform px values to rem
StyleDictionary.registerTransform({
  name: 'dimension/pxToRem',
  type: 'value',
  filter: token => {
    return (token.unit === 'pixel' || token.type === 'dimension') && token.value !== 0
  },
  transform: token => {
    // Load Base Font Size from Config
    const fontBasePx = config.basePxFontSize || 16
    return `${token.value/fontBasePx}rem`
  }
})

// Convert HEX color to HSLA
StyleDictionary.registerTransform({
  name: 'color/hsla',
  type: 'value',
  filter: token => {
    return token.type === 'color' && token.value !== 0
  },
  transform: token => {
    return `${hexToHSL(token.value)}`
  }
})

StyleDictionary.registerTransform({
  name: 'font/fluid',
  type: 'value',
  filter: token => {
    if (token.attributes != undefined) {
      if (token.attributes.category != undefined) {
        const description = typeof(token.description) == 'string' ? token.description : ''
        return ['font'].includes(token.attributes.category) && description.includes('fluid-')
      }
    }
    return false;
  },
  transform: token => {
    if (token.description != undefined) return `("${token.description}": ${token.value})`;

    return token.value;
  }
})

// Create SCSS map if value is an object
StyleDictionary.registerTransform({
  name: 'scss/deepMap',
  type: 'value',
  filter: token => {
    // return typeof(token.value) === 'object' && typeof(token.original.value) === 'object';
    return typeof(token.value) === 'object';
  },
  transform: token => {
    return deepMapSearch(token.value);
  }
})

// // Filter out typography to prevent double font tokens
// StyleDictionary.registerFilter({
//   name: 'noTypography',
//   matcher: function(token) {
//     if (token.attributes != undefined) {
//       if (token.attributes.category != undefined) {
//         return !['typography'].includes(token.attributes.category)
//       }
//     }
//     return true;

//     // return !['typography'].includes(token.attributes.category)
//   }
// })

// // Generic filtering
// StyleDictionary.registerFilter({
//   name: 'validToken',
//   matcher: function(token) {
//     return ['dimension', 'string', 'number', 'color'].includes(token.type)
//   }
// })

