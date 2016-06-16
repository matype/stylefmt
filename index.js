var postcss = require('postcss')
var scss = require('postcss-scss')

var params = require('./lib/params')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var formatComments = require('./lib/formatComments')
var formatSassVariables = require('./lib/formatSassVariables')


var stylefmt = postcss.plugin('stylefmt', function (options) {
  options = options || {}

  return function (root) {
    return params(options).then(function (params) {
      formatComments(root, params)
      formatAtRules(root, params)
      formatRules(root, params)
      formatSassVariables(root, params)
      return root
    }).catch(function (err) {
      console.error(err.stack)
      return root
    })
  }
})

module.exports = stylefmt
