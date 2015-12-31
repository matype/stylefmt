var hexRegex = require('hex-color-regex')

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


function getNestedRulesNum (rule) {
  var parent = rule.parent
  var num = 0

  while (parent.type !== 'root') {
    parent = parent.parent
    num++
  }

  return num
}


function isHex (str) {
  return hexRegex({exact: true}).test(str)
}


module.exports.inAtRule = inAtRule
module.exports.getNestedRulesNum = getNestedRulesNum
module.exports.isHex = isHex
