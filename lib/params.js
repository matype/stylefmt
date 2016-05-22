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

function loadStylelintExtendConfig (params, config, configPath) {
  if (isEmptyObject(config.extends)) {
    return Promise.resolve(params)
  }
  return [].concat(config.extends).reduce(function (promise, extention) {
    return promise.then(function (mergedParams) {
      return augmentParams(mergedParams, extention, configPath)
    })
  }, Promise.resolve(params))
}

function augmentParams (originParams, extention, configPath) {
  // same as the options in stylelint
  var opts = {
    configPath: resolveFrom(configPath, extention),
    argv: false,
  }
  return cosmiconfig(extention, opts).then(function (stylelint) {
    if (!stylelint) {
      return Promise.resolve(originParams)
    }
    var config = stylelint.config
    var dirname = path.dirname(stylelint.filepath)
    var rules = config.rules
    if (isEmptyObject(rules)) {
      return loadStylelintExtendConfig(originParams, config, dirname)
    }
    var params = {}
    params.indentWidth = getIndentationFromStylelintRules(rules)
    params.stylelint = rules
    var newParams = objectAssign({}, originParams, params)
    return loadStylelintExtendConfig(newParams, config, dirname)
  })
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

    if (!stylelint) {
      params.indentWidth = getIndentationFromEditorConfig(wd, hasScss)
      params.stylelint = {}
      return Promise.resolve(params)
    }

    var rules = stylelint.config.rules
    if (!isEmptyObject(rules)) {
      params.indentWidth = getIndentationFromStylelintRules(rules)
      params.stylelint = rules
    }
    return loadStylelintExtendConfig(params, stylelint.config, wd)
  })
}

module.exports = parmas
