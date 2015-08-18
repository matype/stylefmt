var getIndent = require('./getIndent')
var formatProperties = require('./formatProperties')
var formatValues = require('./formatValues')

function formatDecls (rule) {
  rule.eachDecl(function (decl) {
    var more = '  '
    decl.before = '\n' + getIndent(rule) + more

    formatProperties(decl)
    decl.between = ': '
    formatValues(decl)
  })

  return rule
}


module.exports = formatDecls
