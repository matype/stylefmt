var fs = require('fs')
var repeatString = require('repeat-string')
var editorconfigIndent = require('editorconfig-indent')
var editorconfig = fs.readFileSync(process.cwd() + '/.editorconfig', 'utf-8')
var ec = editorconfigIndent(editorconfig)

if (ec.indentStyle === 'tab') {
  indentWidth = '	'
}
else if (ec.indentStyle === 'space' || ec.indentStyle === null) {
  indentWidth = repeatString(' ', ec.indentSize)
}

module.exports = {
  indentWidth: indentWidth
}
