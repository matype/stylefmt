var util = require('./util')
var repeatString = require('repeat-string')
var getNestedRulesNum = util.getNestedRulesNum

function getIndent (rule, indentWidth) {

  var nestedRuleNum = getNestedRulesNum(rule)
  var indent = repeatString(indentWidth, nestedRuleNum)

  return indent
}


module.exports = getIndent
