```
      ___           ___           ___           ___     
     /__/\         /  /\         /__/\         /  /\    
    |  |::\       /  /::\        \  \:\       /  /::\   
    |  |:|:\     /  /:/\:\        \  \:\     /  /:/\:\  
  __|__|:|\:\   /  /:/  \:\   _____\__\:\   /  /:/  \:\ 
 /__/::::| \:\ /__/:/ \__\:\ /__/::::::::\ /__/:/ \__\:\
 \  \:\~~ \_\/ \  \:\ /  /:/ \  \:\~~\~~\/ \  \:\ /  /:/
  \  \:\        \  \:\  /:/   \  \:\        \  \:\  /:/ 
   \  \:\        \  \:\/:/     \  \:\        \  \:\/:/  
    \  \:\        \  \::/       \  \:\        \  \::/   
     \__\/         \__\/         \__\/         \__\/    

```

## Hello world

## Usage
Those steps are likely to change in the future releases.

1. Install `mono` globally
```
npm install -g @primate-inc/mono
```
2. Add `tokens.json` exported from your Figma project.
3. Add config file and update  `source`, `buildPath` and `destination` if needed.
```
# config.json
{
  "source": ["./token.json"],
  "basePxFontSize": 16,
  "platforms": {
    "scss": {
      "transforms": ["attribute/cti", "name/cti/kebab", "time/seconds", "dimension/pxToRem", "color/hsla", "scss/deepMap"],
      "buildPath": "./scss/",
      "files": [{
        "destination": "tokens.scss",
        "format": "scss/map-deep",
        "options": {
          "outputReferences": false,
          "themable": false
        },
        "filter": "noTypography"
      }]
    }
  }
}
```
4. Add example files and update them to match your tokens and config, next link them in your main scss file.
```
# main.scss

@import 'tokens';
@import 'config';
@import 'slots';

@import '@primate-inc/mono';
```
