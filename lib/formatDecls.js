var sortBorderValues = require('sort-border-values')

function formatDecls (rule) {
  rule.eachDecl(function (decl) {
    if (rule.parent.type === 'atrule') {
      decl.before = '\n    '
    } else {
      decl.before = '\n  '
    }
    if (decl.prop === 'border') {
      decl.value = sortBorderValues(decl.value)
    }
    decl.value = decl.value.replace(/\s+/g, ' ')
    decl.between = ': '
  })

  return rule
}

module.exports = formatDecls
