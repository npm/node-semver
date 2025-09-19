'use strict'

const SemVer = require('../classes/semver')
const parseOptions = require('../internal/parse-options')
const parse = require('./parse')

const inc = (version, release, options, identifier, identifierBase) => {
  if (typeof (options) === 'string') {
    identifierBase = identifier
    identifier = options
    options = undefined
  }

  const parsedOptions = parseOptions(options)
  const parsed = parse(
    version instanceof SemVer ? version.version : version,
    parsedOptions.noThrow ? parsedOptions : {
      ...parsedOptions,
      noThrow: true,
    }
  )

  if (parsed === null) {
    return null
  }

  try {
    return parsed.inc(release, identifier, identifierBase).version
  } catch (er) {
    return null
  }
}
module.exports = inc
