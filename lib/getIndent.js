var util = require('./util')
var repeatString = require('repeat-string')
var getNestedRulesNum = util.getNestedRulesNum
var config = require('./config')
var indentWidth = config.indentWidth

function getIndent (rule) {

  var nestedRuleNum = getNestedRulesNum(rule)
  indentWidth = config.indentWidth
  var indent = repeatString(indentWidth, nestedRuleNum)

  return indent
}


module.exports = getIndent
