'use strict'

import fs from 'fs-extra';
import url from 'url';
import path from 'path';

async function copyFile(file, dest) {
    try {
        const data = await fs.readFile(file, 'utf8')
        console.log('saveFile read -> ', file, dest, data)
        await fs.outputFile(dest, data)
    } catch (err) {
        console.error(err)
    }
}

async function copyFilesArray(arr, dest) {
    try {
        // get package dir
        const __filename = url.fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // get users cwd
        const cwd = process.env.PWD

    console.log('^^^')
    console.log(__filename)
    console.log(__dirname)
    console.log(cwd)
    console.log('^^^')
        
        arr.forEach(file => {
            console.log(dest)
            
            const fileDest = dest[0] == '.' ? (dest + '/' + file).replace('//', '/') : (cwd + '/' + dest + '/' + file).replace('//','/')

            const filePath = path.join(__dirname, '..', 'examples', file);

            copyFile(filePath, fileDest)
        })
    } catch (err) {
        console.error(err)
    }
}

async function init(userPath) {
    const scssConfig = ['mono.config.scss', 'mono.slots.scss', 'mono.tokens.scss']
    const jsConfig = ['mono.config.js']

    await copyFilesArray(scssConfig, userPath)
    await copyFilesArray(jsConfig, userPath)
}

export default init;

