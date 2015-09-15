var fs = require('fs')
var repeatString = require('repeat-string')
var editorconfigIndent = require('editorconfig-indent')

var editorconfig
var ec

try {
  editorconfig = fs.readFileSync(process.cwd() + '/.editorconfig', 'utf-8')
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
else {
  indentWidth = '  '
}


module.exports = {
  indentWidth: indentWidth
}
