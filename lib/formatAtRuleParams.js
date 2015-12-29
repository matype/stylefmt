function formatAtRuleParams (atrule) {
  var params = atrule.params
  var atName = atrule.name
  var atTypes = [
    'media',
    'include',
    'mixin',
    'function',
    'for',
    'each',
    'while',
    'else'
  ]

   if (atTypes.indexOf(atName) > -1) {
    params = params.replace(/\s*:\s*/g, ': ')
    params = params.replace(/\s*,\s*/g, ', ')
    params = params.replace(/\s+/g, ' ')
    if (params.match(/^\(\s*/)) {
      params = params.replace(/^\(\s*/g, '(')
    } else if (atName === 'function') {
      params = params.replace(/\s*\(\s*/, '(')
    } else {
      params = params.replace(/\s*\(\s*/, ' (')
    }
    params = params.replace(/\s*\)/g, ')')
    params = params.replace(/\)\s*{/g, ') ')
  }

  if (atName === 'return') {
    params = params.replace(/[+\-*/%](?=\$|\()/g, ' $& ')
  }

  return params
}


module.exports = formatAtRuleParams
