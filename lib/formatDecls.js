var getIndent = require('./getIndent')
var formatValues = require('./formatValues')
var hasDecls = require('./hasDecls')

function formatDecls (rule, indent, indentWidth, stylelint) {

  if (hasDecls(rule)) {
    rule.walkDecls(function (decl) {
      var isCustomProp = /^--/.test(decl.prop)
      var isSassVal = /^\$/.test(decl.prop)
      var isIEHack = (/(\*|_)$/).test(decl.raws.before)

      if (decl.prop && !isCustomProp && !isSassVal) {
        decl.prop = decl.prop.toLowerCase()
      }

      if (isIEHack) {
        decl.prop = decl.raws.before.trim().replace(/\n/g, '') + decl.prop
      }

      decl.raws.before = '\n' + indent + indentWidth
      decl.raws.between = ': '

      if (stylelint && stylelint['declaration-colon-space-before']) {
        decl.raws.between = declarationColonSpaceBefore(stylelint, decl.raws.between)
      }

      formatValues(decl)
    })
  }

  return rule
}

function declarationColonSpaceBefore(stylelint, between) {
  switch (stylelint['declaration-colon-space-before']) {
    case 'always':
      return ' ' + between
    default:
      break
  }
}

module.exports = formatDecls
