function formatAtRuleParams (atrule) {
  var params = atrule.raws.params ? atrule.raws.params.raw : atrule.params
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
    'else',
    'custom-media',
    'custom-selectors'
  ]

  if (atTypes.indexOf(atName) > -1) {
    params = params.replace(/\s*:\s*/g, ': ')
    params = params.replace(/\s*,\s*/g, ', ')

    if (params.match(/^\(\s*/)) {
      params = params.replace(/^\(\s*/g, '(')
    } else if (atName === 'function' || atName === 'if' || atName === 'else') {
      params = params.replace(/\s*\(\s*/, '(')
    } else {
      params = params.replace(/\s*\(\s*/, ' (')
    }

    params = params.replace(/\s*\)/g, ')')
    params = params.replace(/\)\s*{/g, ') ')
    params = params.replace(/\/\*/g, ' $&')
    params = params.replace(/\*\//g, '$& ')
    params = params.replace(/\s+/g, ' ')
  }

  if (atName === 'charset') {
    params = params.toLowerCase()
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

  if (atName === 'custom-media') {
    params = params.replace(/\s*\(\s*/, ' (')
    params = params.replace(/\s*\)\s*w+/, ') ')
    params = params.replace(/\s*\>\=\s*/, ' >= ')
    params = params.replace(/\s*\<\=\s*/, ' <= ')
  }

  if (atName === 'custom-selector') {
    console.log(params)
    params = params.replace(/\s+/, ' ')
    params = params.replace(/,\s*/g, ', ')
  }

  return params
}


module.exports = formatAtRuleParams
