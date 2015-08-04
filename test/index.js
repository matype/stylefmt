var fs = require('fs')
var test = require('tape')
var cssfmt = require('..')

test('fmt', function (t) {
  var input = 'test/input.css'
  var expected = fs.readFileSync('test/output.css', 'utf-8')
  t.equal(cssfmt(input).toString(), expected)
  t.end()
})
