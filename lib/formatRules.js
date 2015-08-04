var formatSelectors = require('./formatSelectors')
var formatDecls = require('./formatDecls')

function formatRules (root) {
  root.eachRule(function (rule, index) {
    if (index === 0) {
      if (rule.parent.type === 'atrule') {
        rule.before='\n  '
      } else {
        rule.before = ''
      }
    } else {
      rule.before = '\n\n'
    }

    if (rule.parent.type === 'atrule') {
      rule.after = '\n  '
    } else {
      rule.after = '\n'
    }
    rule.between = ' '
    rule.semicolon = true

    rule = formatSelectors(rule)
    rule = formatDecls(rule)
  })

  return root
}

module.exports = formatRules
