var fs = require('fs-extra')
var path = require('path')

var tape = require('tape')
var postcss = require('postcss')
var scss = require('postcss-scss')
var stylefmt = require('..')

function input (testType, testName) {
  var filepath = path.resolve('test', testType, testName + '.css')
  return fs.readFileSync(filepath, 'utf-8')
}

function output (dir, testName) {
  var filepath = path.resolve(dir, testName + '.out.css')
  return fs.readFileSync(filepath, 'utf-8')
}

function test (testName) {
  tape(testName, function (t) {
    t.plan(1)
    var testDir = path.join(process.cwd(), 'test/fixtures')
    postcss([stylefmt])
      .process(input(testDir, testName), { syntax: scss })
      .then(function (result) {
        t.equal(result.css, output(testDir, testName))
        t.end()
      }).catch(function (err) {
        t.error(err)
        t.end()
      })
  })
}

function testWithStylelint (testName, configFileName) {
  if (!configFileName) {
    configFileName = '.stylelintrc'
  }
  tape(testName, function (t) {
    t.plan(1)
    var cwd = process.cwd()
    var configSrc = path.resolve(path.join(cwd, 'test/stylelint', testName), configFileName)
    var configDest = path.resolve(cwd, configFileName)
    fs.copySync(configSrc, configDest, { clobber: true })
    var testDir = path.join(cwd, 'test/stylelint', testName)
    postcss([stylefmt])
      .process(input(testDir, testName), { syntax: scss })
      .then(function (result) {
        t.equal(result.css, output(testDir, testName))
        var config = path.resolve(process.cwd(), configFileName)
        fs.removeSync(config)
        t.end()
      }).catch(function (err) {
        t.error(err)
        t.end()
      })
    })

}

tape.onFinish(function () {
  var stylelintrc = path.resolve(process.cwd(), '.stylelintrc')
  fs.removeSync(stylelintrc)
})

test('readme')
test('nested')
test('nested-2')
test('non-nested-combinator')
test('important')
test('values')
test('comment')
test('comment-in-rules')
test('vendor-prefix')
test('nested-atrule')
test('nested-mixin')
test('nested-mixin-2')
test('font-face')
test('font-shorthand')
test('import')
test('charset')
test('charset-2')
test('pseudo-element')
test('at-media')
test('data-url')
test('color-hex-lowercase')
test('lowercase')
test('content')
test('ie-hacks')

// for future syntaxes
test('cssnext-example')
test('custom-properties')
test('var-notation')
test('custom-media-queries')
test('media-queries-ranges')
test('custom-selectors')
test('at-apply')

// for Sass
test('sass-mixin')
test('sass-mixin-2')
test('sass-extend')
test('sass-variables')
test('shorthand-with-sass-variables')
test('sass-include')
test('sass-include-2')
test('inline-comment')
test('sass-function')
test('sass-function-2')
test('scss')
test('sass-at-root')
test('sass-comment')
test('sass-inline-comment')
test('sass-content')
test('sass-single-at-rule')
test('sass-math')
test('sass-if-else')
test('sass-if-else-2')
test('sass-indent')
test('media-indent')
test('media-indent-with-import')

// for stylelint configuration
testWithStylelint('selector-list-comma-space-before-always', '.stylelintrc.json')
testWithStylelint('selector-list-comma-space-before-never', '.stylelintrc.config.js')
testWithStylelint('selector-list-comma-space-before-always-single-line', '.stylelintrc.js')
testWithStylelint('selector-list-comma-space-before-never-single-line', '.stylelintrc.yaml')
testWithStylelint('selector-list-comma-newline-before-always')
testWithStylelint('selector-list-comma-newline-before-always-multi-line')
testWithStylelint('selector-list-comma-newline-before-never-multi-line')
testWithStylelint('selector-list-comma-space-after-always')
testWithStylelint('selector-list-comma-space-after-never')
testWithStylelint('selector-list-comma-space-after-always-single-line')
testWithStylelint('selector-list-comma-space-after-never-single-line')
testWithStylelint('selector-list-comma-newline-after-always')
testWithStylelint('selector-list-comma-newline-after-always-multi-line')
testWithStylelint('selector-list-comma-newline-after-never-multi-line')
testWithStylelint('selector-combinator-space-before-always')
testWithStylelint('selector-combinator-space-before-never')
testWithStylelint('selector-combinator-space-after-always')
testWithStylelint('selector-combinator-space-after-never')
testWithStylelint('block-opening-brace-space-before-always')
testWithStylelint('block-opening-brace-space-before-never')
testWithStylelint('block-opening-brace-space-before-always-single-line')
testWithStylelint('block-opening-brace-space-before-never-single-line')
testWithStylelint('block-opening-brace-space-before-always-multi-line')
testWithStylelint('block-opening-brace-space-before-never-multi-line')
testWithStylelint('block-opening-brace-newline-before-always')
testWithStylelint('block-opening-brace-newline-before-always-single-line')
testWithStylelint('block-opening-brace-newline-before-never-single-line')
testWithStylelint('block-opening-brace-newline-before-always-multi-line')
testWithStylelint('block-opening-brace-newline-before-never-multi-line')
testWithStylelint('indentation-2space')
testWithStylelint('indentation-4space')
testWithStylelint('indentation-tab')
testWithStylelint('at-rule-semicolon-newline-after-always')
testWithStylelint('block-closing-brace-newline-after-always')
testWithStylelint('block-closing-brace-newline-after-always-single-line')
testWithStylelint('block-closing-brace-newline-after-never-single-line')
testWithStylelint('block-closing-brace-newline-after-always-multi-line')
testWithStylelint('block-closing-brace-newline-after-never-multi-line')
