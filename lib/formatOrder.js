var sorting = require('postcss-sorting')

function formatOrder (root, params) {
  var sortOrder = getSordOrder(params)
  if (!sortOrder) {
    return
  }

  var sort = sorting({
    'order': getDeclarationBlocksOrder(params),
    'properties-order': sortOrder
  })

  sort(root)
}

function getSordOrder (params) {
  if (params.stylelint['order/properties-alphabetical-order']) {
    return 'alphabetical'
  }

  var propertiesOrder =
    processOrderPluginRule(params.stylelint['order/properties-order']) ||
    processStylelintRule(params.stylelint['declaration-block-properties-order'])

  if (!Array.isArray(propertiesOrder)) {
    return
  }

  return propertiesOrder
}

function getDeclarationBlocksOrder (params) {
  // stylelint-order rule or default
  var declarationBlockOrder = params.stylelint['order/order'] || [
    'at-rules',
    'custom-properties',
    'dollar-variables',
    'declarations',
    'rules',
  ]
  return flattenRule(declarationBlockOrder)
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
