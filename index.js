var postcss = require('postcss')
var scss = require('postcss-scss')

var newParams = require('./lib/params')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var formatComments = require('./lib/formatComments')
var formatSassVariables = require('./lib/formatSassVariables')


var cssfmt = postcss.plugin('cssfmt', function (opts) {
  opts = opts || {};
  var func = function (root) {
    var params = newParams(opts);

    formatComments(root)
    formatAtRules(root)
    formatRules(root, params.stylelint || {})
    formatSassVariables(root)

    return root
  }
  return func
})

var process = function (css, opts) {
  return postcss([ cssfmt(opts) ]).process(css, { syntax: scss }).css
}

module.exports = {
  cssfmt: cssfmt,
  process: process
}

