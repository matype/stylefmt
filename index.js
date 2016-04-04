var postcss = require('postcss')
var scss = require('postcss-scss')

var newParams = require('./lib/params')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var formatComments = require('./lib/formatComments')
var formatSassVariables = require('./lib/formatSassVariables')


var stylefmt = postcss.plugin('stylefmt', function (fullPath) {
  var params = newParams(fullPath)

  var func = function (root) {
    formatComments(root, params)
    formatAtRules(root, params)
    formatRules(root, params)
    formatSassVariables(root)
    return root
  }

  return func
})

var process = function (css, fullPath) {
  return postcss([ stylefmt(fullPath) ]).process(css, { syntax: scss }).css
}

module.exports = {
  stylefmt: stylefmt,
  process: process
}
