var getIndent = require('./getIndent')
var formatProperties = require('./formatProperties')
var formatValues = require('./formatValues')

function formatDecls (rule) {
  rule.walkDecls(function (decl) {
    var more = '  '
    decl.raws.before = '\n' + getIndent(rule) + more

    formatProperties(decl)
    decl.raws.between = ': '
    formatValues(decl)
  })

  return rule
}


module.exports = formatDecls
