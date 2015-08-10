var sortBorderValues = require('sort-border-values')
var getIndent = require('./getIndent')

function formatDecls (rule) {
  rule.eachDecl(function (decl) {
    decl.before = '\n' + getIndent(rule)
    if (decl.prop === 'border') {
      decl.value = sortBorderValues(decl.value)
    }
    decl.between = ': '
    decl.value = decl.value.trim().replace(/\s+/g, ' ')
    decl.value = decl.value.replace(/,/g, ', ')
    if (decl.important) {
      decl._important = " !important"
    }
  })

  return rule
}


module.exports = formatDecls
