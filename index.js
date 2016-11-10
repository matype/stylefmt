const postcss = require('postcss')

const params = require('./lib/params')
const formatAtRules = require('./lib/formatAtRules')
const formatOrder = require('./lib/formatOrder')
const formatRules = require('./lib/formatRules')
const formatComments = require('./lib/formatComments')
const formatSassVariables = require('./lib/formatSassVariables')


const stylefmt = postcss.plugin('stylefmt', function (options) {
  var paramer = params(options)
  return function (root) {
    return paramer(root).then(function (params) {
      formatComments(root, params)
      formatAtRules(root, params)
      formatOrder(root, params)
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
