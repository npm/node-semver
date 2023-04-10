const parse = require('./parse')
const eq = require('./eq')

const diff = (version1, version2) => {
  const v1 = parse(version1)
  const v2 = parse(version2)
  if (eq(v1, v2)) {
    return null
  } else {
    const hasPre = v1.prerelease.length || v2.prerelease.length
    const prefix = hasPre ? 'pre' : ''
    const defaultResult = hasPre ? 'prerelease' : ''

    if (v1.major !== v2.major) {
      return prefix + 'major'
    }
    if (v1.minor !== v2.minor) {
      return prefix + 'minor'
    }

    if (v1.patch !== v2.patch) {
      return prefix + 'patch'
    }

    if (!v1.prerelease.length || !v2.prerelease.length) {
      if (v1.patch) {
        return 'patch'
      }
      if (v1.minor) {
        return 'minor'
      }
      if (v1.major) {
        return 'major'
      }
    }
    return defaultResult // may be undefined
  }
}
module.exports = diff
