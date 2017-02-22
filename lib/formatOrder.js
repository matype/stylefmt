var sorting = require('postcss-sorting')

function formatOrder (root, params) {
  var sortOrder =
    processOrderPluginRule(params.stylelint['order/declaration-block-property-groups-structure']) ||
    processStylelintRule(params.stylelint['declaration-block-properties-order'])

  if (!Array.isArray(sortOrder)) {
    return
  }

  var sort = sorting({
    'order': [
      'at-rules',
      'custom-properties',
      'dollar-variables',
      'declarations',
      'rules',
    ],
    'properties-order': sortOrder
  })

  sort(root)
}

function processOrderPluginRule (sortOrder) {
  if (!Array.isArray(sortOrder)) {
    return
  }

  // If the sylelint array configuration style is used, the sort order is the
  // first item in the list.
  if (Array.isArray(sortOrder[0])) {
    sortOrder = sortOrder[0]
  }

  return sortOrder.map(function (item) {
    if (typeof item === 'object' && item.emptyLineBefore === 'always') {
      // we should change "always" to "true" for postcss-sorting
      // copy item to prevent side effects
      return Object.assign({}, item, {emptyLineBefore: true})
    }
    return item
  })
}

function processStylelintRule (sortOrder) {
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

  return flattenedSortOrder
}

module.exports = formatOrder
