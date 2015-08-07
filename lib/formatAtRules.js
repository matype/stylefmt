function formatAtRules (root) {
  root.eachAtRule(function (atrule, index) {
    if (atrule.params.match(/:/)) {
      atrule.params = atrule.params.replace(/\s*:\s*/g, ': ')
      atrule.params = atrule.params.replace(/\s*\(\s*/g, ' (')
      atrule.params = atrule.params.replace(/\s*\)\s*/g, ')')
      atrule.params = atrule.params.replace(/\)\s*{/g, ') ')
    }

    atrule.before = index === 0 ? '' : '\n\n'
    atrule.after = '\n'
    atrule.between = ' '
    atrule.afterName = ' '
    atrule.semicolon = true

    if (atrule.name === 'mixin') {
      atrule.params = atrule.params.replace(/(^[A-Za-z0-9]+)\s*\(/, "$1 (")
    }
  })

  return root
}

module.exports = formatAtRules
