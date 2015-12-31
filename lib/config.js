var fs = require('fs')
var repeatString = require('repeat-string')
var editorconfigIndent = require('editorconfig-indent')
var findConfig = require('find-config')

var editorconfig
var ec
var indentWidth = '  '

try {
  editorconfig = fs.readFileSync(findConfig('.editorconfig'), 'utf-8')
  ec = editorconfigIndent(editorconfig, ['css', 'scss'])
} catch (e) {}

if (ec) {
  if (ec.indentStyle.all === 'tab') {
    indentWidth = '	'
  }
  else if (ec.indentStyle.all === 'space' || ec.indentStyle.all === null) {
    indentWidth = repeatString(' ', ec.indentSize.all)
  }

  if (ec.indentSize.css || ec.indentStyle.css) {
    if (ec.indentStyle.all === 'tab') {
      indentWidth = '	'
    }
    else if (ec.indentStyle.css === 'space' || ec.indentStyle.css === null) {
      indentWidth = repeatString(' ', ec.indentSize.css)
    }
  }

  if (ec.indentSize.scss || ec.indentStyle.scss) {
    if (ec.indentStyle.all === 'tab') {
      indentWidth = '	'
    }
    else if (ec.indentStyle.scss === 'space' || ec.indentStyle.scss === null) {
      indentWidth = repeatString(' ', ec.indentSize.scss)
    }
  }
}


module.exports = {
  indentWidth: indentWidth
}
