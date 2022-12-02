'use strict'

import fs from 'fs-extra';

// Async/Await:
async function copyFiles(destination, overwrite) {
  const cwd = process.env.PWD
  const userPath = (destination + '/mono/').replace('//', '/')
  const src = (cwd + '/node_modules/monolith/src/mono').replace('//','/')
  const dest = userPath[0] == '.' ? userPath : (cwd + '/' + userPath).replace('//','/')

  try {
    await fs.copy(src, dest, {
      overwrite: overwrite,
      errorOnExist: true,
    });
    console.log(
      '\x1b[32m',
      `Yay! Mono was copied to: ${dest}. Now simply @import mono folder in your main scss file.`
    );
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(
        '\x1b[36m',
        `It looks like ${userPath} folder already exist. Complementary files were added to it. Use -o to overwrite files.`
      );
      return false;
    }
    throw error;
  }
}

export default copyFiles;

