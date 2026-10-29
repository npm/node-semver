'use strict'

const SemVer = require('../classes/semver')
const Range = require('../classes/range')
const { ANY } = require('../classes/comparator')
const gt = require('../functions/gt')

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  // 0.0.0 is not necessarily the answer when it matches, since a
  // prerelease lower bound such as >=0.0.0-alpha sorts below it.
  const zero = new SemVer('0.0.0')
  const zeroMatches = range.test(zero)

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        return
      }
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    // A set whose own lower bound fails its upper bounds (e.g. `>=1.0.0 <1.0.0`) has no minimum; skipping it
    // keeps it from hiding the minimum of another set in the union.
    if (setMin && new Range(comparators.join(' '), range.options).test(setMin) &&
        (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver) && (!zeroMatches || gt(zero, minver))) {
    return minver
  }

  return zeroMatches ? zero : null
}
module.exports = minVersion
