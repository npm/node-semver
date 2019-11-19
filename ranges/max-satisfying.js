const SemVer = require('../semver')
const { Range } = require('./index')

module.exports = function maxSatisfying (versions, range, options) {
    let max = null
    let maxSV = null
    let rangeObj = null
    try {
      rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!max || maxSV.compare(v) === -1) {
          // compare(max, v, true)
          max = v
          maxSV = new SemVer(max, options)
        }
      }
    })
    return max
  }
  