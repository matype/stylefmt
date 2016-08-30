var util = require('./util')
var getNestedRulesNum = util.getNestedRulesNum

function getIndent (rule, indentWidth) {

  var nestedRuleNum = getNestedRulesNum(rule)
  var indentation = indentWidth.repeat(nestedRuleNum)

  return indentation
}


module.exports = getIndent
