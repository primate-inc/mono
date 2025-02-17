import StyleDictionary from 'style-dictionary';
import resolveFigmaReferences from './resolveFigmaReferences.js';
import moveFigmaModes from './moveFigmaModes.js';

StyleDictionary.registerPreprocessor({
    name: "resolve-figma-references",
    preprocessor: (dictionary) => resolveFigmaReferences(dictionary)
});

StyleDictionary.registerPreprocessor({
    name: "move-figma-modes",
    preprocessor: (dictionary) => moveFigmaModes(dictionary)
});