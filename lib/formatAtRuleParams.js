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
    'if',
    'else'
  ]

   if (atTypes.indexOf(atName) > -1) {
    params = params.replace(/\s*:\s*/g, ': ')
    params = params.replace(/\s*,\s*/g, ', ')
    params = params.replace(/\s+/g, ' ')
    if (params.match(/^\(\s*/)) {
      params = params.replace(/^\(\s*/g, '(')
    } else if (atName === 'function' || atName === 'if' || atName === 'else') {
      params = params.replace(/\s*\(\s*/, '(')
    } else {
      params = params.replace(/\s*\(\s*/, ' (')
    }
    params = params.replace(/\s*\)/g, ')')
    params = params.replace(/\)\s*{/g, ') ')
  }

  if (atName === 'return' || atName === 'if' || atName === 'else') {
    // format math operators before `$` or `(`.
    params = params.replace(/(?!^)[+\-*/%](?=\$|\()/g, ' $& ')
    // don't format minus sign (-) before a number
    // because we don't know if it is
    // part of a Sass variable name (e.g. $my-var-1-2).
    params = params.replace(/[+\*/%](?=\d+)/g, ' $& ')

    var hasVariableWithDash = (/\$\w+-\w+/).test(params)

    if (!hasVariableWithDash) {
      // format minus sign before number if safe
      params = params.replace(/-(?=\d+)/g, ' $& ')
    }

    params = params.replace(/!=|==|<=|>=/g, ' $& ')
    params = params.replace(/(<|>)(?!=)/g, ' $& ')
    params = params.replace(/\s+/g, ' ')
  }

  return params
}


module.exports = formatAtRuleParams
