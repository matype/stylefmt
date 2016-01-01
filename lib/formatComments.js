var getIndent = require('./getIndent')

function formatComments (root) {

  root.walkComments(function (comment, index) {
    var parentType = comment.parent.type
    var isInline = comment.raws.inline === true
    var isPrevInline = comment.prev() && comment.prev().raws.inline
    var isPrevDecl = comment.prev() && comment.prev().type === 'decl'
    var hasLineBreakBefore = /[\n]/.test(comment.raws.before)
    var commentBefore

    if (index === 0 && parentType === 'root') {
      commentBefore = ''
    } else if (isPrevDecl && !hasLineBreakBefore) {
      commentBefore = ' '
    } else {
      if (parentType === 'atrule') {
        if (comment.parent.first === comment) {
          commentBefore = '\n' + getIndent(comment)
        } else {
          commentBefore = '\n\n' + getIndent(comment)
        }
      }

      if (parentType === 'rule') {
        if (isInline && (comment.parent.first === comment || isPrevInline)) {
          commentBefore = '\n' + getIndent(comment)
        } else {
          commentBefore = '\n\n' + getIndent(comment)
        }
      }

      if (parentType === 'root') {
        // Handle multiline inline comments.
        if (isInline && isPrevInline) {
          commentBefore = '\n' + getIndent(comment)
        } else {
          commentBefore = '\n\n' + getIndent(comment)
        }
      }
    }

    comment.raws.before = commentBefore
  })

  return root
}


module.exports = formatComments
