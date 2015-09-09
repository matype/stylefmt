function formatAtRuleParams (atrule) {
  var params = atrule.params
  var atName = atrule.name

   if (atName === 'media' || atName === 'include' || atName === 'mixin') {
    params = params.replace(/\s*:\s*/g, ': ')
    params = params.replace(/\s*,\s*/g, ', ')
    params = params.replace(/\s+/g, ' ')
    if (params.match(/^\(\s*/)) {
      params = params.replace(/^\(\s*/g, '(')
    } else {
      params = params.replace(/\s*\(\s*/g, ' (')
    }
    params = params.replace(/\s*\)/g, ')')
    params = params.replace(/\)\s*{/g, ') ')
  }

  return params
}


module.exports = formatAtRuleParams
