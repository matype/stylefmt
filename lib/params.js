const fs = require('fs')
const path = require('path')
const createStylelint = require('stylelint').createLinter
const editorconfig = require('editorconfig')
const getProperty = require('./util').getProperty
const defaultIndentWidth = ' '.repeat(2)
const stylelintCache = new Map()

function hasScssInDir (wd) {
  var dirs = fs.readdirSync(wd)
  return dirs.some(function (dir) {
    return dir.match(/.*\.scss/)
  })
}

function getEditorConfig (file, rules) {
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

function loadStylelintConfig (options, form) {
  var stylelint
  if (stylelintCache.has(options)) {
    stylelint = stylelintCache.get(options)
  } else {
    const tailoredOptions = (options.rules)
      ? { config: options }
      : options
    stylelint = createStylelint(tailoredOptions)
    stylelintCache.set(options, stylelint)
  }
  return stylelint.getConfigForFile(form, options.configFile).then(function (stylelint){
    return stylelint && stylelint.config && stylelint.config.rules
  }).catch(function (err) {
    if(options.configFile) {
      var configFile
      try {
        configFile = require.resolve(options.configFile)
      } catch (ex) {
        //
      }
      if(configFile && configFile !== options.configFile) {
        options.configFile = configFile
        return loadStylelintConfig(options, form)
      }
    }
    if (!/\bNo configuration provided\b/.test(err.message)) {
      throw err
    }
  })
}

function params (root, options) {
  var form = options.from || root.source.input.file

  return loadStylelintConfig(options, form).then(function (stylelint) {
    if (!form) {
      var cwd = process.cwd()
      form = path.join(cwd, hasScssInDir(cwd) ? '*.scss' : '*.css')
    }

    return getEditorConfig(form, stylelint)
  }).then(function (rules) {
    return {
      indentWidth: getIndentationFromStylelintRules(rules),
      hasScss: /\.scss$/i.test(form),
      stylelint: rules,
    }
  })
}

module.exports = params
