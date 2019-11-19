const compareBuild = require('./compare-build')

module.exports = function sort (list, loose) {
    return list.sort(function (a, b) {
      return compareBuild(a, b, loose)
    })
  }