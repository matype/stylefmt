var sortBorderValues = require('sort-border-values')

function formatDecls (rule) {
  var ruleBefore = rule.parent.type === 'atrule' ? '\n    ' : '\n  '

  rule.eachDecl(function (decl) {
    decl.before = ruleBefore
    if (decl.prop === 'border') {
      decl.value = sortBorderValues(decl.value)
    }
    decl.value = decl.value.replace(/\s+/g, ' ')
    decl.between = ': '
  })

  return rule
}

module.exports = formatDecls
