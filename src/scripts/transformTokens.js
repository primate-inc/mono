// const StyleDictionary = require('style-dictionary')
// const config = require('./config.json')

import StyleDictionary from 'style-dictionary';
import config from './config.example.js';
import './transforms/register.js';

// Main function to generate tokens
function transformTokens(dest, token) {
  config.source[0] = token
  config.platforms.scss.buildPath = dest

  const StyleDictionaryExtended = StyleDictionary.extend(config)
  StyleDictionaryExtended.buildAllPlatforms()
}

function transformTokensFromConfig(userConfig) {
  const StyleDictionaryExtended = StyleDictionary.extend(userConfig)
  StyleDictionaryExtended.buildAllPlatforms()
}

export { transformTokens, transformTokensFromConfig };
