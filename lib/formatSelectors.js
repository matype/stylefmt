var getIndent = require('./getIndent')

function formatSelectors (rule) {
  var separator = ',\n'  + getIndent(rule)

  var tmp = []
  rule.selectors.forEach(function (selector, i) {
    if (checkSelector(selector)) {
      tmp.push(selector.replace(/\s*([+~>])\s*/g, "$1 "))
    } else {
      tmp.push(selector.replace(/\s*([+~>])\s*/g, " $1 "))
    }
  })

  rule.selector = tmp.join(separator)

  return rule
}

/*
 * Check if the first letter of the selector is a combinator keyword
 */
function checkSelector (selector) {
  return selector.match(/^[+~>]/) ? true : false
}


module.exports = formatSelectors
