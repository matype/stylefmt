var getIndent = require('./getIndent')

function formatComments (root) {

  root.walkComments(function (comment, index) {
    var parentType = comment.parent.type
    var commentBefore

    if (index === 0 && parentType === 'root') {
      commentBefore = ''
    } else {
      if (parentType === 'atrule') {
        if (comment.parent.first === comment) {
          commentBefore = '\n' + getIndent(comment)
        } else {
          commentBefore = '\n\n' + getIndent(comment)
        }
      }

      if (parentType === 'rule') {
        commentBefore = '\n\n' + getIndent(comment)
      }

      if (parentType === 'root') {
        // Handle multiline inline comments.
        if (comment.raws.inline === true && comment.prev().raws.inline) {
          // If the previous line is an inline comment.
          commentBefore = '\n' + getIndent(comment)
        } else {
          commentBefore = '\n\n' + getIndent(comment)
        }
      }
    }

    if (comment.raws.inline === true) {
      comment.raws.left = ' '
    }

    comment.raws.before = commentBefore
  })

  return root
}


module.exports = formatComments
