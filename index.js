// just pre-load all the stuff that index.js lazily exports
import { re, src, t } from './internal/re.js'
import { SEMVER_SPEC_VERSION, RELEASE_TYPES } from './internal/constants.js'
import SemVer from './classes/semver.js'
import { compareIdentifiers, rcompareIdentifiers } from './internal/identifiers.js'
import parse from './functions/parse.js'
import valid from './functions/valid.js'
import clean from './functions/clean.js'
import inc from './functions/inc.js'
import diff from './functions/diff.js'
import major from './functions/major.js'
import minor from './functions/minor.js'
import patch from './functions/patch.js'
import prerelease from './functions/prerelease.js'
import compare from './functions/compare.js'
import rcompare from './functions/rcompare.js'
import compareLoose from './functions/compare-loose.js'
import compareBuild from './functions/compare-build.js'
import sort from './functions/sort.js'
import rsort from './functions/rsort.js'
import gt from './functions/gt.js'
import lt from './functions/lt.js'
import eq from './functions/eq.js'
import neq from './functions/neq.js'
import gte from './functions/gte.js'
import lte from './functions/lte.js'
import cmp from './functions/cmp.js'
import coerce from './functions/coerce.js'
import Comparator from './classes/comparator.js'
import Range from './classes/range.js'
import satisfies from './functions/satisfies.js'
import toComparators from './ranges/to-comparators.js'
import maxSatisfying from './ranges/max-satisfying.js'
import minSatisfying from './ranges/min-satisfying.js'
import minVersion from './ranges/min-version.js'
import validRange from './ranges/valid.js'
import outside from './ranges/outside.js'
import gtr from './ranges/gtr.js'
import ltr from './ranges/ltr.js'
import intersects from './ranges/intersects.js'
import simplifyRange from './ranges/simplify.js'
import subset from './ranges/subset.js'
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
  tokens: t,
  SEMVER_SPEC_VERSION,
  RELEASE_TYPES,
  compareIdentifiers,
  rcompareIdentifiers,
}
