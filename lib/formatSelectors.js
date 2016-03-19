var fs = require('fs')
var path = require('path')
var getIndent = require('./getIndent')

var stylelintrcPath = path.resolve(__dirname, '../.stylelintrc')
var stylelintrc = JSON.parse(fs.readFileSync(stylelintrcPath, 'utf8'))

function formatSelectors (rule) {
  var tmp = []
  var isSingleLine = false

  rule.selectors.forEach(function (selector, i) {
    // don't add extra spaces to :nth-child(5n+1) etc.
    if (!hasPlusInsideParens(selector)) {
      selector = selector.replace(/\s*([+~>])\s*/g, " $1 ")
    }
    selector = selectorCombinatorSpaceBefore(selector)
    selector = selectorCombinatorSpaceAfter(selector)

    tmp.push(selector)
    if (i > 0 && !tmp[1].match('\n') && !isSingleLine) {
      isSingleLine = true
    }
  })

  var separator = selectorListCommaSpaceBefore(isSingleLine)
                    + selectorListCommaNewlineBefore(isSingleLine)
                    + ','
                    + selectorListCommaNewlineAfter(isSingleLine)
                    + selectorListCommaSpaceAfter(isSingleLine)
  switch (isSingleLine) {
    case /\n,/.test(separator):
      separator = separator.replace(' \n,', getIndent(rule) + '\n,')
      break
    case /,\n/.test(separator):
      separator = separator.replace(',\n ', ',\n' + getIndent(rule))
      break
  }
  rule.selector = tmp.join(separator)

  return rule
}

function selectorCombinatorSpaceBefore(selector) {
  switch (stylelintrc.rules['selector-combinator-space-before']) {
    case 'never':
      return selector.replace(/^\s*([+~>])\s*/g, "$1")
    default:
      return selector.replace(/^\s*([+~>])\s*/g, " $1")
  }
}

function selectorCombinatorSpaceAfter(selector) {
  switch (stylelintrc.rules['selector-combinator-space-after']) {
    case 'never':
      return selector.replace(/^\s*([+~>])\s*/g, "$1")
    default:
      return selector.replace(/^\s*([+~>])\s*/g, "$1 ")
  }
}

function selectorListCommaNewlineBefore(isSingleLine) {
  switch (stylelintrc.rules['selector-list-comma-newline-before']) {
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

function selectorListCommaNewlineAfter(isSingleLine) {
  switch (stylelintrc.rules['selector-list-comma-newline-after']) {
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

function selectorListCommaSpaceBefore(isSingleLine) {
  switch (stylelintrc.rules['selector-list-comma-space-before']) {
    case 'always':
      return ' '
    case 'always-single-line':
      if (isSingleLine) {
        return ' '
      }
      return getIndent(rule)
    case 'never-single-line':
      if (isSingleLine) {
        return ''
      }
      return ' '
    default:
      return ''
  }
}

function selectorListCommaSpaceAfter(isSingleLine) {
  switch (stylelintrc.rules['selector-list-comma-space-before']) {
    case 'always':
      return ' '
    case 'always-single-line':
      if (isSingleLine) {
        return ' '
      }
      return ''
    case 'never-single-line':
      if (isSingleLine) {
        return ''
      }
      return ' '
    default:
      return ' '
  }
}

function hasPlusInsideParens (selector) {
  return (/\(.+\+.+\)/).test(selector)
}

module.exports = formatSelectors
