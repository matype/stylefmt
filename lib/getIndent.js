var util = require('./util')
var strRepeat = util.strRepeat
var getNestedRulesNum = util.getNestedRulesNum
var config = require('./config')
var indentWidth = config.indentWidth

function getIndent (rule) {

  var nestedRuleNum = getNestedRulesNum(rule)
  var indent = strRepeat(indentWidth, nestedRuleNum)

  return indent
}


module.exports = getIndent
