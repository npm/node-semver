'use strict'

const SemVer = require('../classes/semver')
const Range = require('../classes/range')
const Comparator = require('../classes/comparator')
const gt = require('../functions/gt')
const lt = require('../functions/lt')

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  // 0.0.0 may match, but a 0.0.0 prerelease lower bound can still be lower
  const zero = new SemVer('0.0.0')
  const zeroMatches = range.test(zero)

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      if (comparator.semver === Comparator.ANY) {
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
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver) && (!zeroMatches || lt(minver, zero))) {
    return minver
  }

  return zeroMatches ? zero : null
}
module.exports = minVersion
