var formatSelectors = require('./formatSelectors')
var formatDecls = require('./formatDecls')
var getIndent = require('./getIndent')

function formatRules (root) {
  root.eachRule(function (rule, index) {
    var ruleBefore
    var ruleAfter
    var parentType = rule.parent.type

    if (index === 0 && parentType === 'root') {
      ruleBefore = ''
    } else {

      if (parentType === 'atrule') {
        if (rule.parent.first === rule) {
          ruleBefore = '\n' + getIndent(rule)
        } else {
          ruleBefore = '\n\n' + getIndent(rule)
        }
      }
      if (parentType === 'rule') {
        ruleBefore = '\n\n' + getIndent(rule)
      }

      if (parentType === 'root') {
        ruleBefore = '\n\n\n' + getIndent(rule)
      }
    }

    rule.before = ruleBefore
    rule.after = '\n' + getIndent(rule)
    rule.between = ' '
    rule.semicolon = true

    rule = formatSelectors(rule)
    rule = formatDecls(rule)
  })

  return root
}


module.exports = formatRules
