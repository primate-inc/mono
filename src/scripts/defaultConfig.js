const defaultConfig = {
  "source": [], // value passed via command
  "basePxFontSize": 16,
  "platforms": {
    "scss": {
      // "transforms": ["attribute/cti", "name/cti/kebab", "time/seconds", "dimension/pxToRem", "color/hsla", "scss/deepMap"],
      "transforms": ["attribute/cti", "name/cti/kebab", "time/seconds", "dimension/pxToRem", "scss/deepMap"],
      // "transforms": ["custom", "attribute/cti", "name/cti/kebab", "time/seconds",],
      "buildPath": "", // value passed via command
      "files": [{
        "destination": "tokens.scss",
        "format": "scss/map-deep",
        "options": {
          "outputReferences": true,
          "themable": false
        },
        "filter": ["noTypography"]
      }]
    }
  }
}

export default defaultConfig;
