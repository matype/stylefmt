var postcss = require('postcss')
var scss = require('postcss-scss')

var params = require('./lib/params')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var formatComments = require('./lib/formatComments')
var formatSassVariables = require('./lib/formatSassVariables')


var stylefmt = postcss.plugin('stylefmt', function (fullPath) {
  return function (root) {
    return params(fullPath).then(function (params) {
      formatComments(root, params)
      formatAtRules(root, params)
      formatRules(root, params)
      formatSassVariables(root)
      return root
    }).catch(function (err) {
      console.error(err.stack)
      return root
    })
  }
})

module.exports = stylefmt
