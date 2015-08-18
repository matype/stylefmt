function formatComments (root) {

  root.eachComment(function (comment, index) {
    comment.before = index === 0 ? '' : '\n\n\n'
  })

  return root
}


module.exports = formatComments
