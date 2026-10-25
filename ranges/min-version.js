'use strict'

const SemVer = require('../classes/semver')
const Range = require('../classes/range')
const gt = require('../functions/gt')

const getPrereleaseTuples = (comparators) => {
  const tuples = new Set()
  for (const { semver } of comparators) {
    if (semver.prerelease.length > 0) {
      tuples.add(`${semver.major}.${semver.minor}.${semver.patch}`)
    }
  }
  return tuples
}

const advanceStrictBound = (version, prereleaseTuples) => {
  if (version.prerelease.length === 0) {
    version.patch++
    const tuple = `${version.major}.${version.minor}.${version.patch}`
    if (prereleaseTuples.has(tuple)) {
      version.prerelease = [0]
    }
  } else {
    version.prerelease.push(0)
  }
  version.raw = version.format()
}

const hasInvalidAdjustedMinimum = (comparators, setMin) => {
  if (setMin.prerelease.length === 0) {
    return false
  }
  const adjusted = comparators.some(({ operator, semver }) =>
    operator === '>' &&
    semver.prerelease.length === 0 &&
    semver.major === setMin.major &&
    semver.minor === setMin.minor &&
    semver.patch + 1 === setMin.patch)
  return adjusted && !comparators.every(comparator => comparator.test(setMin))
}

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]
    const prereleaseTuples = getPrereleaseTuples(comparators)

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          advanceStrictBound(compver, prereleaseTuples)
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
    if (setMin && !hasInvalidAdjustedMinimum(comparators, setMin) &&
        (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion
