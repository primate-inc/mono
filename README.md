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

## Welcome to MONO

MONO is a framework agnostic utility library for SASS. It helps to manage your styles between Figma and your code.

MONO is not generating any CSS code, insteead it provides you access to Figma Variables and set of useful tools to help you reflect the designs easier in your code.

## Installation

For now entirely manual.

Future Installation

Requirements

- npm package installer (npm, yarn, pnpm, etc)
- Dart Sass compiler


```
pnpm add -D @primate-inc/mono

pnpm mono init -p ./styles
```

This will install MONO and copy files into the `styles/mono`. Replace example `tokens.json` file with your [DesignTokens](https://github.com/lukasoppermann/design-tokens) exported from Figma. Next you can update all the other files to match your preferences and new tokens file.

```
pnpm mono tokens -p ./styles
```

Next you can import mono at the beginig of your stylesheet `@import 'styles/mono';` and compile you scss files using preffered tool.

## Usage

MONO contains a set of helpful functions and mixins to use your tokens data more efficiently.

## License
This project is licensed under the MIT License.

