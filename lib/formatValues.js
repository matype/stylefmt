function formatProperties (decl) {

  if (decl.raws.value) {
    decl.raws.value.raw = decl.raws.value.raw.trim()
  }

  decl.value = decl.value.trim().replace(/\s+/g, ' ')
  // Remove spaces before commas and keep only one space after.
  decl.value = decl.value.trim().replace(/(\s+)?,(\s)*/g, ', ')

  if (decl.important) {
    decl.raws.important = " !important"
  }

  return decl
}


module.exports = formatProperties
