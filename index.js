const postcss = require('postcss')

const params = require('./lib/params')
const formatAtRules = require('./lib/formatAtRules')
const formatOrder = require('./lib/formatOrder')
const formatRules = require('./lib/formatRules')
const formatComments = require('./lib/formatComments')
const formatSassVariables = require('./lib/formatSassVariables')


const stylefmt = postcss.plugin('stylefmt', function (options) {
  var paramer = params(options)
  return function (root, result) {
    return paramer(root, result).then(function (params) {
      if(params) {
        formatComments(root, params)
        formatAtRules(root, params)
        formatRules(root, params)
        formatSassVariables(root, params)
        // order should be the last to prevent empty line collapse in order rules
        formatOrder(root, params)
      }
    }).catch(function (err) {
      console.error(err.stack)
    })
  }
})

module.exports = stylefmt
