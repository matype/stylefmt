#!/usr/bin/env node

var fs = require('fs')
var pkg = require('../package.json')
var cssfmt = require('..')

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
    console.log('Usage: atcss input-name output-name [options]');
    console.log('');
    console.log('Options:');
    console.log('');
    console.log('  -V, --versions    output the version number');
    console.log('  -h, --help        output usage information');
}
