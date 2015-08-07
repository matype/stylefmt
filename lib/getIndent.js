var util = require('./util')
var inAtRule = util.inAtRule
var strRepeat = util.strRepeat

function getIndent (rule) {
  var indent
  if (inAtRule(rule)) {
    indent = strRepeat('  ', rule.lastEach)
  } else {
    indent = strRepeat('  ', rule.lastEach - 1)
  }

  return indent
}


module.exports = getIndent
