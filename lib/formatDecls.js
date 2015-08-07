var sortBorderValues = require('sort-border-values')

function formatDecls (rule) {
  rule.eachDecl(function (decl) {
    var parentType = rule.parent.type
    var declBefore

    if (inAtRule(rule)) {
      declBefore = '\n' + strRepeat('  ', rule.lastEach)
    } else {
      declBefore = '\n' + strRepeat('  ', rule.lastEach - 1)
    }
    decl.before = declBefore

    if (decl.prop === 'border') {
      decl.value = sortBorderValues(decl.value)
    }
    decl.value = decl.value.replace(/\s+/g, ' ')
    decl.between = ': '
  })

  return rule
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

module.exports = formatDecls
