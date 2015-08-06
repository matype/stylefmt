function formatSelectors (rule) {
  var tmp = []
  rule.selectors.forEach(function (selector, i) {
    selector = selector.replace(/\s*([+~>])\s*/g, " $1 ")
    tmp.push(selector)
  })

  if (rule.parent.type === 'atrule') {
    rule.selector = tmp.join(',\n  ')
  } else {
    rule.selector = tmp.join(',\n')
  }

  return rule
}

module.exports = formatSelectors
