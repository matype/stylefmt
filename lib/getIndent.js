var util = require('./util')
var repeatString = require('repeat-string')
var getNestedRulesNum = util.getNestedRulesNum

function getIndent (rule, indentWidth) {

  var nestedRuleNum = getNestedRulesNum(rule)
  var indentation = repeatString(indentWidth, nestedRuleNum)

  return indentation
}


module.exports = getIndent
