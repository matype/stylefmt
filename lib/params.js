var fs = require('fs')
var path = require('path')
if (!process) {
  process = require('process') // > v0.4.0
}

var cosmiconfig = require('cosmiconfig');
var repeatString = require('repeat-string')
var editorconfig = require('editorconfig')

var isEmptyObject = require('./util').isEmptyObject

var defaultIndentWidth = repeatString(' ', 2)

function hasScssInWorkingDir(wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function getIndentationFromEditorConfig(from, hasScss) {
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

function getIndentationFromStylelintConfig(rules) {
  var indentaiton = rules['indentation']
  switch (typeof indentaiton) {
    case 'string':
      return '\t'
      break
    case 'number':
      return repeatString(' ', indentaiton)
    default:
      return defaultIndentWidth
  }
}

function parmas(from) {
  var wd = path.dirname(from) || process.cwd()
  var params = {}

  var hasScss = hasScssInWorkingDir(wd)
  params.hasScss = hasScss

  return cosmiconfig('stylelint', {
    // same as the options in stylelint
    argv: false,
    rcExtensions: true,
  }).then(function (stylelint) {
    if (isEmptyObject(stylelint)) {
      params.indentWidth = getIndentationFromEditorConfig(wd, hasScss)
      params.stylelint = {}
    } else {
      params.indentWidth = getIndentationFromStylelintConfig(stylelint.config.rules)
      params.stylelint = stylelint.config.rules
    }
    return params
  })
}

module.exports = parmas
