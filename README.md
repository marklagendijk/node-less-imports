# node-less-imports
Simple utility which recursively finds all the files which are @import-ed by a LESS file.

## Usage
``` javascript
var lessImports = require('less-imports');
var filePaths = lessImports.findImports('/less1.less');
```
