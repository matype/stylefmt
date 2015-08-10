var sortBorderValues = require('sort-border-values')

function formatProperties (decl) {

  if (decl.prop === 'border') {
    decl.value = sortBorderValues(decl.value)
  }

  return decl
}


module.exports = formatProperties
