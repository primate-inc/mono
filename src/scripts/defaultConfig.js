const config = {
  "source": [], // value passed via command
  "basePxFontSize": 16,
  "platforms": {
    "scss": {
      "preprocessors": ['resolve-figma-references', 'move-figma-modes'],
      "transforms": ["attribute/cti", "name/kebab", "time/seconds", "dimension/pxToRem", "scss/deepMap"],
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
