var formatSelectors = require('./formatSelectors')
var formatDecls = require('./formatDecls')
var getIndent = require('./getIndent')

function formatRules (root) {
  root.walkRules(function (rule, index) {
    var ruleBefore
    var parentType = rule.parent.type

    var hasComment = false
    var prev = rule.prev()
    if (prev && prev.type === 'comment') {
      hasComment = true
    }

    if (index === 0 && parentType === 'root') {
      ruleBefore = ''
    } else {

      if (parentType === 'atrule') {
        if (rule.parent.first === rule) {
          ruleBefore = '\n' + getIndent(rule)
        } else {
          ruleBefore = '\n\n' + getIndent(rule)
        }
      }
      if (parentType === 'rule') {
        if (rule.parent.first === rule) {
          ruleBefore = '\n' + getIndent(rule)
        } else {
          ruleBefore = '\n\n' + getIndent(rule)
        }
      }

      if (parentType === 'root') {
        ruleBefore = '\n\n' + getIndent(rule)
      }

      if (hasComment) {
        ruleBefore = '\n' + getIndent(rule)
      }
    }

    rule.raws.before = ruleBefore
    rule.raws.after = '\n' + getIndent(rule)
    rule.raws.between = ' '
    rule.raws.semicolon = true

    rule = formatSelectors(rule)
    rule = formatDecls(rule)
  })

  return root
}


module.exports = formatRules
