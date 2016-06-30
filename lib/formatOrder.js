var sorting = require('postcss-sorting');

function formatOrder(root, params) {
  var sortOrder = params.stylelint['declaration-block-properties-order'];
  if (!Array.isArray(sortOrder)) {
    return;
  }

  var sort = sorting({
    'sort-order': sortOrder
  });

  sort(root);
}

module.exports = formatOrder;
