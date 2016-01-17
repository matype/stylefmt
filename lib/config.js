var path = require('path')
var repeatString = require('repeat-string')
var editorconfig = require('editorconfig')

var defaultIndentWidth = repeatString(' ', 2)

function parseConfig(from) {
  var config = editorconfig.parseSync(from)
  if (config == undefined) {
    return defaultIndentWidth
  }
  if (config.indent_style === 'tab') {
    return '\t'
  }
  else if (config.indent_style === 'space') {
    return repeatString(' ', config.indent_size)
  }
  return defaultIndentWidth
}

var indentWidth
indentWidth = parseConfig(path.resolve(process.cwd(), '*.css'))
indentWidth = parseConfig(path.resolve(process.cwd(), '*.scss'))

module.exports = {
  indentWidth: indentWidth
}
