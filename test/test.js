var lessImports = require('../');
var filePaths = lessImports.findImports(__dirname + '/less1.less');
console.log(filePaths);