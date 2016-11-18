var cssColors = require('css-color-list')
var namedColorsRegex = new RegExp('(^|\s+)(' + cssColors().join('|') + ')(?=\$|\s+)', 'ig')
var hslRegex = /hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d\.]+)?\s*\)/ig
var hexRegex = /#[a-f0-9]{3}([a-f0-9]{3})?/ig
var rgbRegex = /rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d\.]+)?\s*\)/ig
var hexShortRegex = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i
var hexLongRegex = /#([a-f0-9])\1{1}([a-f0-9])\2{1}([a-f0-9])\3{1}/i

function toLowerCase (value) {
  return value.toLowerCase()
}

function toUpperCase (value) {
  return value.toUpperCase()
}

function getProperty (stylelint, prop) {
  var stylelintProperty = null
  if (stylelint && stylelint[prop]) {
    stylelintProperty = stylelint[prop]
    if (typeof stylelintProperty === 'object') {
      stylelintProperty = stylelintProperty[0]
    }
  }

  return stylelintProperty
}

function shortenColors (value, stylelint) {
  var colorHexLength = getProperty(stylelint, 'color-hex-length')
  var shortenReplace = '#$1$2$3'
  var longerReplace = '#$1$1$2$2$3$3'

  if (colorHexLength === 'short') {
    value = value.replace(hexLongRegex, shortenReplace)
  } else if (colorHexLength === 'long') {
    value = value.replace(hexShortRegex, longerReplace)
  }

  return value
}

function formatColors (value, stylelint) {
  var colorCase = getProperty(stylelint, 'color-hex-case')
  var formatCase = toLowerCase
  var formatLengthColor = shortenColors(value, stylelint)
  if (colorCase === 'upper') {
    formatCase = toUpperCase
  }

  return formatLengthColor.replace(namedColorsRegex, formatCase)
                          .replace(hslRegex, formatCase)
                          .replace(hexRegex, formatCase)
                          .replace(rgbRegex, formatCase)
}

module.exports = formatColors
