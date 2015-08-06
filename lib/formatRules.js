var formatSelectors = require('./formatSelectors')
var formatDecls = require('./formatDecls')

function formatRules (root) {
  root.eachRule(function (rule, index) {
    var parentType = rule.parent.type
    var ruleBefore = parentType === 'atrule' ? '\n  ' : ''
    var ruleAfter = parentType === 'atrule' ? '\n  ' : '\n'

    rule.before = index === 0 ? ruleBefore : '\n\n'
    rule.after = ruleAfter
    rule.between = ' '
    rule.semicolon = true

    rule = formatSelectors(rule)
    rule = formatDecls(rule)
  })

  return root
}

module.exports = formatRules
