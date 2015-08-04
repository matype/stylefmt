function formatDecls (rule) {
  rule.eachDecl(function (decl) {
    if (rule.parent.type === 'atrule') {
      decl.before = '\n    '
    } else {
      decl.before = '\n  '
    }
    decl.between = ': '
  })

  return rule
}

module.exports = formatDecls
