var fs = require('fs')
var path = require('path')

var tape = require('tape')

var postcss = require('postcss')
var scss = require('postcss-scss')
var each = require('each-series')
var klaw = require('klaw')

var stylefmt = require('..')

var cwd = process.cwd()
var testBaseDirPaths = [
  path.join(cwd, 'test/fixtures'),
  path.join(cwd, 'test/sass'),
  path.join(cwd, 'test/stylelint')
]

;(function main () {
  walkDirs(testBaseDirPaths).then(function (testDirPaths) {
    each(testDirPaths, test)
  }).catch(function (err) {
    console.trace(err)
  })
})()

function walkDirs (basePaths) {
  var items = []
  var promises = []
  basePaths.forEach(function (basePath) {
    var p = new Promise(function (resolve, reject) {
      klaw(basePath)
        .on('data', function (item) {
          if (!fs.statSync(item.path).isDirectory() || basePath === item.path) return
          items.push(item.path)
        })
        .on('end', resolve)
        .on('error', reject)
    })
    promises.push(p)
  })
  return Promise.all(promises).then(function () {
    return items
  })
}

function test (testDirPath, index, nextTest) {
  var testName = path.basename(testDirPath)
  var input = fs.readFileSync(path.join(testDirPath, testName + '.css'), 'utf-8')
  var expected = fs.readFileSync(path.join(testDirPath, testName + '.out.css'), 'utf-8')
  tape(testName, function (t) {
    t.plan(1)
    process.chdir(testDirPath)
    postcss([stylefmt]).process(input, {
      syntax: scss
    }).then(function (result) {
      t.equal(result.css, expected)
      t.end()
    }).catch(function (err) {
      t.end(err)
    })
  }).on('end', nextTest)
}
