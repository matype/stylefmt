function formatComments (root) {

  root.eachComment(function (comment, index) {
    comment.before = index === 0 ? '' : '\n\n\n'
    /*
    var next = comment.next()
    if (next.type === 'rule') {
      next.hasComment = true
    }
    */
  })

  return root
}


module.exports = formatComments
