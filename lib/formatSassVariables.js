var formatTransforms = require('./formatTransforms')
var formatColors = require('./formatColors')
var formatZeros = require('./formatZeros')

function formatSassVariables (root, params) {
  var stylelint = params.stylelint

  root.walkDecls(function (decl) {
    if (isSassVariable(decl)) {
      if (isSassMaps(decl)) {
        return
      }
      var isFunctionCall = (/\w+\(.+\)/).test(decl.value)

      // format math operators before `$` or `(`.
      decl.value = decl.value.trim().replace(/(?!^)[+\-*/%](?=\$|\()/g, ' $& ')

      if (!isFunctionCall) {
        // format "+", "*" and "%" before a number
        decl.value = decl.value.replace(/(?!^)[+*%](?=\d)/g, ' $& ')

        // don't format minus sign (-) before a number
        // because we don't know if it is
        // part of a Sass variable name (e.g. $my-var-1-2).
        var hasVariableWithDash = (/\$\w+-\w+/).test(decl.value)

        if (!hasVariableWithDash) {
          // format minus sign between numbers if safe
          decl.value = decl.value.replace(/\d+-(?=\d)/g, function (value) {
            return value.replace(/-/g, ' $& ')
          })
        }

        // "/" can not be formatted if it's not inside parens,
        // because we don't know if it's used as CSS "font" shorthand property.
        var isDivideInParens = (/\(.+\/.+\)/).test(decl.value)
        if (isDivideInParens) {
          decl.value = decl.value.replace(/\/(?=\d)/g, ' $& ')
        }
      }

      var isDataUrl = (/data:.+\/(.+);base64,(.*)/).test(decl.value)

      if (!isDataUrl) {
        // Remove spaces before commas and keep only one space after.
        decl.value = decl.value.trim().replace(/(\s+)?,(\s)*/g, ', ')
      }

      decl.value = formatZeros(decl.value, stylelint)
      decl.value = formatColors(decl.value, stylelint)
      decl.value = formatTransforms(decl.value)

      if (decl.prev()) {
        decl.raws.before = '\n'
      }

      decl.raws.between = ': '
    }
  })
}

function isSassVariable (decl) {
  return decl.parent.type === 'root' && decl.prop.match(/^\$/)
}

function isSassMaps (decl) {
  return decl.prop.match(/^\$/) && decl.value.match(/^\(\s*\w+:\s*/)
}

module.exports = formatSassVariables
