var postcss = require('postcss')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var inspect = require('obj-inspector')

var cssfmt = postcss.plugin('cssfmt', function () {
  return function (root) {

    formatAtRules(root)
    formatRules(root)

    return root
  }
})

module.exports = cssfmt

module.exports.process = function (css) {
  return postcss([ cssfmt() ]).process(css).css
}
