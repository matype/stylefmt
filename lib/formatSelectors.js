function formatSelectors (rule) {
  var separator
  if (inAtRule(rule)) {
    separator = ',\n'  + strRepeat('  ', rule.lastEach)
  } else {
    separator = ',\n'  + strRepeat('  ', rule.lastEach - 1)
  }

  if (rule.parent.type !== 'rule') {
    rule.selector = rule.selectors.map(function (selector) {
      return selector.replace(/\s*([+~>])\s*/g, " $1 ")
    }).join(separator)
  } else {
    rule.selector = rule.selectors.map(function (selector) {
      return selector.replace(/\s*([+~>])\s*/g, "$1 ")
    }).join(separator)
  }

  return rule
}

function strRepeat (str, num) {
  var ret = ''
  for (var i = 0; i < num; i++) {
    ret += str
  }
  return ret
}


function inAtRule (rule) {
  var ret = false
  var current = rule.parent
  while (current.type !== 'root') {
    if (current.type === 'atrule') {
      ret = true
      break
    }
    current = current.parent
  }
  return ret
}

module.exports = formatSelectors
