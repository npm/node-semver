'use strict'

// just pre-load all the stuff that index.js lazily exports
const { re, src, t: tokens } = require('./internal/re.js')
const {
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
} = require('./internal/constants.js')
const SemVer = require('./classes/semver.js')
const {
  compareIdentifiers,
  rcompareIdentifiers,
} = require('./internal/identifiers.js')
const parse = require('./functions/parse.js')
const valid = require('./functions/valid.js')
const clean = require('./functions/clean.js')
const inc = require('./functions/inc.js')
const diff = require('./functions/diff.js')
const major = require('./functions/major.js')
const minor = require('./functions/minor.js')
const patch = require('./functions/patch.js')
const prerelease = require('./functions/prerelease.js')
const compare = require('./functions/compare.js')
const rcompare = require('./functions/rcompare.js')
const compareLoose = require('./functions/compare-loose.js')
const compareBuild = require('./functions/compare-build.js')
const sort = require('./functions/sort.js')
const rsort = require('./functions/rsort.js')
const gt = require('./functions/gt.js')
const lt = require('./functions/lt.js')
const eq = require('./functions/eq.js')
const neq = require('./functions/neq.js')
const gte = require('./functions/gte.js')
const lte = require('./functions/lte.js')
const cmp = require('./functions/cmp.js')
const coerce = require('./functions/coerce.js')
const Comparator = require('./classes/comparator.js')
const Range = require('./classes/range.js')
const satisfies = require('./functions/satisfies.js')
const toComparators = require('./ranges/to-comparators.js')
const maxSatisfying = require('./ranges/max-satisfying.js')
const minSatisfying = require('./ranges/min-satisfying.js')
const minVersion = require('./ranges/min-version.js')
const validRange = require('./ranges/valid.js')
const outside = require('./ranges/outside.js')
const gtr = require('./ranges/gtr.js')
const ltr = require('./ranges/ltr.js')
const intersects = require('./ranges/intersects.js')
const simplifyRange = require('./ranges/simplify.js')
const subset = require('./ranges/subset.js')
module.exports = {
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
