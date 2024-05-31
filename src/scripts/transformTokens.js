import StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';
import path from 'path';
import './transforms/register.js';
import defaultConfig from './defaultConfig.js';

// Main function to generate tokens
async function transformTokens(dest) {
  const userProjectDir = path.join(path.resolve(dest), 'mono');
  const configPath = path.join(userProjectDir, 'config.js');
  let config;

  if (!fs.existsSync(configPath)) { // Check if the configPath exists
    config = defaultConfig;
  } else {
    try {
        const module = await import(configPath);
        config = module.default || module;
    } catch (err) {
      console.error('Failed to load config:', err);
      return;
    }
  }

    config.source = [path.join(userProjectDir, 'tokens.json')];
    config.platforms.scss.buildPath = userProjectDir;
    if (!config.platforms.scss.buildPath.endsWith('/')) {
        config.platforms.scss.buildPath += '/';
    }
    config.platforms.scss.files.destination = path.join(userProjectDir, 'tokens.scss');

  const StyleDictionaryExtended = StyleDictionary.extend(config);

  StyleDictionaryExtended.buildAllPlatforms();
}

export { transformTokens };

