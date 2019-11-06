const { Range } = require('../classes/range')

// Mostly just for testing and legacy API reasons
module.exports = function toComparators (range, options) {
  return new Range(range, options).set.map((comp) => {
    return comp.map((c) => {
      return c.value
    }).join(' ').trim().split(' ')
  })
}