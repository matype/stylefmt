var util = require('./util')
var inAtRule = util.inAtRule
var strRepeat = util.strRepeat
var getNestedRulesNum = util.getNestedRulesNum
var config = require('./config')
var indentWidth = config.indentWidth

function getIndent (rule) {

  var nestedRuleNum = getNestedRulesNum(rule)

  var indent
  if (inAtRule(rule)) {
    indent = strRepeat(indentWidth, nestedRuleNum)
  } else {
    indent = strRepeat(indentWidth, nestedRuleNum)
  }

  return indent
}


module.exports = getIndent
