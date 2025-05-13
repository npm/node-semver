// just pre-load all the stuff that index.js lazily exports
import { default as SemVer } from './classes/semver.js'
import { default as parse } from './functions/parse.js'
import { default as valid } from './functions/valid.js'
import { default as clean } from './functions/clean.js'
import { default as inc } from './functions/inc.js'
import { default as diff } from './functions/diff.js'
import { default as major } from './functions/major.js'
import { default as minor } from './functions/minor.js'
import { default as patch } from './functions/patch.js'
import { default as prerelease } from './functions/prerelease.js'
import { default as compare } from './functions/compare.js'
import { default as rcompare } from './functions/rcompare.js'
import { default as compareLoose } from './functions/compare-loose.js'
import { default as compareBuild } from './functions/compare-build.js'
import { default as sort } from './functions/sort.js'
import { default as rsort } from './functions/rsort.js'
import { default as gt } from './functions/gt.js'
import { default as lt } from './functions/lt.js'
import { default as eq } from './functions/eq.js'
import { default as neq } from './functions/neq.js'
import { default as gte } from './functions/gte.js'
import { default as lte } from './functions/lte.js'
import { default as cmp } from './functions/cmp.js'
import { default as coerce } from './functions/coerce.js'
import { default as Comparator } from './classes/comparator.js'
import { default as Range } from './classes/range.js'
import { default as satisfies } from './functions/satisfies.js'
import { default as toComparators } from './ranges/to-comparators.js'
import { default as maxSatisfying } from './ranges/max-satisfying.js'
import { default as minSatisfying } from './ranges/min-satisfying.js'
import { default as minVersion } from './ranges/min-version.js'
import { default as validRange } from './ranges/valid.js'
import { default as outside } from './ranges/outside.js'
import { default as gtr } from './ranges/gtr.js'
import { default as ltr } from './ranges/ltr.js'
import { default as intersects } from './ranges/intersects.js'
import { default as simplifyRange } from './ranges/simplify.js'
import { default as subset } from './ranges/subset.js'
import { re, src, t as tokens } from './internal/re.js'
import { SEMVER_SPEC_VERSION, RELEASE_TYPES } from './internal/constants.js'
import { compareIdentifiers, rcompareIdentifiers } from './internal/identifiers.js'

export default {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re,
  src,
  tokens,
  SEMVER_SPEC_VERSION,
  RELEASE_TYPES,
  compareIdentifiers,
  rcompareIdentifiers,
}
