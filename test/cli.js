var spawn = require('child_process').spawn
var path = require('path')
var fs = require('fs')
var tape = require('tape')

// tape('cli stdin', function (t) {
//   spawnCssfmt([], readFixture('at-media.css'), function (err, output) {
//     if (err) {
//       throw err
//     }

//     var expected = readFixture('at-media.out.css')
//     t.equal(output, expected)
//     t.end()
//   })
// })

// tape('cli input file option', function (t) {
//   var tempFile = fixturesPath('at-media.copy.css')
//   fs.writeFileSync(tempFile, readFixture('at-media.css'), 'utf-8')

//   spawnCssfmt([tempFile], null, function (err) {
//     if (err) {
//       throw err
//     }

//     var output = fs.readFileSync(tempFile, 'utf-8')
//     fs.unlinkSync(tempFile)

//     var expected = readFixture('at-media.out.css')
//     t.equal(output, expected)

//     t.end()
//   })
// })

// tape('cli output file option', function (t) {
//   var tempFile = fixturesPath('at-media.copy.css')

//   spawnCssfmt([fixturesPath('at-media.css'), tempFile], null, function(err) {
//     if (err) {
//       throw err
//     }

//     t.ok(fs.existsSync(tempFile), 'output file created')

//     var output = fs.readFileSync(tempFile, 'utf-8')
//     fs.unlinkSync(tempFile)

//     var expected = readFixture('at-media.out.css')
//     t.equal(output, expected)

//     t.end()
//   })
// })


function fixturesPath (filename) {
  return path.join(__dirname, 'fixtures', filename)
}

function readFixture (filename) {
  return fs.readFileSync(fixturesPath(filename), 'utf-8')
}

function spawnCssfmt (options, input, callback) {
  var args = [path.join(__dirname, '../bin/cli.js')]
  args = args.concat(options)

  var childprocess = spawn('node', args, {
    stdio: ['pipe', 'pipe', 'pipe']
  })
  var output = ''
  var error = ''

  childprocess.stdout.on('data', function (data) {
    output += data.toString()
  })

  childprocess.stderr.on('data', function (data) {
    error += data.toString()
  })

  childprocess.on('exit', function() {
    if (error) {
      callback(new Error(error))
      return
    }

    callback(null, output)
  })

  if (input) {
    childprocess.stdin.write(input)
    childprocess.stdin.end()
  }
}
