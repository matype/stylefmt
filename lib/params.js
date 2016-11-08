const fs = require('fs')
const path = require('path')
const createStylelint = require('stylelint').createLinter
const editorconfig = require('editorconfig')
const getProperty = require('./util').getProperty
const defaultIndentWidth = ' '.repeat(2)

function hasScssInDir (wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function complementRules (file, rules) {
  rules = rules || {}
  if(!file || ["indentation", "no-missing-end-of-source-newline", "no-eol-whitespace"].every(function (key) {
      return getProperty(rules, key)
    })) {
    return rules
  }

  function setRules (key, value) {
    if(value != null && !getProperty(rules, key)) {
      if(Array.isArray(rules[key])) {
        rules[key][0] = value
      } else {
        rules[key] = value
      }
    }
  }

  return editorconfig.parse(file).then(function (editorconfig) {
    if (editorconfig) {
      if (editorconfig.indent_style) {
        setRules("indentation", /^space$/i.test(editorconfig.indent_style) ? +editorconfig.indent_size || 2 : "tab")
      }
      setRules("no-missing-end-of-source-newline", editorconfig.insert_final_newline)
      setRules("no-eol-whitespace", editorconfig.trim_trailing_whitespace)
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

function loadConfig (stylelint, file, configFile) {
  return stylelint.getConfigForFile(file, configFile).then(function (stylelintrc){
    return stylelintrc && stylelintrc.config && stylelintrc.config.rules
  }).catch(function (err) {
    if (!/\bNo configuration provided\b/.test(err.message)) {
      throw err
    }
  }).then(function (stylelintrc) {
    if (!file) {
      var cwd = process.cwd()
      file = path.join(cwd, hasScssInDir(cwd) ? '*.scss' : '*.css')
    }

    return complementRules(file, stylelintrc)
  }).then(function (rules) {
    return {
      indentWidth: getIndentationFromStylelintRules(rules),
      hasScss: /\.scss$/i.test(file),
      stylelint: rules,
    }
  })
}

function params (options) {
  options = options || {}
  const tailoredOptions = (options.rules)
    ? { config: options }
    : options
  const stylelint = createStylelint(tailoredOptions)

  return function (root) {
    const file = root.source.input.file || options.from
    const configFile = options.configFile
    return loadConfig(stylelint, file, configFile)
  }
}

module.exports = params
