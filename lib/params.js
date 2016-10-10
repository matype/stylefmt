const fs = require('fs')
const path = require('path')
const createStylelint = require('stylelint').createLinter
const editorconfig = require('editorconfig')
const isEmptyObject = require('./util').isEmptyObject
const defaultIndentWidth = ' '.repeat(2)
const stylelintCache = new Map()

function hasScssInDir (wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function getIndentationFromEditorConfig (from) {
  return editorconfig.parse(from).then(function (config) {
    switch ((config || {}).indent_style) {
      case 'tab':
        return '\t'
      case 'space':
        return ' '.repeat(config.indent_size)
      default:
        return defaultIndentWidth
    }
  })
}

function getIndentationFromStylelintRules (rules) {
  var indentation = rules['indentation']
  if (typeof indentation === 'object') {
    indentation = indentation[0]
  }
  switch (typeof indentation) {
    case 'string':
      return '\t'
    case 'number':
      return ' '.repeat(indentation)
    default:
      return defaultIndentWidth
  }
}

function params (options, form) {

  if (!form) {
    var cwd = process.cwd()
    form = path.join(cwd, hasScssInDir(cwd) ? '*.scss' : '*.css')
  }
  return loadStylelintConfig(options, form).then(function (stylelint) {
    var params = {
      hasScss: /\.scss$/i.test(form)
    }

    var rules = stylelint && stylelint.config && stylelint.config.rules
    if (isEmptyObject(rules)) {
      return getIndentationFromEditorConfig(form).then(function (indentWidth) {
        params.indentWidth = indentWidth
        params.stylelint = {}
        return params
      })
    } else {
      params.indentWidth = getIndentationFromStylelintRules(rules)
      params.stylelint = rules
      return params
    }
  })
}

function loadStylelintConfig (options, form) {
  var result
  if (stylelintCache.has(options)) {
    result = stylelintCache.get(options)
  } else {
    result = createStylelint(options).getConfigForFile(form).catch(function () {})
    stylelintCache.set(options, result)
  }
  return result
}

module.exports = params
