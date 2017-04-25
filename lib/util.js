function inAtRule (rule) {
  var ret = false
  var current = rule.parent
  while (current.type !== 'root') {
    if (current.type === 'atrule') {
      ret = true
      break
    }
    current = current.parent
  }

  return ret
}

function getNestedRulesNum (rule) {
  var parent = rule.parent
  var num = 0

  while (parent.type !== 'root') {
    parent = parent.parent
    num++
  }

  return num
}

function isEmptyObject (obj) {
  for (var name in obj) {
    return false
  }
  return true
}

function getProperty (stylelint, prop) {
  var stylelintProperty = null
  if (stylelint && stylelint[prop]) {
    stylelintProperty = stylelint[prop]
    if (typeof stylelintProperty === 'object') {
      stylelintProperty = stylelintProperty[0]
    }
  }

  return stylelintProperty
}

function getOptions (stylelint, prop, option) {
  var stylelintProperty = []
  if (stylelint && stylelint[prop]) {
    stylelintProperty = stylelint[prop]
    if (typeof stylelintProperty === 'object' && stylelintProperty.length > 1) {
      stylelintProperty = stylelintProperty[1][option]
    }
  }

  return stylelintProperty
}

var propNameMap = {
	'border-radius-bottomleft': 'border-bottom-left-radius',
	'border-radius-bottomright': 'border-bottom-right-radius',
	'border-radius-topleft': 'border-top-left-radius',
	'border-radius-topright': 'border-top-right-radius',

	'border-after': 'border-block-end',
	'border-before': 'border-block-start',
	'border-end': 'border-inline-end',
	'border-start': 'border-inline-start',

	'margin-after': 'margin-block-end',
	'margin-before': 'margin-block-start',
	'margin-end': 'margin-inline-end',
	'margin-start': 'margin-inline-start',

	'padding-after': 'padding-block-end',
	'padding-before': 'padding-block-start',
	'padding-end': 'padding-inline-end',
	'padding-start': 'padding-inline-start',

	'mask-box-image': 'mask-border',
	'mask-box-image-outset': 'mask-border-outset',
	'mask-box-image-repeat': 'mask-border-repeat',
	'mask-box-image-slice': 'mask-border-slice',
	'mask-box-image-source': 'mask-border-source',
	'mask-box-image-width': 'mask-border-width',

	'box-align': 'align-items',
	'box-pack': 'justify-content',
	'box-ordinal-group': 'order',
  'flex-order': 'order',
	'box-flex': 'flex',
}

function unprefixProp (prop) {
  prop = prop.replace(/^-\w+-/, '')
  return propNameMap[prop] || prop
}

function unprefixDecl () {

}
module.exports = {
  inAtRule: inAtRule,
  getNestedRulesNum: getNestedRulesNum,
  isEmptyObject: isEmptyObject,
  getProperty: getProperty,
  getOptions: getOptions,
  unprefixProp: unprefixProp,
  unprefixDecl: unprefixDecl,
}
