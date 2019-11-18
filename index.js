var SemVer = require('./src/SemVer');
var { compareIdentifiers, rcompareIdentifiers } = require('./internal/identifiers');
var { SEMVER_SPEC_VERSION } = require('./internal/constants');
var { re, src, t } = require('./internal/re');

exports = module.exports = SemVer
exports.re = re;
exports.src = src;
exports.tokens = t;
exports.SEMVER_SPEC_VERSION = SEMVER_SPEC_VERSION;

exports.SemVer = SemVer
exports.compareIdentifiers = compareIdentifiers
exports.rcompareIdentifiers = rcompareIdentifiers

exports.parse = parse = require('./src/functions/parse');
exports.valid = valid = require('./src/functions/valid');
exports.clean = clean = require('./src/functions/clean');
exports.inc = inc = require('./src/functions/inc');
exports.diff = diff = require('./src/functions/diff');
exports.major = major = require('./src/functions/major');
exports.minor = minor = require('./src/functions/minor');
exports.patch = patch = require('./src/functions/patch');
exports.prerelease = prerelease = require('./src/functions/prerelease');
exports.compare = compare = require('./src/functions/compare');
exports.rcompare = rcompare = require('./src/functions/rcompare');
exports.compareLoose = compareLoose = require('./src/functions/compareLoose');
exports.compareBuild = compareBuild = require('./src/functions/compareBuild');
exports.sort = sort = require('./src/functions/sort');
exports.rsort = rsort = require('./src/functions/rsort');
exports.gt = gt = require('./src/functions/gt');
exports.lt = lt = require('./src/functions/lt');
exports.eq = eq = require('./src/functions/eq');
exports.neq = neq = require('./src/functions/neq');
exports.gte = gte = require('./src/functions/gte');
exports.lte = lte = require('./src/functions/lte');
exports.cmp = cmp = require('./src/functions/cmp');
exports.coerce = coerce = require('./src/functions/coerce');

var { Comparator, Range, satisfies} = require('./src/ranges');
exports.Comparator = Comparator;
exports.Range = Range;
exports.satisfies = satisfies;

exports.toComparators = toComparators = require('./src/ranges/toComparators');
exports.maxSatisfying = maxSatisfying = require('./src/ranges/maxSatisfying');
exports.minSatisfying = minSatisfying = require('./src/ranges/minSatisfying');
exports.minVersion = minVersion = require('./src/ranges/minVersion');
exports.validRange = validRange = require('./src/ranges/validRange');
exports.outside = outside = require('./src/ranges/outside');
exports.gtr = gtr = require('./src/ranges/gtr');
exports.ltr = ltr = require('./src/ranges/ltr');
exports.intersects = intersects = require('./src/ranges/intersects');
