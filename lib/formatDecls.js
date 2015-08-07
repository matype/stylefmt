var sortBorderValues = require('sort-border-values')
var getIndent = require('./getIndent')

function formatDecls (rule) {
  rule.eachDecl(function (decl) {
    decl.before = '\n' + getIndent(rule)
    if (decl.prop === 'border') {
      decl.value = sortBorderValues(decl.value)
    }
    decl.value = decl.value.trim().replace(/\s+/g, ' ')
    decl.between = ': '
  })

  return rule
}


module.exports = formatDecls
