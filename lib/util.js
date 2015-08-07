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


function strRepeat (str, num) {
  var ret = ''
  for (var i = 0; i < num; i++) {
    ret += str
  }

  return ret
}


module.exports.inAtRule = inAtRule
module.exports.strRepeat = strRepeat
