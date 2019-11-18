var SemVer = require('../SemVer');
var { Range } = require('./index');

module.exports = function maxSatisfying (versions, range, options) {
    var max = null
    var maxSV = null
    try {
      var rangeObj = new Range(range, options)
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
  