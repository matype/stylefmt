var fs = require('fs')
var path = require('path')
var createStylelint = require('stylelint').createLinter
var editorconfig = require('editorconfig')
var getProperty = require('./util').getProperty
var defaultIndentWidth = ' '.repeat(2)

function hasScssInDir (wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function getEditorConfig (file) {

  var rules = {}

  function setRuleValue (ruleName, value) {
    if (value != null) {
      if (Array.isArray(rules[ruleName])) {
        rules[ruleName][0] = value
      } else {
        rules[ruleName] = [value]
      }
    }
  }

  return editorconfig.parse(file).then(function (editorconfig) {
    if (editorconfig) {
      if (editorconfig.indent_style) {
        setRuleValue('indentation', /^space$/i.test(editorconfig.indent_style) ? +editorconfig.indent_size || 2 : 'tab')
      }
      setRuleValue('no-missing-end-of-source-newline', editorconfig.insert_final_newline)
      setRuleValue('no-eol-whitespace', editorconfig.trim_trailing_whitespace)
    }
    return rules
  })
}

function getIndentationFromStylelintRules (rules) {
  var indentation = getProperty(rules, 'indentation')

  switch (typeof indentation) {
    case 'string':
      return '\t'
    case 'number':
      return ' '.repeat(indentation)
    default:
      return defaultIndentWidth
  }
}

function loadConfig (stylelint, file, options) {
  return stylelint.isPathIgnored(file).then(function (isIgnored) {
    if (isIgnored) {
      return null
    }
    return stylelint.getConfigForFile(file).then(function (stylelintrc) {
      return stylelintrc && stylelintrc.config && stylelintrc.config.rules
    })
  }).catch(function (err) {
    var fileNotFound = err.code === 'ENOENT' && path.resolve(process.cwd(), options.codeFilename) === err.path
    if (fileNotFound || /\bNo configuration provided\b/.test(err.message)) {
      if (!file) {
        var cwd = process.cwd()
        file = path.join(cwd, hasScssInDir(cwd) ? '*.scss' : '*.css')
      }

      return getEditorConfig(file)
    } else {
      throw err
    }
  }).then(function (rules) {
    if(rules) {
      return {
        indentWidth: getIndentationFromStylelintRules(rules),
        hasScss: /\.scss$/i.test(file),
        stylelint: rules,
      }
    }
    return rules
  })
}

function params (options) {
  options = options || {}
  var tailoredOptions = (options.rules)
    ? { config: options }
    : options
  var stylelint = createStylelint(tailoredOptions)

  return function (root, result) {
    if (result.stylelint && result.stylelint.ignored) {
      return Promise.resolve(null)
    }
    var file = root.source.input.file || options.from
    return loadConfig(stylelint, file, options)
  }
}

module.exports = params
