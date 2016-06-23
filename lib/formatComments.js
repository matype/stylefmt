var repeatString = require('repeat-string')
var getIndent = require('./getIndent')

function formatComments (root, params) {
  var indentWidth = params.indentWidth

  root.walkComments(function (comment, index) {
    var parentType = comment.parent.type
    var indentation = getIndent(comment, indentWidth)
    var nlCount = comment.raws.before.split('\n').length - 1
    var spaceCount = comment.raws.before.split(' ').length - 1
    if (parentType !== 'root') {
      if (nlCount) {
        comment.raws.before = repeatString('\n', nlCount) + indentation
      }
    } else {
      if (nlCount) {
        comment.raws.before = repeatString('\n', nlCount) + indentation
      } else if (spaceCount){
        comment.raws.before = repeatString(' ', spaceCount)
      }
    }
  })

  return root
}


module.exports = formatComments
