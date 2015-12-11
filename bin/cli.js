#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var child_process = require('child_process')
var stdin = require('stdin')
var pkg = require('../package.json')
var cssfmt = require('../')

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2), {
  boolean: [
    'help',
    'version'
  ],
  alias: {
    h: 'help',
    v: 'version',
    d: 'diff',
    R: 'recursive'
  }
})

var tmp = require('tmp')

if (argv.v) {
  console.log(pkg.version)
  process.exit()
}

if (argv.h) {
  console.log('Usage: cssfmt [options] input-name [output-name]')
  console.log('')
  console.log('Options:')
  console.log('')
  console.log('  -d, --diff        output diff against original file')
  console.log('  -R, --recursive   format files recursively')
  console.log('  -v, --version     output the version number')
  console.log('  -h, --help        output usage information')
  process.exit()
}


if (argv._[0]) {
  var input = argv._[0]
  var output = argv._[1] || argv._[0]

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
} else if (argv.R) {
  var recursive = require('recursive-readdir')

  recursive(argv.R, function (err, files) {
    files.forEach(function (file) {
      var fullPath = path.resolve(process.cwd(), file)
      if (!isCss(fullPath)) return

      var css = fs.readFileSync(fullPath, 'utf-8')
      try {
        var formatted = cssfmt.process(css)
      } catch (e) {
        throw e
        return
      }
      fs.writeFileSync(fullPath, formatted)
    })
  })
} else {
  stdin(function (css) {
    var formatted = cssfmt.process(css)
    process.stdout.write(formatted)
  })
}


function isCss (filePath) {
  return /^\.css|\.scss$/i.test(path.extname(filePath))
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
