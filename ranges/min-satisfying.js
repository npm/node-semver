var SemVer = require('../semver');
var { Range } = require('./index');

module.exports = function minSatisfying (versions, range, options) {
    var min = null
    var minSV = null
    try {
      var rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!min || minSV.compare(v) === 1) {
          // compare(min, v, true)
          min = v
          minSV = new SemVer(min, options)
        }
      }
    })
    return min
  }