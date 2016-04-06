var postcss = require('postcss')
var scss = require('postcss-scss')

var newParams = require('./lib/params')
var formatAtRules = require('./lib/formatAtRules')
var formatRules = require('./lib/formatRules')
var formatComments = require('./lib/formatComments')
var formatSassVariables = require('./lib/formatSassVariables')


var stylefmt = postcss.plugin('stylefmt', function () {
  return function (root) {
    return Promise
      .resolve(newParams())
      .then(function (stylelintConfig) {
        console.log(stylelintConfig)
        console.log('--------------')
        formatComments(root, stylelintConfig)
        formatAtRules(root, stylelintConfig)
        formatRules(root, stylelintConfig)
        formatSassVariables(root)

        return root
      })
  }
})

var process = function (css) {
  return postcss([ stylefmt() ])
    .process(css, { syntax: scss })
    .then(function (result) {
      console.log('result is ', result)
    })
}

module.exports = {
  stylefmt: stylefmt,
  process: process
}
