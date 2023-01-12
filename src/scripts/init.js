'use strict'

import fs from 'fs-extra';

// Async/Await:
async function init(destination, overwrite) {
  const cwd = process.env.PWD
  const userPath = (destination + '/mono/').replace('//', '/')
  const src = (cwd + '/node_modules/monolith/src/examples/mono.config.js').replace('//','/')
  const dest = userPath[0] == '.' ? userPath : (cwd + '/' + userPath).replace('//','/')

  try {
    await fs.copy(src, dest, {
      overwrite: overwrite,
      errorOnExist: true,
    });
    console.log(
      '\x1b[32m',
      `Mono config was copied to: ${dest}.`
    );
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(
        '\x1b[36m',
        `It looks like file already exist. Use -o to overwrite files.`
      );
      return false;
    }
    throw error;
  }
}

export default init;

