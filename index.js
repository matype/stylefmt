var fs = require('fs')
var postcss = require('postcss')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')

module.exports = function (cssFile) {
  var css = fs.readFileSync(cssFile, 'utf-8')
  var root = postcss.parse(css)

  formatAtRules(root)
  formatRules(root)

  return root
}
