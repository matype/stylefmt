function formatSassVariables (root) {
  root.walkDecls(function (decl) {
    if (isSassVariable(decl)) {
      // format math operators before `$` or `(`.
      decl.value = decl.value.trim().replace(/(?!^)[+\-*/%](?=\$|\()/g, ' $& ')
      // don't format minus sign (-) before a number
      // because we don't know if it is
      // part of a Sass variable name (e.g. $my-var-1-2).
      decl.value = decl.value.trim().replace(/[+\*/%](?=\d+)/g, ' $& ')

      var hasVariableWithDash = (/\$\w+-\w+/).test(decl.value)

      if (!hasVariableWithDash) {
        // format minus sign before number if safe
        decl.value = decl.value.trim().replace(/-(?=\d+)/g, ' $& ')
      }

      decl.raws.before = '\n'
      decl.raws.between = ': '
    }
  })
}

function isSassVariable (decl) {
  return decl.parent.type === 'root' && decl.prop.match(/^\$/)
}


module.exports = formatSassVariables
