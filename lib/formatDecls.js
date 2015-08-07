var sortBorderValues = require('sort-border-values')

function formatDecls (rule) {
  var declBefore = rule.parent.type === 'atrule' ? '\n    ' : '\n  '

  rule.eachDecl(function (decl) {
    var parentType = rule.parent.type
    var declBefore

    if (parentType === 'atrule') {
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

module.exports = formatDecls
