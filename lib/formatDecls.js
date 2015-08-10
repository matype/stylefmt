var getIndent = require('./getIndent')
var formatProperties = require('./formatProperties')
var formatValues = require('./formatValues')

function formatDecls (rule) {
  rule.eachDecl(function (decl) {
    decl.before = '\n' + getIndent(rule)

    formatProperties(decl)
    decl.between = ': '
    formatValues(decl)
  })

  return rule
}


module.exports = formatDecls
