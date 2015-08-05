function formatAtRules (root) {
  root.eachAtRule(function (atrule, index) {
    if (atrule.params.match(/:/)) {
      atrule.params = atrule.params.replace(/\s*:\s*/g, ': ')
      atrule.params = atrule.params.replace(/\s*\(\s*/g, ' (')
      atrule.params = atrule.params.replace(/\s*\)\s*/g, ')')
      atrule.params = atrule.params.replace(/\)\s*{/g, ') ')
    }
    if (index === 0) {
      atrule.before= ''
    } else {
      atrule.before = '\n\n'
    }
    atrule.after = '\n'
    atrule.between = ' '
    atrule.semicolon = true
  })

  return root
}

module.exports = formatAtRules
