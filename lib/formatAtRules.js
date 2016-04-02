var formatAtRuleParams = require('./formatAtRuleParams')
var formatDecls = require('./formatDecls')
var getIndent = require('./getIndent')
var hasRules = require('./hasRules')
var hasDecls = require('./hasDecls')

function formatAtRules (root, params) {
  var indentWidth = params.indentWidth

  root.walkAtRules(function (atrule, index) {
    var parentType = atrule.parent.type
    var sassAtBlockTypes = [
      'mixin',
      'function',
      'for',
      'each',
      'while',
      'if',
      'else'
    ]
    var prev = atrule.prev()
    var isPrevRule = prev && prev.type === 'rule'
    var isPrevSassAtBlock = prev && sassAtBlockTypes.indexOf(prev.name) > -1
    var hasLineBreaksBefore = /[\n]{2}/.test(atrule.raws.before)
    var atruleBefore
    var indent = getIndent(atrule, indentWidth)

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
          atruleBefore = '\n' + indent
        } else {
          atruleBefore = '\n\n' + indent
        }
        formatDecls(atrule, indent, indentWidth)
      }
      if (parentType === 'rule') {
        if (atrule.parent.first === atrule) {
          atruleBefore = '\n' + indent
        } else {
          atruleBefore = '\n\n' + indent
        }
        formatDecls(atrule, indent, indentWidth)
      }

      if (parentType === 'root') {
        atruleBefore = '\n\n' + indent
      }

      if (hasComment) {
        atruleBefore = '\n' + indent
      }

      if (atrule.name === 'import') {
        atruleBefore = '\n' + indent
      }

      if (atrule.name === 'else') {
        atruleBefore = ' '
      }
    }


    atrule.params = formatAtRuleParams(atrule, params)

    atrule.raws.before = atruleBefore
    atrule.raws.after = '\n' + indent
    atrule.raws.between = ' '
    atrule.raws.semicolon = true
    atrule.raws.afterName = ' '


    if (atrule.name === 'import' || atrule.name === 'charset') {
      atrule.raws.between = ''
    }

    var isElseIf = (/if/).test(atrule.params)

    if (atrule.name === 'else' && !isElseIf) {
      atrule.raws.afterName = ''
    }

    if (atrule.name === 'if' || atrule.name === 'else') {
      formatDecls(atrule, indent, indentWidth)
    }

    if (atrule.name === 'font-face') {
      atrule.raws.afterName = ''
      formatDecls(atrule, indent, indentWidth)
    }

    if (atrule.name === 'mixin') {
      atrule.params = atrule.params.replace(/(^[\w|-]+)\s*\(/, "$1(")
      formatDecls(atrule, indent, indentWidth)
    }

    if (atrule.name === 'extend' ||
        atrule.name === 'debug'  ||
        atrule.name === 'warn'   ||
        atrule.name === 'error' ) {
      atrule.params = atrule.params.replace(/\s+/g, " ")
      atrule.raws.before = '\n' + indent
      atrule.raws.between = ''
    }

    if (atrule.name === 'warn' || atrule.name === 'error') {
      atrule.params = atrule.params.replace(/("|')\s*/g, '"')
      atrule.params = atrule.params.replace(/\s*("|')/g, '"')
    }

    if (atrule.name === 'content') {
      atrule.raws.before = '\n' + indent
      atrule.raws.between = ''
      atrule.raws.afterName = ''
    }

    if (atrule.name === 'include') {
      atrule.params = atrule.params.replace(/(^[\w|-]+)\s*\(/, "$1(")
      atrule.params = atrule.params.replace(/\)\s*{/g, ') ')
      if (!hasLineBreaksBefore) {
        atrule.raws.before = '\n' + indent
      }

      if (atrule.parent.type === 'root') {

        if (hasLineBreaksBefore || isPrevRule || isPrevSassAtBlock) {
          atrule.raws.before = '\n\n' + indent
        }

        if (index === 0) {
          atrule.raws.before = ''
        }
      }

      if (!hasRules(atrule) && !hasDecls(atrule)) {
        atrule.raws.between = ''
      }
    }

    if (atrule.name === 'function') {
      atrule.raws.before = indent
      atrule.raws.between = ' '

      if (atrule.parent.type === 'root') {
        atrule.raws.before = '\n\n' + indent

        if (index === 0) {
          atrule.raws.before = ''
        }
      }
    }

    if (atrule.name === 'return'
     || atrule.name === 'custom-media'
     || atrule.name === 'custom-selector'
     || atrule.name === 'apply'
     || atrule.name === 'at-root'
     || (/viewport$/).test(atrule.name)) {
      atrule.raws.between = ''
    }

  })

  return root
}

module.exports = formatAtRules
