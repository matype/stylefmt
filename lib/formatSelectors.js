var getIndent = require('./getIndent')

function formatSelectors (rule) {
  var separator = ',\n'  + getIndent(rule)

  if (rule.parent.type !== 'rule') {
    rule.selector = rule.selectors.map(function (selector) {
      return selector.replace(/\s*([+~>])\s*/g, " $1 ").replace(/([a-zA-z0-9]):([after|before])/g, "$1::$2")
    }).join(separator)
  } else {
    rule.selector = rule.selectors.map(function (selector) {
      return selector.replace(/\s*([+~>])\s*/g, "$1 ").replace(/([a-zA-z0-9]):([after|before])/g, "$1::$2")
    }).join(separator)
  }

  return rule
}


module.exports = formatSelectors
