var sorting = require('postcss-sorting')

function formatOrder (root, params) {
  var sortOrder = params.stylelint['declaration-block-properties-order']
  if (!Array.isArray(sortOrder)) {
    return
  }

  // If the sylelint array configuration style is used, the sort order is the
  // first item in the list.
  if (Array.isArray(sortOrder[0])) {
    sortOrder = sortOrder[0]
  }

  // sort order can contain groups, so it needs to be flat for postcss-sorting
  var flattenedSortOrder = []

  sortOrder.forEach(function (item) {
    if (typeof item === 'string') {
      flattenedSortOrder.push(item)
    } else if (typeof item === 'object' && Array.isArray(item.properties)) {
      item.properties.forEach(function (prop) {
        flattenedSortOrder.push(prop)
      })
    }
  })

  var sort = sorting({
    'sort-order': flattenedSortOrder
  })

  sort(root)
}

module.exports = formatOrder
