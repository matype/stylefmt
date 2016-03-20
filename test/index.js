var fs = require('fs')
var path = require('path')
var tape = require('tape')
var fmt = require('..')

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
    var dir = path.join(process.cwd(), 'test/fixtures')
    t.equal(fmt.process(input(dir, testName)), output(dir, testName))
    t.end()
  })
}

function testWithStylelint (testName) {
  var dir = path.join(process.cwd(), 'test/stylelint', testName)
  var stylelintrcPath = path.resolve(dir, '.stylelintrc');
  var opts = {
    stylelintrcPath: stylelintrcPath
  }
  tape(testName, function (t) {
    t.equal(fmt.process(input(dir, testName), opts), output(dir, testName))
    t.end()
  })
}

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

// for stylelint
testWithStylelint('selector-list-comma-space-before')
testWithStylelint('selector-list-comma-space-after')
testWithStylelint('selector-list-comma-newline-before')
testWithStylelint('selector-list-comma-newline-after')
