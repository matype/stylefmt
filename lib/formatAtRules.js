var strRepeat = require('./util').strRepeat
var indentWidth = require('./config').indentWidth

function formatAtRules (root) {
  root.eachAtRule(function (atrule, index) {
    if (atrule.params.match(/:/)) {
      atrule.params = atrule.params.replace(/\s*:\s*/g, ': ')
      atrule.params = atrule.params.replace(/\s*\(\s*/g, ' (')
      atrule.params = atrule.params.replace(/\s*\)\s*/g, ')')
      atrule.params = atrule.params.replace(/\)\s*{/g, ') ')
    }

    atrule.before = index === 0 ? '' : '\n\n\n'
    atrule.after = '\n'
    atrule.between = ' '
    atrule.semicolon = true
    atrule.afterName = ' '

    if (atrule.name === 'mixin') {
      atrule.params = atrule.params.replace(/(^[A-Za-z0-9]+)\s*\(/, "$1 (")
    }

    if (atrule.name === 'extend') {
      atrule.before = '\n' + strRepeat(indentWidth, atrule.parent.lastEach)
      atrule.between = ''
    }

    if (atrule.name === 'include') {
      atrule.before = '\n' + strRepeat(indentWidth, atrule.parent.lastEach)
      atrule.between = ''
    }
  })

  return root
}

module.exports = formatAtRules
