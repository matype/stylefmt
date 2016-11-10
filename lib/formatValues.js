var formatTransforms = require('./formatTransforms')
var formatColors = require('./formatColors')
var formatZeros = require('./formatZeros')
var formatShorthand = require('./formatShorthand')
var getProperty =  require('./util').getProperty

function formatvalues (decl, stylelint) {
  var isDataUrl = /data:.+\/(.+);base64,(.*)/.test(decl.value)
  var isVarNotation = /var\s*\(.*\)/.test(decl.value)
  var isString = /^("|').*("|')$/.test(decl.value)
  var isFunctionCall = /\w+\(.+\)/.test(decl.value)

  if (decl.raws.value) {
    decl.raws.value.raw = decl.raws.value.raw.trim()
  }

  if (!isString) {
    decl.value = decl.value.trim().replace(/\s+/g, ' ')
  }

  switch (getProperty(stylelint, 'string-quotes')) {
    case 'double':
      decl.value = decl.value.replace(/'/g, '"')
      break
    case 'single':
      decl.value = decl.value.replace(/"/g, '\'')
      break
  }

  if (decl.prop === 'content') {
    return decl
  }

  if (decl.prop === 'font-family') {
    decl.value = decl.value.trim().replace(/\s+,\s/g, ', ')
    return decl
  }

  if (!isDataUrl) {
    // Remove spaces before commas and keep only one space after.
    decl.value = decl.value.trim().replace(/(\s+)?,(\s)*/g, ', ')
  }

  if (isVarNotation) {
    decl.value = decl.value.replace(/var\s*\(\s*/g, 'var(')
    decl.value = decl.value.replace(/\s*\)/g, ')')
  }

  if (!isFunctionCall) {
    // format math operators before `$` or `(`.
    decl.value = decl.value.replace(/(?!^)[+\-*%](?=\$|\()/g, ' $& ')
    // don't format "/" from a "font" shorthand property.
    if (decl.prop !== 'font') {
      decl.value = decl.value.replace(/\/(?=\$|\(|\d)/g, ' $& ')
    }
    // format "-" if it is between numbers
    decl.value = decl.value.replace(/\d+-(?=\d)/g, function (value) {
      return value.replace(/-/g, ' $& ')
    })
  }

  decl.value = decl.value.replace(/\(\s*/g, '(')
  decl.value = decl.value.replace(/\s*\)/g, ')')

  decl.value = formatShorthand(decl, stylelint)
  decl.value = formatZeros(decl.value, stylelint)
  decl.value = formatColors(decl.value, stylelint)
  decl.value = formatTransforms(decl.value)

  if (decl.important) {
    decl.raws.important = " !important"
  }

  return decl
}


module.exports = formatvalues
