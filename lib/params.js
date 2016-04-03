var fs = require('fs')
var path = require('path')
if (!process) {
  process = require('process') // > v0.4.0
}

var rc = require('rc-loader')
var repeatString = require('repeat-string')
var editorconfig = require('editorconfig')

var defaultIndentWidth = repeatString(' ', 2)

function loadStylelint(from) {
  var configName = 'stylelint'
  return rc(configName, {}, { config: path.join(from, configName) }).rules || {}
}

function getIndentWidthFromEditorConfig(from, hasScss) {
  var config
  if (hasScss) {
    config = editorconfig.parseSync(path.resolve(process.cwd(), '*.scss'))
  } else {
    config = editorconfig.parseSync(path.resolve(process.cwd(), '*.css'))
  }
  if (config == undefined) {
    return defaultIndentWidth
  }
  switch (config.indent_style) {
    case 'tab':
      return '\t'
    case 'space':
      return repeatString(' ', config.indent_size)
    default:
      return defaultIndentWidth
  }
}

function isEmptyObject(obj) {
  for (var name in obj) {
    return false
  }
  return true
}

function hasScssInWorkingDir(wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function newParmas(from) {
  var wd = path.dirname(from) || process.cwd()
  var params = {}

  var hasScss = hasScssInWorkingDir(wd)
  params.hasScss = hasScss

  var stylelintConfig = loadStylelint(wd)
  if (isEmptyObject(stylelintConfig)) {
    params.indentWidth = getIndentWidthFromEditorConfig(wd, hasScss)
    params.stylelint = {}
    return params
  }

  var indentaiton = stylelintConfig['indentation']
  switch (typeof indentaiton) {
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
