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
test('important')
test('values')

test('sass-mixin')
test('sass-extend')
test('sass-variables')
test('sass-include')
test('scss')
