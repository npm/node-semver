'use strict'

const SemVer = require('../classes/semver')
const Comparator = require('../classes/comparator')
const { ANY } = Comparator
const Range = require('../classes/range')
const satisfies = require('../functions/satisfies')
const gt = require('../functions/gt')
const lt = require('../functions/lt')
const lte = require('../functions/lte')
const gte = require('../functions/gte')
const eq = require('../functions/eq')

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp, xcomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      xcomp = '<'
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      xcomp = '>'
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  let satisfiable = false
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    // A set can hold several bounds on the same side, e.g. `>1.0.0 >=2.0.0 <3.0.0`
    // (x-ranges and intersected ranges produce these). Only the tightest one is the
    // real edge of the set, so the edges are found by operator, not by taking
    // whichever comparators have the highest and lowest versions.
    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      const exact = !comparator.operator
      if (exact || comparator.operator === comp || comparator.operator === ecomp) {
        if (!low || gtfn(comparator.semver, low.semver, options) ||
            (eq(comparator.semver, low.semver, options) &&
             comparator.operator === comp)) {
          low = comparator
        }
      }
      if (exact || (comparator.operator !== comp && comparator.operator !== ecomp)) {
        if (!high || ltfn(comparator.semver, high.semver, options) ||
            (eq(comparator.semver, high.semver, options) &&
             comparator.operator === xcomp)) {
          high = comparator
        }
      }
    })

    // If nothing bounds the set on this side, our version can't be beyond it
    if (!high) {
      return false
    }

    // A set whose edges cross can't be satisfied by any version, so it has
    // nothing for our version to be beyond
    if (low && (gtfn(low.semver, high.semver, options) ||
        (eq(low.semver, high.semver, options) &&
         (low.operator === comp || high.operator === xcomp)))) {
      continue
    }
    satisfiable = true

    // If our version is at or below the tightest lower edge of the set, then it
    // isn't higher than the range
    if (!low) {
      continue
    }
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return satisfiable
}

module.exports = outside
