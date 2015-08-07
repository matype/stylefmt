var formatSelectors = require('./formatSelectors')
var formatDecls = require('./formatDecls')

function formatRules (root) {
  root.eachRule(function (rule, index) {
    var ruleBefore
    var ruleAfter
    var parentType = rule.parent.type
    var num = inAtRule(rule) ? rule.lastEach : rule.lastEach - 1

    if (index === 0 && parentType === 'root') {
      ruleBefore = ''
    } else {

      if (parentType === 'rule') {
        ruleBefore = '\n\n' + strRepeat('  ', num)
      }
      if (parentType === 'root') {
        ruleBefore = '\n\n\n' + strRepeat('  ', num)
      }
      if (parentType === 'atrule') {
        ruleBefore = '\n' + strRepeat('  ', num)
      }
    }

    if (inAtRule(rule)) {
      ruleAfter = '\n' + strRepeat('  ', rule.lastEach)
    } else {
      ruleAfter = '\n' + strRepeat('  ', rule.lastEach - 1)
    }
    rule.before = ruleBefore
    rule.after = ruleAfter
    rule.between = ' '
    rule.semicolon = true

    rule = formatSelectors(rule)
    rule = formatDecls(rule)
  })

  return root
}

function strRepeat (str, num) {
  var ret = ''
  for (var i = 0; i < num; i++) {
    ret += str
  }
  return ret
}

function inAtRule (rule) {
  var ret = false
  var current = rule.parent
  while (current.type !== 'root') {
    if (current.type === 'atrule') {
      ret = true
      break
    }
    current = current.parent
  }
  return ret
}
module.exports = formatRules
