'use strict'

const Range = require('../classes/range.js')
const Comparator = require('../classes/comparator.js')
const SemVer = require('../classes/semver.js')
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
      // No single dom range covers this sub range, but the union of
      // multiple dom ranges might. Only attempt this when there are
      // multiple OR branches in the dom.
      if (dom.set.length > 1 && unionSubset(simpleSub, dom, options)) {
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
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
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
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
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

// Check whether the union of all OR branches in dom covers a single
// comparator set (simpleSub).  We extract the effective lower/upper
// bounds of simpleSub and every dom comparator set, merge the dom
// intervals, and verify that the merged result fully contains simpleSub.
const unionSubset = (simpleSub, dom, options) => {
  const sub = extractBounds(simpleSub, options)
  if (!sub) {
    // null set or eq-set – union check not applicable
    return false
  }

  const domIntervals = []
  for (const simpleDom of dom.set) {
    const b = extractBounds(simpleDom, options)
    if (b) {
      domIntervals.push(b)
    }
  }

  if (domIntervals.length === 0) {
    return false
  }

  // Sort dom intervals by lower bound (ascending).
  domIntervals.sort((a, b) => {
    if (!a.gt && !b.gt) {
      return 0
    }
    if (!a.gt) {
      return -1
    }
    if (!b.gt) {
      return 1
    }
    const cmp = compare(a.gt.semver, b.gt.semver, options)
    if (cmp !== 0) {
      return cmp
    }
    // >=V sorts before >V (tighter bound comes second)
    return (a.gt.operator === '>=' ? -1 : 0) - (b.gt.operator === '>=' ? -1 : 0)
  })

  // Sweep: track the highest upper-bound reached so far.
  // Start by checking the sub lower bound is covered by the first
  // dom interval, then extend coverage through overlapping/adjacent intervals.
  let coveredUpper = null // { semver, operator } or null (= +infinity already)
  let coveredInfinity = false

  for (const d of domIntervals) {
    // Check that d overlaps or is adjacent to the current coverage.
    // On the first iteration, check that d covers the sub lower bound.
    if (!coveredUpper) {
      // First interval – must cover sub's lower bound.
      if (!domCoversSubLower(d, sub, options)) {
        // If d starts above the sub lower bound, it can't help.
        // But later intervals start even higher, so give up.
        return false
      }
    } else {
      // Subsequent interval – must overlap or be adjacent to coverage so far.
      if (!boundsOverlapOrAdjacent(coveredUpper, d.gt, options)) {
        // Gap between current coverage and this interval.
        // Since intervals are sorted, no later interval can fill the gap.
        break
      }
    }

    // Extend coverage to the maximum of current coverage and d's upper bound.
    if (!d.lt) {
      coveredInfinity = true
      break
    } else if (!coveredUpper) {
      coveredUpper = d.lt
    } else {
      coveredUpper = higherUpperBound(coveredUpper, d.lt, options)
    }
  }

  // Check that coverage reaches the sub upper bound.
  if (!sub.lt) {
    // sub extends to +infinity – coverage must also be +infinity
    return coveredInfinity
  }

  if (coveredInfinity) {
    return true
  }

  // coveredUpper must be >= sub.lt
  return !!coveredUpper && upperBoundCovers(coveredUpper, sub.lt, options)
}

// Extract the effective GT (lower) and LT (upper) bounds from a
// comparator set.  Returns null for null sets and eq-sets.
const extractBounds = (comps, options) => {
  let sub = comps
  if (sub.length === 1 && sub[0].semver === ANY) {
    if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      // eq comparator – skip union check for eq-sets
      return null
    }
  }

  // Null set (impossible range)
  if (gt && lt) {
    const comp = compare(gt.semver, lt.semver, options)
    if (comp > 0) {
      return null
    }
    if (comp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  return { gt: gt || null, lt: lt || null }
}

// Check whether domInterval covers the sub's lower bound.
const domCoversSubLower = (dom, sub, options) => {
  if (!sub.gt) {
    // sub starts at -infinity; dom must also start at -infinity
    return !dom.gt
  }
  if (!dom.gt) {
    // dom starts at -infinity, which covers any sub lower bound
    return true
  }
  // dom.gt must be <= sub.gt
  const cmp = compare(dom.gt.semver, sub.gt.semver, options)
  if (cmp < 0) {
    return true
  }
  if (cmp > 0) {
    return false
  }
  // Same version: >=V covers >=V and >V; >V only covers >V
  if (dom.gt.operator === '>=') {
    return true
  }
  return sub.gt.operator === '>'
}

// Check whether an upper bound (prevUpper) and a lower bound (nextLower)
// overlap or are adjacent (no gap in the non-prerelease version space).
const boundsOverlapOrAdjacent = (prevUpper, nextLower, options) => {
  if (!prevUpper || !nextLower) {
    // One side is unbounded – always overlaps
    return true
  }

  const prevVer = prevUpper.semver
  const nextVer = nextLower.semver

  // Normalize: if prevUpper is <V-prerelease in non-prerelease mode,
  // treat it as <V (base version) for adjacency purposes, because no
  // non-prerelease version exists between them.
  let prevBase = prevVer
  if (!options.includePrerelease &&
      prevUpper.operator === '<' &&
      prevVer.prerelease.length > 0) {
    prevBase = new SemVer(`${prevVer.major}.${prevVer.minor}.${prevVer.patch}`, options)
  }

  const cmp = compare(nextVer, prevBase, options)

  if (cmp < 0) {
    // nextLower starts below prevUpper – overlap
    return true
  }
  if (cmp === 0) {
    // Same version – overlap if at least one bound is inclusive at this point.
    // <V (excl) and >=V (incl): they meet at V, which is covered by >=V
    // <=V (incl) and >V (excl): V is covered by <=V
    // <=V and >=V: V is covered by both
    // <V and >V: gap at V (but if we normalized <V-pre to <V, then
    //   <V(excl) and >=V(incl) is fine)
    if (prevUpper.operator === '<=' || nextLower.operator === '>=') {
      return true
    }
    // <V and >V: gap at exactly V.
    // But if prevBase was normalized from <V-pre, the original bound was
    // <V-pre which is strictly below V, so <V(excl) and >V(excl) = gap.
    // Actually, if we normalized <V-0 to <V and nextLower is >V,
    // there IS a gap at V. But if nextLower is >=V, that's covered above.
    return false
  }

  // nextLower starts above prevUpper – gap
  return false
}

// Compare two upper bounds; return the one that extends further.
const higherUpperBound = (a, b, options) => {
  const cmp = compare(a.semver, b.semver, options)
  if (cmp > 0) {
    return a
  }
  if (cmp < 0) {
    return b
  }
  // Same version: <= extends further than <
  if (a.operator === '<=') {
    return a
  }
  return b.operator === '<=' ? b : a
}

// Check whether coveredUpper >= subUpper (coverage extends at least as far).
const upperBoundCovers = (covered, subLt, options) => {
  // Normalize prerelease upper bounds in non-prerelease mode.
  // <V-prerelease covers the same non-prerelease versions as <V.
  const coveredVer = normalizeUpperBound(covered, options)
  const subVer = normalizeUpperBound(subLt, options)

  const cmp = compare(coveredVer, subVer, options)
  if (cmp > 0) {
    return true
  }
  if (cmp < 0) {
    return false
  }
  // Same base version
  // covered <= and sub <:  <= covers <  (yes)
  // covered <= and sub <=: <= covers <= (yes)
  // covered <  and sub <:  <  covers <  (yes)
  // covered <  and sub <=: <  doesn't cover <= (no)
  if (subLt.operator === '<=' && covered.operator === '<') {
    return false
  }
  return true
}

// Normalize an upper bound for comparison in non-prerelease mode.
// <V-prerelease is effectively <V for non-prerelease versions.
const normalizeUpperBound = (bound, options) => {
  if (!options.includePrerelease &&
      bound.operator === '<' &&
      bound.semver.prerelease.length > 0) {
    return new SemVer(
      `${bound.semver.major}.${bound.semver.minor}.${bound.semver.patch}`,
      options
    )
  }
  return bound.semver
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

module.exports = subset
