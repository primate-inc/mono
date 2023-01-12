import StyleDictionary from 'style-dictionary';
import config from '../examples/mono.config.js';
import './transforms/register.js';

// Main function to generate tokens
function transformTokens(dest, token) {
  config.source[0] = token
  config.platforms.scss.buildPath = dest

  const StyleDictionaryExtended = StyleDictionary.extend(config)
  StyleDictionaryExtended.buildAllPlatforms()
}

// Alternative to the above, this time using user config file
function transformTokensFromConfig(userConfig) {
  const StyleDictionaryExtended = StyleDictionary.extend(userConfig)
  StyleDictionaryExtended.buildAllPlatforms()
}

export { transformTokens, transformTokensFromConfig };
