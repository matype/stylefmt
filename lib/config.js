var fs = require('fs')
var repeatString = require('repeat-string')
var editorconfigIndent = require('editorconfig-indent')
var findConfig = require('find-config')

var editorconfig
var ec
var indentWidth = '  '

try {
  editorconfig = fs.readFileSync(findConfig('.editorconfig'), 'utf-8')
  ec = editorconfigIndent(editorconfig)
} catch (e) {}

if (ec) {
  if (ec.indentStyle === 'tab') {
    indentWidth = '	'
  }
  else if (ec.indentStyle === 'space' || ec.indentStyle === null) {
    indentWidth = repeatString(' ', ec.indentSize)
  }
}


module.exports = {
  indentWidth: indentWidth
}
