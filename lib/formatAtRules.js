var strRepeat = require('./util').strRepeat
var indentWidth = require('./config').indentWidth
var getIndent = require('./getIndent')
var formatAtRuleParams = require('./formatAtRuleParams')

function formatAtRules (root) {
  root.walkAtRules(function (atrule, index) {
    var parentType = atrule.parent.type
    var atruleBefore
    var atruleAfter

    var hasComment = false
    var prev = atrule.prev()
    if (prev && prev.type === 'comment') {
      hasComment = true
    }

    var params = formatAtRuleParams(atrule)
    atrule.params = params

    atrule.lastEach++

    if (index === 0 && parentType === 'root') {
      atruleBefore = ''
    } else {
      if (parentType === 'atrule') {
        if (atrule.parent.first === atrule) {
          atruleBefore = '\n' + getIndent(atrule)
        } else {
          atruleBefore = '\n\n' + getIndent(atrule)
        }
      }
      if (parentType === 'rule') {
        atruleBefore = '\n\n' + getIndent(atrule)
      }

      if (parentType === 'root') {
        atruleBefore = '\n\n\n' + getIndent(atrule)
      }

      if (hasComment) {
        atruleBefore = '\n' + getIndent(atrule)
      }
    }

    atrule.raws.before = atruleBefore
    atrule.raws.after = '\n' + getIndent(atrule)
    atrule.raws.between = ' '
    atrule.raws.semicolon = true
    atrule.raws.afterName = ' '

    if (atrule.name === 'mixin') {
      atrule.params = atrule.params.replace(/(^[A-Za-z0-9]+)\s*\(/, "$1 (")
    }

    if (atrule.name === 'extend') {
      atrule.raws.before = '\n' + getIndent(atrule)
      atrule.raws.between = ''
    }

    if (atrule.name === 'include') {
      atrule.raws.before = '\n' + getIndent(atrule)
      atrule.raws.between = ''
    }

    if (atrule.name === 'function') {
      atrule.raws.before = getIndent(atrule)
      atrule.raws.between = ' '
    }
  })

  return root
}

module.exports = formatAtRules
