const compareBuild = require('./compare-build')

module.exports = function sort (list, loose) {
    return list.sort((a, b) => {
      return compareBuild(a, b, loose)
    })
  }