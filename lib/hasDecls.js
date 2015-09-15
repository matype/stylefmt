function hasDecls (rule) {
  var children = rule.nodes
  var ret = false

  if (Array.isArray(children)) {
    children.forEach(function (child) {
      if (child.type === 'decl') {
        ret = true
        return
      }
    })
  }

  return ret
}


module.exports = hasDecls
