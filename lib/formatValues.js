function formatProperties (decl) {

  decl.value = decl.value.trim().replace(/\s+/g, ' ')
    decl.value = decl.value.replace(/,/g, ', ')

    if (decl.important) {
      decl._important = " !important"
    }

  return decl
}


module.exports = formatProperties
