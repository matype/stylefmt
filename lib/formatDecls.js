var getIndent = require('./getIndent')
var formatValues = require('./formatValues')
var config = require('./config')
var hasDecls = require('./hasDecls')

function formatDecls (rule) {

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

      var more = config.indentWidth
      decl.raws.before = '\n' + getIndent(rule) + more
      decl.raws.between = ': '
      formatValues(decl)
    })
  }


  return rule
}


module.exports = formatDecls
