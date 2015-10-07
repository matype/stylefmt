var formatAtRuleParams = require('./formatAtRuleParams')
var formatDecls = require('./formatDecls')
var getIndent = require('./getIndent')
var hasRules = require('./hasRules')
var hasDecls = require('./hasDecls')

function formatAtRules (root) {
  root.walkAtRules(function (atrule, index) {
    var parentType = atrule.parent.type
    var atruleBefore

    var hasComment = false
    var prev = atrule.prev()
    if (prev && prev.type === 'comment') {
      hasComment = true
    }

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
        if (atrule.parent.first === atrule) {
          atruleBefore = '\n' + getIndent(atrule)
        } else {
          atruleBefore = '\n\n' + getIndent(atrule)
        }
        formatDecls(atrule)
      }

      if (parentType === 'root') {
        atruleBefore = '\n\n' + getIndent(atrule)
      }

      if (hasComment) {
        atruleBefore = '\n' + getIndent(atrule)
      }

      if (atrule.name === 'import') {
        atruleBefore = '\n' + getIndent(atrule)
      }
    }


    atrule.params = formatAtRuleParams(atrule)

    atrule.raws.before = atruleBefore
    atrule.raws.after = '\n' + getIndent(atrule)
    atrule.raws.between = ' '
    atrule.raws.semicolon = true
    atrule.raws.afterName = ' '


    if (atrule.name === 'import') {
      atrule.raws.between = ''
    }

    if (atrule.name === 'font-face') {
      atrule.raws.afterName = ''
      formatDecls(atrule)
    }

    if (atrule.name === 'mixin') {
      atrule.params = atrule.params.replace(/(^[\w|-]+)\s*\(/, "$1(")
      formatDecls(atrule)
    }

    if (atrule.name === 'extend' ||
        atrule.name === 'debug'  ||
        atrule.name === 'warn'   ||
        atrule.name === 'error' ) {
      atrule.params = atrule.params.replace(/\s+/g, " ")
      atrule.raws.before = '\n' + getIndent(atrule)
      atrule.raws.between = ''
    }

    if (atrule.name === 'warn' || atrule.name === 'error') {
      atrule.params = atrule.params.replace(/("|')\s*/g, '"')
      atrule.params = atrule.params.replace(/\s*("|')/g, '"')
    }

    if (atrule.name === 'content') {
      atrule.raws.before = '\n' + getIndent(atrule)
      atrule.raws.between = ''
      atrule.raws.afterName = ''
    }

    if (atrule.name === 'include') {
      atrule.params = atrule.params.replace(/(^[\w|-]+)\s*\(/, "$1(")
      atrule.params = atrule.params.replace(/\)\s*{/g, ') ')
      atrule.raws.before = '\n' + getIndent(atrule)
      atrule.raws.between = ''

      if (atrule.parent.type === 'root') {
        atrule.raws.before = '\n\n' + getIndent(atrule)
        atrule.raws.between = ' '

        if (index === 0) {
          atrule.raws.before = ''
        }
      }

      if (!hasRules(atrule) && !hasDecls(atrule)) {
        atrule.raws.between = ''
      }
    }

    if (atrule.name === 'function') {
      atrule.raws.before = getIndent(atrule)
      atrule.raws.between = ' '
    }

    if (atrule.name === 'return') {
      atrule.raws.between = ''
    }
  })

  return root
}

module.exports = formatAtRules
