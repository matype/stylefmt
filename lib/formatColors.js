var cssColors = require('css-color-list')
var namedColorsRegex = new RegExp('(^|\s+)(' + cssColors().join('|') + ')(?=\$|\s+)', 'ig')
var hslRegex = /hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d\.]+)?\s*\)/ig
var hexRegex = /#[a-f0-9]{3}([a-f0-9]{3})?/ig
var rgbRegex = /rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d\.]+)?\s*\)/ig

function toLowerCase(value) {
  return value.toLowerCase()
}

function colorsToLowerCase(value) {
  return value.replace(namedColorsRegex, toLowerCase)
              .replace(hslRegex, toLowerCase)
              .replace(hexRegex, toLowerCase)
              .replace(rgbRegex, toLowerCase)
}

function formatColors(value) {
  return colorsToLowerCase(value)
}

module.exports = formatColors
