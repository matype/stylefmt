var formatSelectors = require('./formatSelectors')
var formatDecls = require('./formatDecls')
var getIndent = require('./getIndent')

function formatRules (root, params) {
  var stylelint = params.stylelint
  var indentWidth = params.indentWidth

  root.walkRules(function (rule, index) {
    var ruleBefore
    var parentType = rule.parent.type
    var indentation = getIndent(rule, indentWidth)

    var hasComment = false
    var prev = rule.prev()
    if (prev && prev.type === 'comment') {
      hasComment = true
    }

    if (index === 0 && parentType === 'root') {
      ruleBefore = ''
    } else {

      if (parentType === 'atrule') {
        if (rule.parent.first === rule) {
          ruleBefore = '\n' + indentation
        } else {
          ruleBefore = '\n\n' + indentation
        }
      }
      if (parentType === 'rule') {
        if (rule.parent.first === rule) {
          ruleBefore = '\n' + indentation
        } else {
          ruleBefore = '\n\n' + indentation
        }
      }

      if (parentType === 'root') {
        ruleBefore = '\n\n' + indentation
      }

      if (hasComment) {
        ruleBefore = '\n' + indentation
      }
    }

    if (stylelint['block-opening-brace-newline-before']) {
      rule.raws.between = blockOpeningBraceNewlineBefore(stylelint, rule)
    } else {
      rule.raws.between = blockOpeningBraceSpaceBefore(stylelint, rule)
    }
    rule.raws.before = ruleBefore
    rule.raws.after = '\n' + indentation
    rule.raws.semicolon = true

    rule = formatSelectors(rule, indentation, stylelint)
    rule = formatDecls(rule, indentation, indentWidth)

    rule.walkAtRules(function (rule) {
      var indentation = getIndent(rule, indentWidth)
      formatDecls(rule, indentation, indentWidth)
    })
  })

  return root
}

function blockOpeningBraceSpaceBefore(stylelint, rule, isSingleLine) {
  if (isIgnoreRule(stylelint, rule)) {
    return rule.raws.between
  }
  switch (stylelint['block-opening-brace-space-before']) {
    case 'never':
      return ''
    case 'always-single-line':
      if (!isSingleLine) {
        return rule.raws.between
      }
      return ' '
    case 'never-single-line':
      if (!isSingleLine) {
        return rule.raws.between
      }
      return ''
    case 'always-multi-line':
      if (isSingleLine || rule.raws.between.match(/ {/)) {
        return rule.raws.between
      }
      return ' '
    case 'never-multi-line':
      if (isSingleLine) {
        return rule.raws.between
      }
      return ''
    default:
      return ' '
  }
}

function blockOpeningBraceNewlineBefore(stylelint, rule, isSingleLine) {
  if (isIgnoreRule(stylelint, rule)) {
    return rule.raws.between
  }
  switch (stylelint['block-opening-brace-newline-before']) {
    case 'always':
      return '\n'
    case 'always-single-line':
      if (!isSingleLine) {
        return rule.raws.between
      }
      return '\n'
    case 'never-single-line':
      if (!isSingleLine) {
        return rule.raws.between
      }
      return ''
    case 'always-multi-line':
      if (isSingleLine) {
        return rule.raws.between
      }
      return ' '
    case 'never-multi-line':
      if (isSingleLine) {
        return rule.raws.between
      }
      return ''
    default:
      return rule.raws.between
  }
}

function isIgnoreRule(stylelint, css) {
  if (!stylelint.ignoreAtRules) {
    return false
  }
  return stylelint.ignoreAtRules.some(function (ignoreRule) {
    return css.match(new RegExp(ignoreRules, 'g'))
  })
}

module.exports = formatRules
