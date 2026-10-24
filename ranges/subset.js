'use strict'

const Range = require('../classes/range.js')
const Comparator = require('../classes/comparator.js')
const { ANY } = Comparator
const satisfies = require('../functions/satisfies.js')
const compare = require('../functions/compare.js')

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If LT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      // When the dom has multiple OR-branches, check if their union covers
      // the sub range even though no single branch does.
      if (dom.set.length > 1 && unionCovers(simpleSub, dom.set, options)) {
        continue OUTER
      }
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = minimumVersion
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !c.test(gt.semver)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !c.test(lt.semver)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

// Extract the [gt, lt] bounds from a simple comparator set.
// Returns { gt, lt } where gt/lt are comparators or null.
// Returns null if the set is a null set (inconsistent bounds or multi-eq).
const extractBounds = (set, options) => {
  if (set.length === 1 && set[0].semver === ANY) {
    if (options.includePrerelease) {
      return { gt: null, lt: null }
    }
    set = minimumVersion
  }

  const eqSet = new Set()
  let gt = null
  let lt = null
  for (const c of set) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (gt && lt) {
    const cmp = compare(gt.semver, lt.semver, options)
    if (cmp > 0) {
      return null
    }
    if (cmp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // eq-pinned sets without gt/lt bounds are skipped (treated as null) since
  // they're point intervals handled separately for sub ranges.
  // eq sets with inconsistent gt/lt are also null sets.
  if (eqSet.size > 0) {
    return null
  }

  return { gt, lt }
}

// Check if two intervals are adjacent: the upper bound of interval a touches
// the lower bound of interval b with no gap (in terms of release versions).
// In non-prerelease mode, <X.Y.Z-0 and >=X.Y.Z are adjacent because
// no release version exists between them.
const boundsAdjacent = (aLt, bGt, options) => {
  if (!bGt) {
    return true // dom has no lower bound → always overlaps
  }

  const cmp = compare(aLt.semver, bGt.semver, options)

  if (cmp > 0) {
    return true // overlap
  }
  if (cmp < 0) {
    return false // gap
  }

  // Same version: only < and > leaves a gap (exactly one version)
  if (aLt.operator === '<' && bGt.operator === '>') {
    return false
  }
  return true
}

// In non-prerelease mode, <X.Y.Z-0 and >=X.Y.Z are adjacent
// because no release version can exist between them.
const isAdjacentPrerelease = (aLt, bGt, options) => {
  if (options.includePrerelease) {
    return false
  }
  // aLt is <V-0 and bGt is >=V (same major.minor.patch)
  if (aLt.operator === '<' &&
      aLt.semver.prerelease.length === 1 &&
      aLt.semver.prerelease[0] === 0 &&
      bGt.operator === '>=' &&
      bGt.semver.prerelease.length === 0 &&
      aLt.semver.major === bGt.semver.major &&
      aLt.semver.minor === bGt.semver.minor &&
      aLt.semver.patch === bGt.semver.patch) {
    return true
  }
  return false
}

// Check whether the sub comparator set's lower bound is covered by a dom
// interval's lower bound (i.e., domGt <= subGt).
const gtCovers = (subGt, domGt, options) => {
  if (!domGt) {
    return true // dom unbounded below
  }
  if (!subGt) {
    return false // sub unbounded below, dom is not
  }
  const cmp = compare(subGt.semver, domGt.semver, options)
  if (cmp > 0) {
    return true
  }
  if (cmp < 0) {
    return false
  }
  // Same version: >= is wider than >
  if (domGt.operator === '>=' || subGt.operator === '>') {
    return true
  }
  return subGt.operator === domGt.operator
}

// Check whether the sub comparator set's upper bound is covered by a dom
// interval's upper bound (i.e., domLt >= subLt).
// Note: in the sweep, domLt (coverage) is never null since we return early
// when dom.lt is null.
const ltCovers = (subLt, domLt, options) => {
  if (!subLt) {
    return false // sub unbounded above, dom is not
  }
  const cmp = compare(subLt.semver, domLt.semver, options)
  if (cmp < 0) {
    return true
  }
  if (cmp > 0) {
    // In non-prerelease mode, <X.Y.Z and <X.Y.Z-0 are equivalent
    if (!options.includePrerelease &&
        subLt.operator === '<' && domLt.operator === '<' &&
        subLt.semver.prerelease.length === 0 &&
        domLt.semver.prerelease.length === 1 &&
        domLt.semver.prerelease[0] === 0 &&
        subLt.semver.major === domLt.semver.major &&
        subLt.semver.minor === domLt.semver.minor &&
        subLt.semver.patch === domLt.semver.patch) {
      return true
    }
    return false
  }
  // Same version: <= is wider than <
  if (domLt.operator === '<=' || subLt.operator === '<') {
    return true
  }
  return subLt.operator === domLt.operator
}

// Check if the union of dom comparator sets covers a single sub comparator set
// using an interval-sweep algorithm.
const unionCovers = (simpleSub, domSets, options) => {
  // Check for eq-pinned sub (e.g., "2.0.0" as a simple range).
  // If the eq version doesn't satisfy any single dom set (checked by
  // simpleSubset), it won't satisfy the union either.
  const subEqs = simpleSub.filter(c => c.operator === '' && c.semver !== ANY)
  if (subEqs.length > 0) {
    return false
  }

  const subBounds = extractBounds(simpleSub, options)

  // Check prerelease admission: if sub has prerelease bounds and we're not in
  // includePrerelease mode, verify that dom has matching prerelease tuples
  if (!options.includePrerelease) {
    if (subBounds.gt && subBounds.gt.semver &&
        subBounds.gt.semver !== ANY &&
        subBounds.gt.semver.prerelease && subBounds.gt.semver.prerelease.length) {
      return false
    }
    if (subBounds.lt && subBounds.lt.semver &&
        subBounds.lt.semver !== ANY &&
        subBounds.lt.semver.prerelease && subBounds.lt.semver.prerelease.length) {
      // exception: <X.Y.Z-0 is equivalent to <X.Y.Z for releases
      if (!(subBounds.lt.semver.prerelease.length === 1 &&
            subBounds.lt.semver.prerelease[0] === 0 &&
            subBounds.lt.operator === '<')) {
        return false
      }
    }
  }

  // Extract and filter dom intervals (skip null sets)
  const domIntervals = []
  for (const domSet of domSets) {
    const bounds = extractBounds(domSet, options)
    if (bounds) {
      domIntervals.push(bounds)
    }
  }

  if (domIntervals.length === 0) {
    return false
  }

  // Sort dom intervals by lower bound
  domIntervals.sort((a, b) => {
    const aVer = a.gt ? a.gt.semver : null
    const bVer = b.gt ? b.gt.semver : null
    if (!aVer && !bVer) {
      return 0
    }
    if (!aVer) {
      return -1
    }
    if (!bVer) {
      return 1
    }
    const cmp = compare(aVer, bVer, options)
    // If same version, >= sorts before >
    if (cmp !== 0) {
      return cmp
    }
    if (a.gt.operator === '>=' && b.gt.operator === '>') {
      return -1
    }
    /* istanbul ignore next */
    if (a.gt.operator === '>' && b.gt.operator === '>=') {
      return 1
    }
    /* istanbul ignore next */
    return 0
  })

  // Sweep: start at sub's lower bound, greedily extend coverage
  let coverage = subBounds.gt // current coverage ends here (as a gt bound)
  let coverageIsStart = true

  for (const dom of domIntervals) {
    // Check if this dom interval's lower bound is within current coverage
    if (coverageIsStart) {
      // First interval must cover sub's lower bound
      if (!gtCovers(subBounds.gt, dom.gt, options)) {
        continue
      }
    } else {
      // Subsequent intervals must be adjacent to or overlap with coverage
      const adjacent = boundsAdjacent(coverage, dom.gt, options) ||
        isAdjacentPrerelease(coverage, dom.gt, options)
      if (!adjacent) {
        // Check if there's a gap
        continue
      }
    }

    // Extend coverage to this dom interval's upper bound
    if (!dom.lt) {
      // Dom extends to +∞, we're done
      return true
    }

    if (coverageIsStart) {
      coverage = dom.lt
      coverageIsStart = false
    } else {
      // Take the higher upper bound, <= is wider than <
      const cmp = compare(dom.lt.semver, coverage.semver, options)
      /* istanbul ignore next */
      if (cmp > 0 ||
        (cmp === 0 && dom.lt.operator === '<=' && coverage.operator === '<')) {
        coverage = dom.lt
      }
    }

    // Check if coverage already covers sub's upper bound
    if (ltCovers(subBounds.lt, coverage, options)) {
      return true
    }
  }

  // Check final coverage is handled in the sweep's mid-check
  return false
}

module.exports = subset
