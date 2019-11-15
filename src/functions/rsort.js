var compareBuild = require('./compareBuild');

module.exports = function rsort (list, loose) {
    return list.sort(function (a, b) {
      return compareBuild(b, a, loose)
    })
  }