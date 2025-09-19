'use strict'

const SemVer = require('../classes/semver')
const parseOptions = require('../internal/parse-options')
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }

  const parsedOptions = parseOptions(options)
  const parsed = new SemVer(version, parsedOptions.noThrow ? parsedOptions : {
    ...parsedOptions,
    noThrow: true,
  })

  if (parsed.errorMessage) {
    if (!throwErrors) {
      return null
    }
    throw new TypeError(parsed.errorMessage)
  }

  return parsed
}

module.exports = parse
