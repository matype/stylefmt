var getIndent = require('./getIndent')
var formatProperties = require('./formatProperties')
var formatValues = require('./formatValues')
var config = require('./config')
var hasDecls = require('./hasDecls')

function formatDecls (rule) {

  if (hasDecls(rule)) {
    rule.walkDecls(function (decl) {
      var more = config.indentWidth
      decl.raws.before = '\n' + getIndent(rule) + more
      formatProperties(decl)
      decl.raws.between = ': '
      formatValues(decl)
    })
  }


  return rule
}


module.exports = formatDecls
