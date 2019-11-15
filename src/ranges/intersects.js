var { Range } = require('../index');
module.exports = function intersects (r1, r2, options) {
    r1 = new Range(r1, options)
    r2 = new Range(r2, options)
    return r1.intersects(r2)
}
  