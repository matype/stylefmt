function formatSelectors (rule) {
  var separator = rule.parent.type === 'atrule' ?  ',\n  ' : ',\n'

  rule.selector = rule.selectors.map(function (selector) {
    return selector.replace(/\s*([+~>])\s*/g, " $1 ")
  }).join(separator)

  return rule
}

module.exports = formatSelectors
