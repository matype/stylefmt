var getIndent = require('./getIndent')

function formatSelectors (rule) {
  var separator = ',\n'  + getIndent(rule)

  var tmp = []
  rule.selectors.forEach(function (selector, i) {
    if (isFirstLetterCombinator(selector)) {
      selector = selector.replace(/\s*([+~>])\s*/g, "$1 ")
    } else {
      // don't add extra spaces to :nth-child(5n+1) etc.
      if (!hasPlusInsideParens(selector)) {
        selector = selector.replace(/\s*([+~>])\s*/g, " $1 ")
      }
    }
    tmp.push(selector)
  })

  rule.selector = tmp.join(separator)

  return rule
}

function hasPlusInsideParens (selector) {
  return (/\(.+\+.+\)/).test(selector)
}

function isFirstLetterCombinator (selector) {
  return (/^[+~>]/).test(selector)
}


module.exports = formatSelectors
