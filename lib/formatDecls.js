var getIndent = require('./getIndent')
var formatValues = require('./formatValues')
var hasDecls = require('./hasDecls')

function formatDecls (rule, indent, indentWidth) {

  if (hasDecls(rule)) {
    rule.walkDecls(function (decl) {
      var isCustomProp = /^--/.test(decl.prop)
      var isIEHack = (/(\*|_)$/).test(decl.raws.before)

      if (decl.prop && !isCustomProp) {
        decl.prop = decl.prop.toLowerCase()
      }

      if (isIEHack) {
        decl.prop = decl.raws.before.trim().replace(/\n/g, '') + decl.prop
      }

      decl.raws.before = '\n' + indent + indentWidth
      decl.raws.between = ': '
      formatValues(decl)
    })
  }


  return rule
}


module.exports = formatDecls
