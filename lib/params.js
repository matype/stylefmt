var fs = require('fs')
var path = require('path')

var cosmiconfig = require('cosmiconfig')
var repeatString = require('repeat-string')
var editorconfig = require('editorconfig')
var objectAssign = require('object-assign')
var resolveFrom = require('resolve-from');

var isEmptyObject = require('./util').isEmptyObject

var defaultIndentWidth = repeatString(' ', 2)

function hasScssInWorkingDir (wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function getIndentationFromEditorConfig (from, hasScss) {
  var config
  if (hasScss) {
    config = editorconfig.parseSync(path.resolve(process.cwd(), '*.scss'))
  } else {
    config = editorconfig.parseSync(path.resolve(process.cwd(), '*.css'))
  }
  switch ((config || {}).indent_style) {
    case 'tab':
      return '\t'
    case 'space':
      return repeatString(' ', config.indent_size)
    default:
      return defaultIndentWidth
  }
}

function getIndentationFromStylelintRules (rules) {
  var indentaiton = rules['indentation']
  switch (typeof indentaiton) {
    case 'string':
      return '\t'
    case 'number':
      return repeatString(' ', indentaiton)
    default:
      return defaultIndentWidth
  }
}

function augmentParams (originParams, extentions, configPath) {
  var initialValue = Promise.resolve(originParams)
  var promise = extentions.reduce(function (promise, extention) {
    return promise.then(function (mergedParams) {
      // same as the options in stylelint
      var opts = {
        configPath: resolveFrom(configPath, extention),
        argv: false,
      }
      return cosmiconfig(extention, opts).then(function (stylelint) {
        if (!stylelint) {
          return mergedParams
        }

        var params = {}
        var rules = stylelint.config.rules
        params.indentWidth = getIndentationFromStylelintRules(rules)
        params.stylelint = rules

        return objectAssign({}, mergedParams, params)
      })
    })
  }, initialValue)
  return promise
}

function parmas (from) {
  var wd = from || process.cwd()
  // same as the options in stylelint
  var opts = {
    argv: false,
    rcExtensions: true
  }
  return cosmiconfig('stylelint', opts).then(function (stylelint) {
    var params = {}

    var hasScss = hasScssInWorkingDir(wd)
    params.hasScss = hasScss

    if (isEmptyObject(stylelint)) {
      params.indentWidth = getIndentationFromEditorConfig(wd, hasScss)
      params.stylelint = {}
      return Promise.resolve(params)
    }

    var rules = stylelint.config.rules
    if (!isEmptyObject(rules)) {
      params.indentWidth = getIndentationFromStylelintRules(rules)
      params.stylelint = rules
    }

    var extentions = [].concat(stylelint.config.extends)
    return augmentParams(params, extentions, wd)
  })
}

module.exports = parmas
