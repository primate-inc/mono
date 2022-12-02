#!/usr/bin/env node
'use strict';

import meow from 'meow';
import copyFiles from './src/scripts/copyFiles.js';
import { transformTokens, transformTokensFromConfig } from './src/scripts/transformTokens.js'

const pkgName = 'MONO';
const pkgCommand = 'mono';
const pkgFolderName = 'mono';

const cli = meow(`
	Usage
	$ ${pkgCommand} <command> <options>

	Commands
		copy <options -do> Copies ${pkgName} folder to destination directory.
		tokens <options -dt> Generates SCSS tokens from JSON file

	Options
		--token, -t  Tokens source file exported from Figma in JSON file.
		--config, -c  Style-Dictionary JSON config file path.
		--dest, -d  Destination path inside the project where ${pkgFolderName} folder should be copied to.
		--overwrite, -o  Overwrite files on copy.

	Examples
		$ ${pkgCommand} copy --dest path/to/scss -o
		$ ${pkgCommand} tokens -t ./tokens.json
`, {
	importMeta: import.meta,
	flags: {
		token: {
			type: 'string',
			alias: 't',
			// isRequired: (flags, input) => input[0] == 'tokens' ? true : false
		},
		config: {
			type: 'string',
			alias: 'c',
			// isRequired: (flags, input) => input[0] == 'tokens' ? true : false
		},
		dest: {
			type: 'string',
			alias: 'd',
			isRequired: (flags, input) => input[0] == 'copy' ? true : false
		},
		overwrite: {
			type: 'boolean',
			alias: 'o',
			default: false
		}
	}
});

const currentCommand = cli.input[0];

switch (currentCommand) {
	case 'copy' :
		console.log('copying')
		copyFiles(cli.flags.dest, cli.flags.overwrite)
		break
	case 'tokens' :
		console.log('tokening')
		if (cli.flags.config != undefined) {
			transformTokensFromConfig(cli.flags.config)
		} else {
			transformTokens(cli.flags.dest, cli.flags.token)
		}
		break
	default:
		console.log('Command not found.')
		console.log(cli.help)
}

