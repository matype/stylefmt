var postcss = require('postcss')
var scss = require('postcss-scss')

var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var formatComments = require('./lib/formatComments')
var formatSassVariables = require('./lib/formatSassVariables')


var cssfmt = postcss.plugin('cssfmt', function () {
  return function (root) {

    formatComments(root)
    formatAtRules(root)
    formatRules(root)
    formatSassVariables(root)

    return root
  }
})

var process = function (css) {
  return postcss([ cssfmt() ]).process(css, { syntax: scss }).css
}

module.exports = {
  cssfmt: cssfmt,
  process: process
}
