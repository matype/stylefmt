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


module.exports = {
  inAtRule: inAtRule,
  getNestedRulesNum: getNestedRulesNum,
  isEmptyObject: isEmptyObject,
  getProperty: getProperty,
  getOptions: getOptions
}
