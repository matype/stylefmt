var fs = require('fs')
var path = require('path')
var getIndent = require('./getIndent')

function formatSelectors (rule, indent, stylelint) {
  var tmp = []
  var isSingleLine = false

  rule.selectors.forEach(function (selector, i) {
    // don't add extra spaces to :nth-child(5n+1) etc.
    if (!hasPlusInsideParens(selector)) {
      selector = selector.replace(/\s*([+~>])\s*/g, " $1 ")
    }
    selector = selectorCombinatorSpaceBefore(stylelint, selector)
    selector = selectorCombinatorSpaceAfter(stylelint, selector)

    tmp.push(selector)
    if (i > 0 && !tmp[1].match('\n') && !isSingleLine) {
      isSingleLine = true
    }
  })

  var separator = selectorListCommaSpaceBefore(stylelint, isSingleLine, indent)
                    + selectorListCommaNewlineBefore(stylelint, isSingleLine)
                    + ','
  if (stylelint['selector-list-comma-space-after']) {
    separator += selectorListCommaSpaceAfter(stylelint, isSingleLine)
  } else {
    separator += selectorListCommaNewlineAfter(stylelint, isSingleLine)
    switch (isSingleLine) {
      case /\n,/.test(separator):
        separator = separator.replace('\n,', indent + '\n,')
        break
      case /,\n/.test(separator):
        separator = separator.replace(',\n', ',\n' + indent)
        break
    }
  }
  rule.selector = tmp.join(separator)

  return rule
}

function selectorCombinatorSpaceBefore(stylelint, selector) {
  switch (stylelint['selector-combinator-space-before']) {
    case 'never':
      return selector.replace(/\s+(?=[+~>])/g, "")
    default:
      return selector.replace(/^\s*([+~>])/g, " $1")
  }
}

function selectorCombinatorSpaceAfter(stylelint, selector) {
  switch (stylelint['selector-combinator-space-after']) {
    case 'never':
      return selector.replace(/([+~>])\s*/g, "$1")
    default:
      return selector.replace(/^\s*([+~>])\s*/g, "$1 ")
  }
}

function selectorListCommaNewlineBefore(stylelint, isSingleLine) {
  switch (stylelint['selector-list-comma-newline-before']) {
    case 'always':
      return '\n'
    case 'always-multi-line':
      if (isSingleLine) {
        return '\n'
      }
      return ''
    default:
      return ''
  }
}

function selectorListCommaNewlineAfter(stylelint, isSingleLine) {
  switch (stylelint['selector-list-comma-newline-after']) {
    case 'always-multi-line':
      if (isSingleLine) {
        return '\n'
      }
      return ','
    case 'never-multi-line':
      return ''
    default:
      return '\n'
  }
}

function selectorListCommaSpaceBefore(stylelint, isSingleLine, indentWidth) {
  switch (stylelint['selector-list-comma-space-before']) {
    case 'always':
      return ' '
    case 'always-single-line':
      if (isSingleLine) {
        return ' '
      }
      return indent
    case 'never-single-line':
      if (isSingleLine) {
        return ''
      }
      return ' '
    default:
      return ''
  }
}

function selectorListCommaSpaceAfter(stylelint, isSingleLine) {
  switch (stylelint['selector-list-comma-space-after']) {
    case 'never':
      return ''
    case 'always-single-line':
      if (isSingleLine) {
        return ' '
      }
      return ''
    case 'never-single-line':
      return ''
    default:
      return ' '
  }
}

function hasPlusInsideParens (selector) {
  return (/\(.+\+.+\)/).test(selector)
}

module.exports = formatSelectors
