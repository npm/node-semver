const SemVer = require('../classes/semver')

const inc = (version, release, loose, identifier) => {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}
module.exports = inc
