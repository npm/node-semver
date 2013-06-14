;(function(exports) {

// export the class if we are in a Node-like system.
if (typeof module === 'object' && module.exports === exports)
  exports = module.exports = SemVer;

var debug;
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG))
  debug = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('SEMVER');
    console.log.apply(console, args);
  };
else
  debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var src = exports.src = {};

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

src.numericIdentifier = '0|[1-9]\\d*';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

src.nonNumericIdentifier = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

src.mainVersion = '(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)';


// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

src.prereleaseIdentifier = '(?:0|[1-9]\\d*|\\d*[a-zA-Z-][a-zA-Z0-9-]*)';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version identifiers.

src.prerelease = '(?:-(' + src.prereleaseIdentifier +
                  '(?:\\.' + src.prereleaseIdentifier + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

src.buildIdentifier = '[0-9A-Za-z-]+';


// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

src.build = '(?:\\+(' + src.buildIdentifier +
            '(?:\\.' + src.buildIdentifier + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

src.full = '^' + src.mainVersion +
           src.prerelease + '?' +
           src.build + '?' +
           '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
src.loose = '^' + '[v=\\s]*' + src.mainVersion +
             '(?:' + src.prerelease + ')?' +
             '(?:' + src.build + ')?' +
             '$';

var re = exports.re = {};
for (var i in src) {
  debug(i, src[i]);
  exports.re[i] = new RegExp(src[i]);
}

exports.valid = exports.parse = parse;
function parse(version) {
  if (!re.loose.test(version))
    return null;
  return new SemVer(version);
}

exports.clean = clean;
function clean(version) {
  return new SemVer(version).version;
}

exports.SemVer = SemVer;

function SemVer(version) {
  if (version instanceof SemVer)
    return version;

  if (!(this instanceof SemVer))
    return new SemVer(version);

  var m = version.match(exports.re.loose);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;
  this.major = m[1];
  this.minor = m[2];
  this.patch = m[3];
  this.prerelease = m[4] ? m[4].split('.') : [];
  this.build = m[5] ? m[5].split('.') : [];
  this.main = [m[1], m[2], m[3]].join('.');
  this.version = this.main;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
}

SemVer.prototype.compare = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.lenth && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1
       : (bnum && !anum) ? 1
       : a < b ? -1
       : a > b ? 1
       : 0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.compare = compare;
function compare(a, b) {
  return new SemVer(a).compare(b);
}

exports.rcompare = rcompare;
function rcompare(a, b) {
  return compare(b, a);
}

exports.sort = sort;
function sort(list) {
  return list.sort(exports.compare);
}

exports.rsort = rsort;
function rsort(list) {
  return list.sort(exports.rcompare);
}

exports.gt = gt;
function gt(a, b) {
  return compare(a, b) > 0;
}

exports.lt = lt;
function lt(a, b) {
  return compare(a, b) < 0;
}

exports.eq = eq;
function eq(a, b) {
  return compare(a, b) === 0;
}

exports.neq = neq;
function neq(a, b) {
  return compare(a, b) !== 0;
}

exports.gte = gte;
function gte(a, b) {
  return compare(a, b) >= 0;
}

exports.lte = lte;
function lte(a, b) {
  return compare(a, b) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b) {
  var ret;
  switch(op) {
    case '===': ret = a === b; break;
    case '!==': ret = a !== b; break;
    case '==': ret = eq(a, b); break;
    case '!=': ret = neq(a, b); break;
    case '>': ret = gt(a, b); break;
    case '>=': ret = gte(a, b); break;
    case '<': ret = lt(a, b); break;
    case '<=': ret = lte(a, b); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

})(typeof exports === 'object' ? exports : semver = {});
