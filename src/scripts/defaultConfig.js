// import {
//   logBrokenReferenceLevels,
//   logVerbosityLevels,
//   logWarningLevels,
// } from 'style-dictionary';

const config = {
  "source": [], // value passed via command
  "basePxFontSize": 16,
  // "log": {
  //   "verbosity": logVerbosityLevels.verbose,
  // },
  "platforms": {
    "scss": {
      // "preprocessors": ['resolve-figma-references', 'move-figma-modes'],
      "preprocessors": ['move-figma-modes'],
      "transforms": ["figma/resolveReferences", "attribute/cti", "name/kebab", "time/seconds", "dimension/pxToRem", "scss/deepMap"],
      "buildPath": "", // value passed via command
      "files": [{
        "destination": "tokens.scss",
        "format": "scss/map-deep",
        "options": {
          "outputReferences": false,
          "themable": false
        },
      }]
    }
  }
}

export default config;
