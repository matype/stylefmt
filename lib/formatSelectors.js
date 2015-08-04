function formatSelectors (rule) {
  var re1 = /\s*>\s*/g
  var re2 = /\s*\+\s*/g
  var re3 = /\s*\~\s*/g
  var tmp = []

  rule.selectors.forEach(function (selector, i) {
    selector = selector.replace(re1, ' > ')
    selector = selector.replace(re2, ' + ')
    selector = selector.replace(re3, ' ~ ')
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
