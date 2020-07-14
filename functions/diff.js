const parse = require('./parse')
const eq = require('./eq')

const diff = (version1, version2) => {
  if (eq(version1, version2)) {
    return null
  } else {
    const v1 = parse(version1)
    const v2 = parse(version2)
    const hasPre = v1.prerelease.length || v2.prerelease.length
    const prefix = hasPre ? 'pre' : ''
    const defaultResult = hasPre ? 'prerelease' : ''
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    if (v1['major'] === v2['major'] && 
        v1['minor'] === v2['minor'] && 
        v1['patch'] === v2['patch'] && !(v1.prerelease.length && v2.prerelease.length)) {
      const releaseTypes = []
      for (const key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key]) releaseTypes.push(key);
        }
      }
      return releaseTypes.pop();
    }
    return defaultResult // may be undefined
  }
}
module.exports = diff
