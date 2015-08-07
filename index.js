var postcss = require('postcss')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var formatSassVariables = require('./lib/formatSassVariables')

var cssfmt = postcss.plugin('cssfmt', function () {
  return function (root) {

    formatAtRules(root)
    formatRules(root)
    formatSassVariables(root)

    return root
  }
})

module.exports = cssfmt

module.exports.process = function (css) {
  return postcss([ cssfmt() ]).process(css).css
}
