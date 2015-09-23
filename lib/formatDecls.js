var getIndent = require('./getIndent')
var formatValues = require('./formatValues')
var config = require('./config')
var hasDecls = require('./hasDecls')

function formatDecls (rule) {

  if (hasDecls(rule)) {
    rule.walkDecls(function (decl) {
      var more = config.indentWidth
      decl.raws.before = '\n' + getIndent(rule) + more
      decl.raws.between = ': '
      formatValues(decl)
    })
  }


  return rule
}


module.exports = formatDecls
