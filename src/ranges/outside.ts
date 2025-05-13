import SemVer from '../classes/semver.js'
import Comparator from '../classes/comparator.js'
import Range from '../classes/range.js'
import satisfies from '../functions/satisfies.js'
import gt from '../functions/gt.js'
import lt from '../functions/lt.js'
import lte from '../functions/lte.js'
import gte from '../functions/gte.js'
import type { Options } from '../internal/parse-options.js'

const { ANY } = Comparator

export default (
  version: string | SemVer,
  range: Range | Comparator | string,
  hilo: '>' | '<',
  options?: Options | boolean
) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
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

  for (const comparators of range.set) {
    let high: Comparator | undefined
    let low: Comparator | undefined

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver as SemVer, high.semver as SemVer, options)) {
        high = comparator
      } else if (ltfn(comparator.semver as SemVer, low.semver as SemVer, options)) {
        low = comparator
      }
    })

    if (!high || !low) {
      continue
    }

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) && ltefn(version, low.semver as SemVer)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver as SemVer)) {
      return false
    }
  }
  return true
}
