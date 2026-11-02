'use strict'

const SemVer = require('../classes/semver')
const Range = require('../classes/range')
const { ANY } = require('../classes/comparator')
const { MAX_LENGTH } = require('../internal/constants')
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
          } else if (compver.format().length + 2 <= MAX_LENGTH) {
            compver.prerelease.push(0)
          } else {
            // The next prerelease can't be written within the length limit; the
            // release itself is the lowest version above it that can be.
            compver.prerelease = []
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
    if (!setMin) {
      continue
    }
    // Check the candidate against its own set, so a set with no valid version
    // (e.g. `>=1.0.0 <1.0.0`) can't hide another set's minimum. Below a release
    // candidate, the lowest prerelease of that version may satisfy the set
    // (e.g. `>1.0.0 <1.0.1-alpha` allows 1.0.1-0), so try it first.
    const set = new Range(comparators.join(' '), range.options)
    const candidates = [setMin]
    if (setMin.prerelease.length === 0) {
      candidates.unshift(new SemVer(`${setMin.format()}-0`))
    }
    const lowest = candidates.find((c) => set.test(c))
    if (lowest && (!minver || gt(minver, lowest))) {
      minver = lowest
    }
  }

  if (minver && range.test(minver) && (!zeroMatches || gt(zero, minver))) {
    return minver
  }

  return zeroMatches ? zero : null
}
module.exports = minVersion
