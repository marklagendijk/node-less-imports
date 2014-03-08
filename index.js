var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var lessImports = {
    /**
     * Recursivley finds all the @import paths in a LESS file.
     * @param {string} filePath - The path of the LESS file.
     * @returns {Array.<string>}
     */
    findImports: function(filePath){
        return findImports(filePath, []);
    },
    IMPORT_REGEX: /@import.+?["'](.+?)["']/g
};

/**
 * Recursivley finds all @import paths of a LESS file, using a nice RegEx
 * @param {string} filePath - The path of the LESS file.
 * @param {Array.<string>} result
 * @returns {Array.<string>}
 */
function findImports(filePath, result){
    var importPaths = getImportPaths(filePath);
    var absolutePaths = resolveImportPaths(filePath, importPaths);
    absolutePaths.forEach(function(path){
        if(!_.contains(result, path)){
            result.push(path);
            findImports(path, result);
        }
    });

    return result;
}
/**
 * Finds all the @import paths in a LESS file.
 * @param {string} filePath - The path of the LESS file.
 */
function getImportPaths(filePath){
    var importPaths = [];
    try{
        var contents = fs.readFileSync(filePath);
        var match;
        while(match = lessImports.IMPORT_REGEX.exec(contents)){
            importPaths.push(match[1]);
        }
    }
    catch(exception){}
    return importPaths;
}
/**
 * Resolves @import paths to absolute file paths.
 * @param {string} filePath - The path of the LESS file.
 * @param {Array.<string>} importPaths - The array of @import paths.
 * @returns {Array.<string>}
 */
function resolveImportPaths(filePath, importPaths){
    var dir = path.dirname(filePath);
    return importPaths.map(function(relativePath){
        if(!path.extname(relativePath)){
            relativePath += '.less';
        }
        return path.resolve(dir, relativePath);
    });
}

module.exports = lessImports;