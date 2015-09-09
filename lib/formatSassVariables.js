function formatSassVariables (root) {
  root.walkDecls(function (decl) {
    if (isSassVariable(decl)) {
      decl.raws.before = '\n'
      decl.raws.between = ': '
    }
  })
}

function isSassVariable (decl) {
  return decl.parent.type === 'root' && decl.prop.match(/^\$/)
}


module.exports = formatSassVariables
