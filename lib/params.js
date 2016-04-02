var path = require('path')
var process = require('process')

var rc = require('rc-loader')
var repeatString = require('repeat-string')
var editorconfig = require('editorconfig')

var defaultIndentWidth = repeatString(' ', 2)

function loadStylelint(from) {
  var configName = 'stylelint'
  return rc(configName, {}, { config: path.join(from, configName) }).rules || {}
}

function getIndentWidthFromEditorConfig(from) {
  var config = editorconfig.parseSync(from)
  if (config == undefined) {
    return defaultIndentWidth
  }
  switch (config.indent_style) {
    case 'tab': return '\t'
    case 'space': return repeatString(' ', config.indent_size)
    default: return defaultIndentWidth
  }
}

function isEmptyObject(obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}

function newParmas(from) {
  var wd = from || process.cwd()
  var params = {}

  var stylelintConfig = loadStylelint(wd)
  if (isEmptyObject(stylelintConfig)) {
    params.indentWidth = getIndentWidthFromEditorConfig(wd)
    params.stylelint = {}
    return params
  }

  var indentaiton = stylelintConfig.indentation
  switch (typeof indentation) {
    case 'string':
      params.indentWidth = '\t'
      break
    case 'number':
      params.indentWidth = repeatString(' ', indentaiton)
      break
    default:
      params.indentWidth = defaultIndentWidth
      break
  }
  params.stylelint = stylelintConfig
  return params
}

module.exports = newParmas
