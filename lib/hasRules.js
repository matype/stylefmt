function hasRules (rule) {
  var children = rule.nodes
  var ret = false

  if (Array.isArray(children)) {
    children.forEach(function (child) {
      if (child.type === 'rule') {
        ret = true
        return
      }
    })
  }

  return ret
}


module.exports = hasRules
