var fs = require('fs')
var test = require('tape')
var cssfmt = require('..')

test('fmt', function (t) {
  var input = fs.readFileSync('test/input.css', 'utf-8')
  var expected = fs.readFileSync('test/output.css', 'utf-8')
  t.equal(cssfmt.process(input), expected)
  t.end()
})
