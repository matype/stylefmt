function hasDecls (rule) {
  var children = rule.nodes
  if (!Array.isArray(children)) {
    return false
  }
  return children.some(function (child) {
    return child.type === 'decl'
  })
}


module.exports = hasDecls
