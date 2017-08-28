var formatTransforms = require('./formatTransforms')
var formatColors = require('./formatColors')
var formatZeros = require('./formatZeros')
var formatShorthand = require('./formatShorthand')
var valueParser = require('postcss-value-parser')
var getProperty =  require('./util').getProperty

function formatValues (decl, indent, indentWidth, stylelint) {
  var isDataUrl = /data:.+\/(.+);base64,(.*)/.test(decl.value)
  var isVarNotation = /var\s*\(.*\)/.test(decl.value)
  var isString = /^("|').*("|')$/.test(decl.value)
  var isFunctionCall = /\w+\(.+\)/.test(decl.value)

  if (decl.raws.value) {
    decl.raws.value.raw = decl.raws.value.raw.trim()
  }

  if (!isString) {
    var parsedValue = valueParser(decl.value)
    decl.value = ''
    parsedValue.nodes.forEach(function (node) {
      var value = valueParser.stringify(node)
      value = value.replace(/\s+/g, ' ')
      if (node.before && node.before.indexOf('\n') !== -1) {
        decl.value += '\n'
      }
      decl.value += value
      if (node.after && node.after.indexOf('\n') !== -1) {
        decl.value += '\n'
      }
    })

    decl.value = decl.value.trim().replace(/[^\S\n]+/g, ' ')
    decl.value = decl.value.replace(/\n /, '\n')
    decl.value = decl.value.replace(/ \n/, '\n')
    decl.value = decl.value.replace(
      /\n+/g, '\n' + indent + indentWidth.repeat(2))
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
    decl.value = decl.value.trim().replace(/[^\S\n]+,[^\S\n]/g, ', ')
    return decl
  }

  if (!isDataUrl) {
    // Remove spaces before commas and keep only one space after.
    decl.value = decl.value.trim().replace(/([^\S\n]+)?,[^\S\n]*/g, ',')
    decl.value = decl.value.replace(/,([^\n])/g, ', $1')
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


module.exports = formatValues
