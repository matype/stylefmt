var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn

var tape = require('tape')

tape('cli stdin', function (t) {
  t.plan(1)
  spawnStylefmt([], readFixture('at-media/at-media.css'), function (err, output) {
    if (err) {
      t.end(err)
      return
    }
    t.equal(output, readFixture('at-media/at-media.out.css'))
    t.end()
  })
})

tape('cli input file option', function (t) {
  t.plan(1)

  var tempFile = fixturesPath('at-media/at-media.copy.css')
  fs.writeFileSync(tempFile, readFixture('at-media/at-media.css'), 'utf-8')

  spawnStylefmt([tempFile], null, function (err) {
    if (err) {
      t.end(err)
      return
    }

    var output = fs.readFileSync(tempFile, 'utf-8')
    t.equal(output, readFixture('at-media/at-media.out.css'))
    fs.unlinkSync(tempFile)
    t.end()
  })
})

tape('cli output file option', function (t) {
  t.plan(1)
  var tempFile = fixturesPath('at-media/at-media.copy.css')
  spawnStylefmt([fixturesPath('at-media/at-media.css'), tempFile], null, function(err) {
    if (err) {
      t.end(err)
      return
    }

    try {
      fs.statSync(tempFile)
    } catch (err) {
      t.error(err, 'output file not found')
      t.end()
      return
    }

    var output = fs.readFileSync(tempFile, 'utf-8')
    t.equal(output, readFixture('at-media/at-media.out.css'))
    fs.unlinkSync(tempFile)
    t.end()
  })
})

function fixturesPath (filename) {
  return path.join(__dirname, 'fixtures', filename)
}

function readFixture (filename) {
  return fs.readFileSync(fixturesPath(filename), 'utf-8')
}

function spawnStylefmt (options, input, callback) {
  var args = [
    path.join(__dirname, '../bin/cli.js')
  ].concat(options)

  var child = spawn('node', args, {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  var output = ''
  child.stdout.on('data', function (data) {
    output += data.toString()
  })

  var error = ''
  child.stderr.on('data', function (data) {
    error += data.toString()
  })

  child.on('exit', function () {
    if (error) {
      callback(new Error(error))
      return
    }
    callback(null, output)
  })

  if (input) {
    child.stdin.write(input)
    child.stdin.end()
  }
}
