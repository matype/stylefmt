var getProperty = require('./util').getProperty
function formatSelectors (rule, indentation, stylelint) {
  var tmp = []
  var isSingleLine = false

  rule.selectors.forEach(function (selector, i) {
    // don't add extra spaces to :nth-child(5n+1) etc.
    if (!hasPlusInsideParens(selector) && !isAttrSelector(selector)) {
      selector = selector.replace(/\s*([+~>])\s*/g, " $1 ")
    }

    if (isAttrSelector(selector)) {
      selector = selector.replace(/\[\s*(\S+)\s*\]/g, "[$1]")
    }

    selector = selectorTransform(stylelint, selector)
    selector = selectorCombinatorSpaceBefore(stylelint, selector)
    selector = selectorCombinatorSpaceAfter(stylelint, selector)

    tmp.push(selector)
    if (i > 0 && !tmp[1].match('\n') && !isSingleLine) {
      isSingleLine = true
    }
  })

  var separator = selectorListCommaSpaceBefore(stylelint, isSingleLine, indentation)
    + selectorListCommaNewlineBefore(stylelint, isSingleLine, indentation)
    + ','
  if (getProperty(stylelint, 'selector-list-comma-space-after')) {
    separator += selectorListCommaSpaceAfter(stylelint, isSingleLine)
  } else {
    separator += selectorListCommaNewlineAfter(stylelint, isSingleLine)
    switch (isSingleLine) {
      case /\n,/.test(separator):
        separator = separator.replace('\n,', indentation + '\n,')
        break
      case /,\n/.test(separator):
        separator = separator.replace(',\n', ',\n' + indentation)
        break
    }
  }
  rule.selector = tmp.join(separator)

  return rule
}

function selectorCombinatorSpaceBefore (stylelint, selector) {
  switch (getProperty(stylelint, 'selector-combinator-space-before')) {
    case 'never':
      return selector.replace(/\s+(?=[+~>])/g, "")
    default:
      return selector.replace(/^\s*([+~>])/g, " $1")
  }
}

function selectorCombinatorSpaceAfter (stylelint, selector) {
  switch (getProperty(stylelint, 'selector-combinator-space-after')) {
    case 'never':
      return selector.replace(/([+~>])\s*/g, "$1")
    default:
      return selector.replace(/^\s*([+~>])\s*/g, "$1 ")
  }
}

function selectorListCommaNewlineBefore (stylelint, isSingleLine, indentation) {
  switch (getProperty(stylelint, 'selector-list-comma-newline-before')) {
    case 'always':
      return '\n' + indentation
    case 'always-multi-line':
      if (isSingleLine) {
        return '\n'
      }
      return ''
    default:
      return ''
  }
}

function selectorListCommaNewlineAfter (stylelint, isSingleLine) {
  switch (getProperty(stylelint, 'selector-list-comma-newline-after')) {
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

function selectorListCommaSpaceBefore (stylelint, isSingleLine, indentation) {
  switch (getProperty(stylelint, 'selector-list-comma-space-before')) {
    case 'always':
      return ' '
    case 'always-single-line':
      if (isSingleLine) {
        return ' '
      }
      return indentation
    case 'never-single-line':
      if (isSingleLine) {
        return ''
      }
      return ' '
    default:
      return ''
  }
}

function selectorListCommaSpaceAfter (stylelint, isSingleLine) {
  switch (getProperty(stylelint, 'selector-list-comma-space-after')) {
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

function selectorTransform (stylelint, selector) {
  var selectorArray = splitSelector(selector)

  if (selectorArray[2]) {
    selectorArray[2] = transformSelector(getProperty(stylelint, 'selector-type-case'), selectorArray[2])
  }

  if (selectorArray[4]) {
    selectorArray[4] = transformSelector(getProperty(stylelint, 'selector-pseudo-class-case'), selectorArray[4])
  }

  if (selectorArray[5]) {
    selectorArray[5] = transformSelector(getProperty(stylelint, 'selector-pseudo-element-case'), selectorArray[5])
  }

  selectorArray.shift()

  return selectorArray.join('')
}

function transformSelector (toCase, selector) {
  switch (toCase) {
    case 'lower':
      return selector.toLowerCase()
    case 'upper':
      return selector.toUpperCase()
    default:
      return selector
  }
}

/**
 * @description Splits selector into array with four indexes
 * selector[0] = full match (e.g. a.link:hover::after)
 * selector[1] = scss & selector (e.g. &:hover)
 * selector[2] = type selector (e.g. a)
 * selector[3] = class selector (e.g. .link)
 * selector[4] = pseudo selector (e.g. :hover)
 * selector[5] = pseudo element selector (e.g. ::after)
 * @param {string} selector
 * @returns {Array}
 */
function splitSelector (selector) {
  const regex = /([\&]?)((?:\*|\w+)?)((?:\.|\#|\-|\w)*)?(:(?!:)(?:\.|\#|\-|\w)*)?(::(?:\.|\#|\-|\w)*)?/
  let m

  if ((m = regex.exec(selector)) !== null) {
    return m
  }
}

function hasPlusInsideParens (selector) {
  return /\(.+\+.+\)/.test(selector)
}

function isAttrSelector (selector) {
  return /\[.+\]/.test(selector)
}

module.exports = formatSelectors
