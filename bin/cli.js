#!/usr/bin/env node

var fs = require('fs')
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
    V: 'versions'
  }
})

if (argv.V) {
  console.log(pkg.version)
}

if (argv.h) {
  console.log('Usage: cssfmt input-name [output-name]');
  console.log('');
  console.log('Options:');
  console.log('');
  console.log('  -V, --versions    output the version number');
  console.log('  -h, --help        output usage information');
}

if (argv._[0]) {
  var input  = argv._[0]
  var output  = argv._[1] || argv._[0]

  var css = fs.readFileSync(input, 'utf-8')
  fs.writeFile(output, cssfmt.process(css), function (err) {
    if (err) throw err
  })
}
