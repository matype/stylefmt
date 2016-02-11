var formatTransforms = require('./formatTransforms')
var formatColors = require('./formatColors')

function formatProperties (decl) {
  var isDataUrl = (/data:.+\/(.+);base64,(.*)/).test(decl.value)
  var isVarNotation = (/var\s*\(.*\)/).test(decl.value)
  var isString = (/^("|').+("|')$/).test(decl.value)
  var isFunctionCall = (/\w+\(.+\)/).test(decl.value)

  if (decl.raws.value) {
    decl.raws.value.raw = decl.raws.value.raw.trim()
  }

  if (!isString) {
    decl.value = decl.value.trim().replace(/\s+/g, ' ')
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
    decl.value = decl.value.trim().replace(/(?!^)[+\-*/%](?=\$|\(|\d)/g, ' $& ')
  }

  decl.value = decl.value.replace(/\(\s*/g, '(')
  decl.value = decl.value.replace(/\s*\)/g, ')')

  decl.value = formatColors(decl.value)
  decl.value = formatTransforms(decl.value)

  if (decl.important) {
    decl.raws.important = " !important"
  }

  return decl
}


module.exports = formatProperties
