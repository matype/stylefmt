function formatSassVariables (root) {
  root.eachDecl(function (decl) {
    if (isSassVariable(decl)) {
      decl.before = ''
      decl.between = ': '
    }
  })
}

function isSassVariable (decl) {
  return decl.parent.type === 'root' && decl.prop.match(/^\$/)
}


module.exports = formatSassVariables
