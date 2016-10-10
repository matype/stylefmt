var formatValues = require('./formatValues')
var hasDecls = require('./hasDecls')
var getProperty =  require('./util').getProperty

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

      decl.raws.between = ': '

      var declBefore
      var prev = decl.prev()
      if (prev && prev.type === 'comment') {
        var nlCount = decl.raws.before.split('\n').length - 1
        if (nlCount) {
          declBefore = '\n'.repeat(nlCount) + indent + indentWidth
        }
      } else {
        declBefore = '\n' + indent + indentWidth
      }
      decl.raws.before = declBefore

      if (getProperty(stylelint, 'declaration-colon-space-before')) {
        decl.raws.between = declarationColonSpaceBefore(stylelint, decl.raws.between)
      }

      if (getProperty(stylelint, 'declaration-colon-space-after')) {
        decl.raws.between = declarationColonSpaceAfter(stylelint, decl.raws.between)
      }

      formatValues(decl, stylelint)
    })
  }

  return rule
}

function declarationColonSpaceBefore (stylelint, between) {
  switch (getProperty(stylelint, 'declaration-colon-space-before')) {
    case 'always':
      return ' ' + between
    default:
      return between
  }
}

function declarationColonSpaceAfter (stylelint, between) {
  switch (getProperty(stylelint, 'declaration-colon-space-after')) {
    case 'never':
      return between.trim()
    default:
      return between
  }
}

module.exports = formatDecls
