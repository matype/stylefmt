var util = require('./util')
var inAtRule = util.inAtRule
var strRepeat = util.strRepeat
var config = require('./config')
var indentWidth = config.indentWidth

function getIndent (rule) {
  var indent
  if (inAtRule(rule)) {
    indent = strRepeat(indentWidth, rule.lastEach)
  } else {
    indent = strRepeat(indentWidth, rule.lastEach - 1)
  }

  return indent
}


module.exports = getIndent
