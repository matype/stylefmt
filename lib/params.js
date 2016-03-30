var rc = require('rc-loader')

var newParmas = function () {
  var params = {}
  params.stylelint = loadStylelint()
  return params
}

function loadStylelint() {
  var result = rc('stylelint').rules
  return result || {}
}

module.exports = newParmas
