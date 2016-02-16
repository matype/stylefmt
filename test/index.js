var fs = require('fs')
var tape = require('tape')
var fmt = require('..')

function input (name) {
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf-8')
}

function output (name) {
  return fs.readFileSync('test/fixtures/' + name + '.out.css', 'utf-8')
}

function test (name, description) {
  description = description || name
  return tape(description, function (t) {
    t.equal(fmt.process(input(name)), output(name))
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
