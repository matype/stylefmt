var valueParser = require('postcss-value-parser')
var getProperty =  require('./util').getProperty

var ignoredCharacters = ["+", "-", "*", "/", "(", ")", "$", "@", "--", "var("]

var ignoredShorthandProperties = [
  "background",
  "font",
  "border",
  "border-top",
  "border-bottom",
  "border-left",
  "border-right",
  "list-style",
  "transition",
]

var shorthandableProperties = [
    "margin",
    "padding",
    "border-width",
    "border-style",
    "border-color",
    "border-radius",
]

function condense (top, right, bottom, left) {
  var lowerTop = top.toLowerCase()
  var lowerRight = right.toLowerCase()
  var lowerBottom = bottom && bottom.toLowerCase()
  var lowerLeft = left && left.toLowerCase()

  if (canCondenseToOneValue(lowerTop, lowerRight, lowerBottom, lowerLeft)) {
    return [top]
  } else if (canCondenseToTwoValues(lowerTop, lowerRight, lowerBottom, lowerLeft)) {
    return [ top, right ]
  } else if (canCondenseToThreeValues(lowerTop, lowerRight, lowerBottom, lowerLeft)) {
    return [ top, right, bottom ]
  } else {
    return [ top, right, bottom, left ]
  }
}

function canCondenseToOneValue (top, right, bottom, left) {
  if (top !== right) { return false }

  return top === bottom && (bottom === left || !left) || !bottom && !left
}

function canCondenseToTwoValues (top, right, bottom, left) {
  return top === bottom && right === left || top === bottom && !left && top !== right
}

function canCondenseToThreeValues (top, right, bottom, left) {
  return right === left
}

function hasIgnoredCharacters (value) {
  return ignoredCharacters.some(function (char) {
      return value.indexOf(char) !== -1
  })
}

function isIgnoredShorthandProperty (prop) {
    return ignoredShorthandProperties.indexOf(prop.toLowerCase()) !== -1
}

function isShorthandableProperty (prop) {
    return shorthandableProperties.indexOf(prop.toLowerCase()) !== -1
}


function formatShorthand (decl, stylelint) {
  if (getProperty(stylelint, 'shorthand-property-no-redundant-values') === true) {
    if (
      hasIgnoredCharacters(decl.value)
      || isIgnoredShorthandProperty(decl.prop)
      || !isShorthandableProperty(decl.prop)
    ) { return decl.value }

    var valuesToShorthand = []

    valueParser(decl.value).walk(function (valueNode) {
      if (valueNode.type !== 'word') { return }
        valuesToShorthand.push(valueParser.stringify(valueNode))
      })

      if (valuesToShorthand.length <= 1
        || valuesToShorthand.length > 4
    ) { return decl.value }

      var shortestForm = condense(
        valuesToShorthand[0],
        valuesToShorthand[1],
        valuesToShorthand[2] || null,
        valuesToShorthand[3] || null
      )
      var shortestFormString = shortestForm
        .filter(function (val) { return val })
        .join(' ')

      return shortestFormString
  }

  return decl.value
}

module.exports = formatShorthand
