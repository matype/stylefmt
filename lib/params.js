var fs = require('fs')
var path = require('path')

var cosmiconfig = require('cosmiconfig')
var editorconfig = require('editorconfig')
var objectAssign = require('object-assign')
var resolveFrom = require('resolve-from')

var isEmptyObject = require('./util').isEmptyObject

var defaultIndentWidth = ' '.repeat(2)

function hasScssInWorkingDir (wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function getIndentationFromEditorConfig (from) {
  return editorconfig.parse(from).then(function(config) {
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
    var newParams = objectAssign({}, params, originParams)
    return loadStylelintExtendConfig(newParams, config, dirname)
  })
}

function params (options, form) {

  var cwd = process.cwd()

  if(!form) {
    form = path.join(cwd, hasScssInWorkingDir(cwd) ? '*.scss' : '*.css' )
  }

  return loadStylelintConfig(options).then(function(stylelint) {
    var params = {}

    params.hasScss = /\.scss$/i.test(form)

    if (!stylelint) {
      return getIndentationFromEditorConfig(form).then(function(indentWidth) {
        params.indentWidth = indentWidth
        params.stylelint = {}
        return params
      })
    }

    var rules = stylelint.config.rules
    if (!isEmptyObject(rules)) {
      params.indentWidth = getIndentationFromStylelintRules(rules)
      params.stylelint = rules
    }
    return loadStylelintExtendConfig(params, stylelint.config, options.configBasedir || cwd)
  })
}

function loadStylelintConfig (options) {
  // same as the options in stylelint. see: http://stylelint.io/user-guide/node-api/#options
  if(typeof options.config === "object") {
    return Promise.resolve(options)
  } else {
    return cosmiconfig('stylelint', {
      argv: false,
      rcExtensions: true,
      configPath: options.configFile || options.config,
    })
  }
}

module.exports = params
