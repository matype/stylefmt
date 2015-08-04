function formatAtRules (root) {
  root.eachAtRule(function (atrule, index) {
    if (index === 0) {
      atrule.before=''
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
