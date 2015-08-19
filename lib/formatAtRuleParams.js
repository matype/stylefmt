function formatAtRuleParams (atrule) {
  var params = atrule.params

  if (params.match(/:/)) {
      params = params.replace(/\s*:\s*/g, ': ')
      if (params.match(/^\(\s*/)) {
        params = params.replace(/^\(\s*/g, '(')
      } else {
        params = params.replace(/\s*\(\s*/g, ' (')
      }
      params = params.replace(/\s*\)\s*/g, ')')
      params = params.replace(/\)\s*{/g, ') ')
    }

    return params
}


module.exports = formatAtRuleParams
