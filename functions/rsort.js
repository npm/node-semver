const compareBuild = require('./compare-build')

module.exports = function rsort (list, loose) {
    return list.sort((a, b) => {
      return compareBuild(b, a, loose)
    })
  }