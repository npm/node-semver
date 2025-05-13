import Range from '../classes/range.js'
import Comparator from '../classes/comparator.js'
import satisfies from '../functions/satisfies.js'
import compare from '../functions/compare.js'
import type { Options } from '../internal/parse-options.js'
import type SemVer from 'src/classes/semver.js'

const { ANY } = Comparator
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
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub: Range | Comparator | string, dom: Range | Comparator | string, options?: Options) => {
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
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub: Comparator[], dom: Comparator[], options: Options = {}) => {
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

  const eqSet = new Set<SemVer>()
  let gt: Comparator | undefined
  let lt: Comparator | undefined
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver as SemVer)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver as SemVer, lt.semver as SemVer, options)
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
  let needDomLTPre = lt && !options.includePrerelease && (lt.semver as SemVer).prerelease.length ? lt.semver : false
  let needDomGTPre = gt && !options.includePrerelease && (gt.semver as SemVer).prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (
    needDomLTPre &&
    (needDomLTPre as SemVer).prerelease.length === 1 &&
    lt &&
    lt.operator === '<' &&
    (needDomLTPre as SemVer).prerelease[0] === 0
  ) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (!Comparator.isSemver(c.semver)) {
          continue
        }
        if (!Comparator.isSemver(needDomGTPre)) {
          continue
        }
        if (
          c.semver.prerelease &&
          c.semver.prerelease.length &&
          c.semver.major === needDomGTPre.major &&
          c.semver.minor === needDomGTPre.minor &&
          c.semver.patch === needDomGTPre.patch
        ) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver as SemVer, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (!Comparator.isSemver(c.semver)) {
          continue
        }
        if (!Comparator.isSemver(needDomLTPre)) {
          continue
        }
        if (
          c.semver.prerelease &&
          c.semver.prerelease.length &&
          c.semver.major === needDomLTPre.major &&
          c.semver.minor === needDomLTPre.minor &&
          c.semver.patch === needDomLTPre.patch
        ) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver as SemVer, String(c), options)) {
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
const higherGT = (a: Comparator | undefined, b: Comparator, options?: Options): Comparator => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver as SemVer, b.semver as SemVer, options)
  return comp > 0 ? a : comp < 0 ? b : b.operator === '>' && a.operator === '>=' ? b : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a: Comparator | undefined, b: Comparator, options?: Options): Comparator => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver as SemVer, b.semver as SemVer, options)
  return comp < 0 ? a : comp > 0 ? b : b.operator === '<' && a.operator === '<=' ? b : a
}

export default subset
