#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var child_process = require('child_process')
var pkg = require('../package.json')
var cssfmt = require('../')

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2), {
  boolean: [
    'help',
    'versions'
  ],
  alias: {
    h: 'help',
    V: 'versions',
    d: 'diff'
  }
})

var tmp = require('tmp')

if (argv.V) {
  console.log(pkg.version)
}

if (argv.h) {
  console.log('Usage: cssfmt input-name [output-name] [options]')
  console.log('')
  console.log('Options:')
  console.log('')
  console.log('  -d, --diff        output diff against original file')
  console.log('  -V, --versions    output the version number')
  console.log('  -h, --help        output usage information')
}

if (argv._[0]) {
  var input  = argv._[0]
  var output  = argv._[1] || argv._[0]

  var css = fs.readFileSync(input, 'utf-8')
  var formatted = cssfmt.process(css)

  if (argv.d) {
    var fullPath = path.resolve(process.cwd(), input)
    handleDiff(fullPath, input, formatted)
  } else {
    fs.writeFile(output, formatted, function (err) {
      if (err) throw err
    })
  }

}


function diff (pathA, pathB, callback) {
  child_process.exec([
    'git', 'diff', '--ignore-space-at-eol', '--no-index', '--', pathA, pathB
  ].join(' '), callback)
}

function handleDiff (fullPath, original, formatted) {
  tmp.file(function (err, tmpPath, fd) {
    if (err) {
      console.error(err)
      return
    }
    fs.writeSync(fd, formatted)

    console.log(tmpPath)
    console.log(fd)
    console.log(fullPath)
    diff(fullPath, tmpPath, function (err, stdout, stderr) {
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.error(stderr);
      }
    })
  })
}
