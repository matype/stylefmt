var isHex = require('./util').isHex

function formatProperties (decl) {
  var isDataUrl = (/data:.+\/(.+);base64,(.*)/).test(decl.value)

  if (decl.raws.value) {
    decl.raws.value.raw = decl.raws.value.raw.trim()
  }

  decl.value = decl.value.trim().replace(/\s+/g, ' ')
  if (!isDataUrl) {
    // Remove spaces before commas and keep only one space after.
    decl.value = decl.value.trim().replace(/(\s+)?,(\s)*/g, ', ')
  }
  decl.value = decl.value.trim().replace(/[+\-*/%](?=\$|\()/g, ' $& ')

  if (isHex(decl.value)) {
    decl.value = decl.value.toLowerCase()
  }

  if (decl.important) {
    decl.raws.important = " !important"
  }

  return decl
}


module.exports = formatProperties
