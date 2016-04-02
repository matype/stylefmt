var getIndent = require('./getIndent')

function formatComments (root, params) {
  var indentWidth = params.indentWidth

  root.walkComments(function (comment, index) {
    var parentType = comment.parent.type
    var isInline = comment.raws.inline === true
    var isPrevInline = comment.prev() && comment.prev().raws.inline
    var isPrevDecl = comment.prev() && comment.prev().type === 'decl'
    var isPrevAtRule = comment.prev() && comment.prev().type === 'atrule'
    var hasLineBreakBefore = /[\n]/.test(comment.raws.before)
    var commentBefore
    var indentation = getIndent(comment, indentWidth)

    if (index === 0 && parentType === 'root') {
      commentBefore = ''
    } else if ((isPrevDecl || isPrevAtRule) && !hasLineBreakBefore) {
      commentBefore = ' '
    } else {
      if (parentType === 'atrule') {
        if (comment.parent.first === comment) {
          commentBefore = '\n' + indentation
        } else {
          commentBefore = '\n\n' + indentation
        }
      }

      if (parentType === 'rule') {
        if (isInline && (comment.parent.first === comment || isPrevInline)) {
          commentBefore = '\n' + indentation
        } else {
          commentBefore = '\n\n' + indentation
        }
      }

      if (parentType === 'root') {
        // Handle multiline inline comments.
        if (isInline && isPrevInline) {
          commentBefore = '\n' + indentation
        } else {
          commentBefore = '\n\n' + indentation
        }
      }
    }

    comment.raws.before = commentBefore
  })

  return root
}


module.exports = formatComments
