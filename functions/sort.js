var compareBuild = require('./compareBuild');

module.exports = function sort (list, loose) {
    return list.sort(function (a, b) {
      return compareBuild(a, b, loose)
    })
  }