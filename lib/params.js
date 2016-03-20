
var fs = require('fs')
var path = require('path')

var newParmas = function (opts) {
  var params = {}

  if (opts.stylelintrcPath) {
    var stylelintrc = JSON.parse(fs.readFileSync(opts.stylelintrcPath, 'utf8'))
    params.stylelint = stylelintrc.rules
  }

  return params
}

module.exports = newParmas
