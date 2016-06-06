var transformTypes = [
  'translate',
  'matrix',
  'rotate',
  'scale',
  'skew'
]
var transformRegex = new RegExp('(' + transformTypes.join('|') + ')[xyz]?(3d)?\\(', 'ig')
var matrixRegex = /matrix\(/ig
var xyzRegex = /[xyz]{1}(?=\()/g

function transformsToLowerCase (value) {
  return value.replace(transformRegex, function (value) {
    if (matrixRegex.test(value)) {
      return value.toLowerCase()
    }
    return value.toLowerCase().replace(xyzRegex, function (value) {
      return value.toUpperCase()
    })
  })
}

function formatTransforms (value) {
  return transformsToLowerCase(value)
}

module.exports = formatTransforms
