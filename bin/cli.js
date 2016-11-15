#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var stdin = require('stdin')
var pkg = require('../package.json')
var stylefmt = require('../')

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
    l: 'list',
    R: 'recursive',
    b: 'config-basedir',
    c: 'config'
  }
})

var postcss = require('postcss')
var scss = require('postcss-scss')

if (argv.v) {
  console.log(pkg.version)
  process.exit()
}

if (argv.h) {
  console.log('Usage: stylefmt [options] input-name [output-name]')
  console.log('')
  console.log('Options:')
  console.log('')
  console.log('  -d, --diff             output diff against original file')
  console.log('  -l, --list             Format list of space seperated files(globs) in place')
  console.log('  -c, --config           path to a specific configuration file (JSON, YAML, or CommonJS)')
  console.log('  -b, --config-basedir   path to the directory that relative paths defining "extends"')
  console.log('  -v, --version          output the version number')
  console.log('  -h, --help             output usage information')
  process.exit()
}


var options = {}
if (argv.c) {
  options.configFile = argv.c
}

if (argv.b) {
  options.configBasedir = (path.isAbsolute(argv.b))
    ? argv.b
    : path.resolve(process.cwd(), argv.b)
}

if (argv.l) {
  var globby = require('globby')
  globby([argv.l].concat(argv._)).then(processMultipleFiles)
} else if (argv._[0]) {
  var input = argv._[0]
  var fullPath = path.resolve(process.cwd(), input)
  var output = argv._[1] || argv._[0]

  var css = fs.readFileSync(fullPath, 'utf-8')

  postcss([stylefmt(options)])
    .process(css, {
      from: fullPath,
      syntax: scss
    })
    .then(function (result) {
      var formatted = result.css
      if (argv.d) {
        console.log(handleDiff(input, css, formatted))
      } else {
        if (css !== formatted) {
          fs.writeFile(output, formatted, function (err) {
            if (err) {
              throw err
            }
          })
        }
      }
    })
} else {
  stdin(function (css) {
    postcss([stylefmt(options)])
      .process(css, { syntax: scss })
      .then(function (result) {
        process.stdout.write(result.css)
      })
  })
}


function processMultipleFiles (files) {
  files = files.filter(isCss).sort()
  if(!files.length){
    console.error("Files glob patterns specified did not match any css files")
    return
  }

  Promise.all(files.map(function (file) {
    var fullPath = path.resolve(process.cwd(), file)

    var css = fs.readFileSync(fullPath, 'utf-8')

    return postcss([stylefmt(options)])
      .process(css, {
        from: fullPath,
        syntax: scss
      })
      .then(function (result) {
        var formatted = result.css
        if (argv.d) {
          return handleDiff(file, css, formatted)
        } else if (css !== formatted) {
          fs.writeFile(fullPath, formatted, function (err) {
            if (err) {
              throw err
            }
          })
        }
      })
  })).then(function (messages) {
    console.log(messages.join('\n'))
  })
}


function isCss (filePath) {
  return /^\.css|\.scss$/i.test(path.extname(filePath))
}


function handleDiff (file, original, formatted) {
  var chalk = require('chalk')
  if (chalk.supportsColor) {
    var JsDiff = require('diff')
    var diff = JsDiff.diffChars(original, formatted).map(function (part) {
      var value = part.value
      if (part.added) {
        value = chalk.bgGreen(part.value)
      } else if(part.removed) {
        value = chalk.bgRed(part.value)
      } else {
        return value
      }
      return value
    }).join('')
    return file + chalk.black.bgWhite('\n' + diff)
  } else {
    return file + '\n' + formatted
  }
}
