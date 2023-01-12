#!/usr/bin/env node
'use strict';

import meow from 'meow';
import init from './src/scripts/init.js';
import copyExamples from './src/scripts/copyExamples.js';
import { transformTokens, transformTokensFromConfig } from './src/scripts/transformTokens.js'

const pkgName = 'MONO';
const pkgCommand = 'mono';
const pkgFolderName = 'mono';

const cli = meow(`
	Usage
	$ ${pkgCommand} <command> <options>

	Commands
		init <options -do> Copies ${pkgName} example files to destination directory.
		tokens <options -dt> Generates SCSS tokens from JSON file

	Options
		--token, -t  Tokens source file exported from Figma in JSON file.
		--config, -c  Style-Dictionary JSON config file path.
		--dest, -d  Destination path inside the project where ${pkgName} example files should be copied to.
		--overwrite, -o  Overwrite files on init.

	Examples
		$ ${pkgCommand} init --dest path/to/project -o
		$ ${pkgCommand} examples --dest path/to/scss -o
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
			isRequired: (flags, input) => input[0] == 'init' ? true : false
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
	case 'init' :
		console.log(`Initializing ${pkgName}.`)
		init(cli.flags.dest, cli.flags.overwrite)
		break
	case 'examples' :
		console.log(`Copying ${pkgName} example files.`)
		init(cli.flags.dest, cli.flags.overwrite)
		break
	case 'tokens' :
		console.log('Generating SCSS tokens.')
		if (cli.flags.config != null) {
			transformTokensFromConfig(cli.flags.config)
		} else {
			if (cli.flags.dest != null || cli.flags.token != null) {
				transformTokens(cli.flags.dest, cli.flags.token)
			} else {
				console.log('Intialization unsuccessful. Missing command options.')
				console.log(cli.help)
			}
		}
		break
	default:
		console.log(`Command '${currentCommand}' not found.`)
		console.log(cli.help)
}

