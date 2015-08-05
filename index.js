var postcss = require('postcss')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')

module.exports = function (css) {
  var root = postcss.parse(css)

  formatAtRules(root)
  formatRules(root)

  return root
}
