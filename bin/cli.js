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
    b: 'config-basedir',
    c: 'config',
    d: 'diff',
    h: 'help',
    i: 'ignore-path',
    r: 'recursive',
    v: 'version',
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
  console.log('  -b, --config-basedir   Path to the directory that relative paths defining "extends"')
  console.log('  -c, --config           Path to a specific configuration file (JSON, YAML, or CommonJS)')
  console.log('  -d, --diff             Output diff against original file')
  console.log('  -r, --recursive        Format list of space seperated files(globs) in place')
  console.log('  -v, --version          Output the version number')
  console.log('  -h, --help             Output usage information')
  console.log('  -i, --ignore-path      Path to a file containing patterns that describe files to ignore.')
  console.log('  --stdin-filename       A filename to assign stdin input.')
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

if (argv.i) {
  options.ignorePath = argv.i
}

if (argv.r) {
  var globby = require('globby')
  globby([path.join(argv.r)].concat(argv._)).then(processMultipleFiles)
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
    options.codeFilename = argv['stdin-filename']
    postcss([stylefmt(options)])
      .process(css, {
        from: options.codeFilename,
        syntax: scss
      })
      .then(function (result) {
        process.stdout.write(result.css)
      })
  })
}


function processMultipleFiles (files) {
  files = files.filter(isCss).sort()
  if(!files.length){
    console.error("Files glob patterns specified did not match any css files.")
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
          return file
        }
      })
  })).then(function (messages) {
    if (argv.d) {
      console.log(messages.join('\n\n'))
    } else {
      messages = messages.filter(function (file){
        return file
      })
      if(messages.length){
        messages = messages.join(', ') + '\n\n' + messages.length
      } else {
        messages = 'No'
      }
      console.log(messages + ' files are formatted.')
    }
  })
}


function isCss (filePath) {
  return /^\.css|\.less|\.pcss|\.scss|\.wxss$/i.test(path.extname(filePath))
}


function handleDiff (file, original, formatted) {
  var diff
  var chalk = require('chalk')

  if (original === formatted) {
    diff = 'There is no difference with the original file.'
  }

  if (chalk.supportsColor) {
    file = chalk.blue(file)
    if(diff) {
      diff = chalk.gray(diff)
    } else {
      var JsDiff = require('diff')
      diff = JsDiff.createPatch(file, original, formatted)
      diff = diff.split('\n').splice(4).map(function (line) {
        if (line[0] === '+') {
          line = chalk.green(line)
        } else if (line[0] === '-') {
          line = chalk.red(line)
        } else if (line.match(/^@@\s+.+?\s+@@/) || '\\ No newline at end of file' === line) {
          line = ''
        }
        return chalk.gray(line)
      })
      diff = diff.join('\n').trim()
    }
  } else if (!diff) {
    diff = formatted
  }
  return file + '\n' + diff
}
