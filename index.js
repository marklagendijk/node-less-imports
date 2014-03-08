var fs = require('fs');
var path = require('path');

var lessImports = {
    /**
     * Finds the imports in a LESS file.
     * @param {string} filePath - The path of the LESS file.
     * @param {string} [contents] - The contents of the LESS file. If null or undefined, fs.readFileSync is used to read the file.
     * @param {boolean} [returnRelativePaths=false] - Return the paths as specified in the @imports, instead of resolving them to absolute paths.
     * @returns {Array.<string>}
     */
    findImports: function(filePath, contents, returnRelativePaths){
        if(contents === undefined || contents === null){
            contents = fs.readFileSync(filePath);
        }
        var paths = findRelativeImports(contents);
        if(returnRelativePaths){
            return paths;
        }
        else{
            return resolveRelativePaths(filePath, paths);
        }

    },
    IMPORT_REGEX: /@import.+?["'](.+?)["']/g
};

/**
 * Finds all @import paths, using a nice RegEx
 * @param lessCode
 * @returns {Array.<string>}
 */
function findRelativeImports(lessCode){
    // Find all matches.
    var matches = [];
    var match;
    while(match = lessImports.IMPORT_REGEX.exec(lessCode)){
        matches.push(match[1]);
    }

    // Add '.less' extension, if no extension.
    return matches.map(function(relativePath){
        if(!path.extname(relativePath)){
            relativePath += '.less';
        }
        return relativePath;
    });
}

/**
 * Resolves relative paths to absolute paths.
 * @param filePath - The file which the paths are relative to.
 * @param relativePaths - The paths which should be resolved.
 * @returns {Array.<string>}
 */
function resolveRelativePaths(filePath, relativePaths){
    var dir = path.dirname(filePath);
    return relativePaths.map(function(relativePath){
        return path.resolve(dir, relativePath);
    });
}

module.exports = lessImports;