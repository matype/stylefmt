var formatValues = require('./formatValues')
var hasDecls = require('./hasDecls')
var unprefixer = require('./unprefixer')
var hasEmptyLine = require('stylelint/lib/utils/hasEmptyLine')
var isStandardSyntaxDeclaration = require('stylelint/lib/utils/isStandardSyntaxDeclaration')
var isCustomProperty = require('stylelint/lib/utils/isCustomProperty')
var util = require('./util')
var getProperty = util.getProperty
var getOptions = util.getOptions
var isSingleLineString = require('stylelint/lib/utils/isSingleLineString')
var postcss = require('postcss')

function formatDecls (rule, indent, indentWidth, stylelint) {
  function clearPrefixedDecl (decl) {
    var prop = postcss.vendor.unprefixed(decl.prop)
    var prefixedDecls = []
    var unprefixed
    var lastUnprefixed

    rule.walkDecls(new RegExp('^-\\w+-' + prop + '$'), function (decl) {
        prefixedDecls.push(decl)
    })

    rule.walkDecls(unprefixer(decl).prop || prop, function (decl) {
      lastUnprefixed = unprefixer(decl)
      if(lastUnprefixed.value) {
        prefixedDecls.push(decl)
      } else {
        unprefixed = decl
      }
    })

    if (!unprefixed) {
      var lastDecl = prefixedDecls.pop();
      (lastUnprefixed || unprefixer(lastDecl)).replace()
    }

    prefixedDecls.forEach(function (decl) {
      decl.remove()
    })
  }
  const isSingleLine = isSingleLineString(rule)
  if (hasDecls(rule)) {
    var propNoVendorPrefix = getProperty(stylelint, 'property-no-vendor-prefix')
    var valueNoVendorPrefix = getProperty(stylelint, 'value-no-vendor-prefix')
    rule.walkDecls(function (decl) {
      if ((propNoVendorPrefix && /^-\w+-(.+)$/.test(decl.prop)) || (valueNoVendorPrefix && /(^|,|\s)-\w+-.+/.test(decl.value))) {
        clearPrefixedDecl(decl)
        if(!decl.parent) {
          return
        }
      }

      var isSassVal = /^\$/.test(decl.prop)
      var isIEHack = (/(\*|_)$/).test(decl.raws.before)
      if (decl.prop && !isCustomProperty(decl.prop) && !isSassVal) {
        decl.prop = decl.prop.toLowerCase()
      }

      if (isIEHack) {
        decl.prop = decl.raws.before.trim().replace(/\n/g, '') + decl.prop
      }

      decl.raws.between = ': '
      decl.raws.before = declarationEmptyLineBefore(stylelint, decl, indent, indentWidth, isSingleLine)

      if (getProperty(stylelint, 'declaration-colon-space-before')) {
        decl.raws.between = declarationColonSpaceBefore(stylelint, decl.raws.between)
      }

      if (getProperty(stylelint, 'declaration-colon-space-after')) {
        decl.raws.between = declarationColonSpaceAfter(stylelint, decl.raws.between)
      }

      formatValues(decl, stylelint)
    })
  }

  return rule
}

function declarationColonSpaceBefore (stylelint, between) {
  switch (getProperty(stylelint, 'declaration-colon-space-before')) {
    case 'always':
      return ' ' + between
    default:
      return between
  }
}

function declarationColonSpaceAfter (stylelint, between) {
  switch (getProperty(stylelint, 'declaration-colon-space-after')) {
    case 'never':
      return between.trim()
    default:
      return between
  }
}


function declarationEmptyLineBefore (stylelint, decl, indent, indentWidth, isSingleLine) {
  var ignore = false
  var prev = decl.prev()
  var nlCount = (decl.raws.before || '').split('\n').length - 1
  var declBefore

  if (getProperty(stylelint, 'declaration-empty-line-before')) {

    var declarationEmptyLineBeforeRule = getProperty(stylelint, 'declaration-empty-line-before')
    var exceptOptions = getOptions(stylelint, 'declaration-empty-line-before', 'except') || []
    var ignoreOptions = getOptions(stylelint, 'declaration-empty-line-before', 'ignore') || []

    var expectEmptyLineBefore = declarationEmptyLineBeforeRule === 'always'

    if (ignoreOptions.indexOf('after-comment') !== -1 && prev && prev.type === 'comment') {
      ignore = true
    }

    if (ignoreOptions.indexOf('after-declaration') !== -1 && prev && prev.prop && isStandardSyntaxDeclaration(prev) && !isCustomProperty(prev.prop)) {
      ignore = true
    }

    if (ignoreOptions.indexOf('inside-single-line-block') !== -1 && isSingleLine) {
      ignore = true
    }

    if (exceptOptions.indexOf('first-nested') !== -1 && decl === decl.parent.first) {
      expectEmptyLineBefore = !expectEmptyLineBefore
    }

    if (exceptOptions.indexOf('after-comment') !== -1 && prev && prev.type === 'comment') {
      expectEmptyLineBefore = !expectEmptyLineBefore
    }

    if (exceptOptions.indexOf('after-declaration') !== -1 && prev && prev.prop && isStandardSyntaxDeclaration(prev) && !isCustomProperty(prev.prop)) {
      expectEmptyLineBefore = !expectEmptyLineBefore
    }

    var hasEmptyLineBefore = hasEmptyLine(decl.raws.before)

    if (decl.parent.type === 'root' && decl === decl.parent.first) {
      declBefore = ''
    } else if (ignore || (expectEmptyLineBefore === hasEmptyLineBefore)) {
        declBefore = '\n'.repeat(nlCount) + indent + indentWidth
    } else {
      if (!hasEmptyLineBefore) {
        declBefore = '\n\n' + indent + indentWidth
      } else {
        declBefore = '\n' + indent + indentWidth
      }
    }
  } else {
    if (prev && prev.type === 'comment') {
      if (nlCount) {
        declBefore = '\n'.repeat(nlCount) + indent + indentWidth
      }
    } else {
      declBefore = '\n' + indent + indentWidth
    }
  }
  return declBefore
}

module.exports = formatDecls
