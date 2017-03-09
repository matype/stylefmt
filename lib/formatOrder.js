var sorting = require('postcss-sorting')

function formatOrder (root, params) {
  var sortOrder =
    processOrderPluginRule(params.stylelint['order/declaration-block-property-groups-structure']) ||
    processStylelintRule(params.stylelint['declaration-block-properties-order'])

  if (!Array.isArray(sortOrder)) {
    return
  }

  // stylelint-order rule or default
  var declarationBlockOrder = params.stylelint['order/declaration-block-order'] || [
    'at-rules',
    'custom-properties',
    'dollar-variables',
    'declarations',
    'rules',
  ]
  declarationBlockOrder = flattenRule(declarationBlockOrder)

  var sort = sorting({
    'order': declarationBlockOrder,
    'properties-order': sortOrder
  })

  sort(root)
}

function processOrderPluginRule (sortOrder) {
  if (!Array.isArray(sortOrder)) {
    return
  }

  sortOrder = flattenRule(sortOrder)

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

  sortOrder = flattenRule(sortOrder)

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

function flattenRule (rule) {
  if (Array.isArray(rule[0])) {
    return rule[0]
  }
  return rule
}

module.exports = formatOrder
