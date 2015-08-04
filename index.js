var fs = require('fs')
var postcss = require('postcss')

module.exports = function (cssFile) {
  var css = fs.readFileSync(cssFile, 'utf-8')
  var root = postcss.parse(css)

  var re1 = /\s*>\s*/g
  var re2 = /\s*\+\s*/g
  var re3 = /\s*\~\s*/g

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

  root.eachRule(function (rule, index) {
    if (index === 0) {
      if (rule.parent.type === 'atrule') {
        rule.before='\n  '
      } else {
        rule.before = ''
      }
    } else {
      rule.before = '\n\n'
    }

    if (rule.parent.type === 'atrule') {
      rule.after = '\n  '
    } else {
      rule.after = '\n'
    }
    rule.between = ' '
    rule.semicolon = true

    var tmp = []
    rule.selectors.forEach(function (selector, i) {
      selector = selector.replace(re1, ' > ')
      selector = selector.replace(re2, ' + ')
      selector = selector.replace(re3, ' ~ ')
      tmp.push(selector)
    })
    if (rule.parent.type === 'atrule') {
      rule.selector = tmp.join(',\n  ')
    } else {
      rule.selector = tmp.join(',\n')
    }
    rule.eachDecl(function (decl) {
      if (rule.parent.type === 'atrule') {
        decl.before = '\n    '
      } else {
        decl.before = '\n  '
      }
      decl.between = ': '
    })
  })
  return root
}

