
// See http://semver.org/
// This implementation is a *hair* less strict in that it allows
// v1.2.3 things, and also tags that don't begin with a char.

var semver = "\\s*[v=]*\\s*([0-9]+)"                // major
           + "\\.([0-9]+)"                  // minor
           + "\\.([0-9]+)"                  // patch
           + "(-[0-9]+-?)?"                 // build
           + "([a-zA-Z-][a-zA-Z0-9-\.:]*)?" // tag
  , exprComparator = "^((<|>)?=?)\s*("+semver+")$|^$"
  , xRangePlain = "([0-9]+|x|X)(?:\\.([0-9]+|x|X)(?:\\.([0-9]+|x|X))?)?"
  , xRange = "((?:<|>)?=?)?\\s*" + xRangePlain
  , exprSpermy = "(?:~>?)"+xRange
  , expressions = exports.expressions =
    { parse : new RegExp("^\\s*"+semver+"\\s*$")
    , parsePackage : new RegExp("^\\s*([^\/]+)[-@](" +semver+")\\s*$")
    , parseRange : new RegExp(
        "^\\s*(" + semver + ")\\s+-\\s+(" + semver + ")\\s*$")
    , validComparator : new RegExp("^"+exprComparator+"$")
    , parseXRange : new RegExp("^"+xRange+"$")
    , parseSpermy : new RegExp("^"+exprSpermy+"$")
    }
Object.getOwnPropertyNames(expressions).forEach(function (i) {
  exports[i] = function (str) { return (str || "").match(expressions[i]) }
})

exports.rangeReplace = ">=$1 <=$7"
exports.clean = clean
exports.compare = compare
exports.satisfies = satisfies
exports.gt = gt
exports.gte = gte
exports.lt = lt
exports.lte = lte
exports.eq = eq
exports.neq = neq
exports.cmp = cmp
exports.inc = inc

exports.valid = valid
exports.validPackage = validPackage
exports.validRange = validRange
exports.maxSatisfying = maxSatisfying

function stringify (version) {
  var v = version
  return [v[1]||'', v[2]||'', v[3]||''].join(".") + (v[4]||'') + (v[5]||'')
}

function clean (version) {
  version = exports.parse(version)
  if (!version) return version
  return stringify(version)
}

function valid (version) {
  return exports.parse(version) && version.trim().replace(/^[v=]+/, '')
}

function validPackage (version) {
  return version.match(expressions.parsePackage) && version.trim()
}

// range can be one of:
// "1.0.3 - 2.0.0" range, inclusive, like ">=1.0.3 <=2.0.0"
// ">1.0.2" like 1.0.3 - 9999.9999.9999
// ">=1.0.2" like 1.0.2 - 9999.9999.9999
// "<2.0.0" like 0.0.0 - 1.9999.9999
// ">1.0.2 <2.0.0" like 1.0.3 - 1.9999.9999
var starExpression = /(<|>)?=?\s*\*/g
  , starReplace = ""
  , compTrimExpression = new RegExp("((<|>)?=?)\\s*("
                                    +semver+"|"+xRangePlain+")", "g")
  , compTrimReplace = "$1$3"

function toComparators (range) {
  var ret = (range || "").trim()
    .replace(expressions.parseRange, exports.rangeReplace)
    .replace(compTrimExpression, compTrimReplace)
    .split(/\s+/)
    .join(" ")
    .split("||")
    .map(function (orchunk) {
      return orchunk
        .split(" ")
        .map(replaceXRanges)
        .map(replaceSpermies)
        .map(replaceStars)
        .join(" ").trim()
    })
    .map(function (orchunk) {
      return orchunk
        .trim()
        .split(/\s+/)
        .filter(function (c) { return c.match(expressions.validComparator) })
    })
    .filter(function (c) { return c.length })
  //console.error("comparators", range, ret)
  return ret
}

function replaceStars (stars) {
  return stars.replace(starExpression, starReplace)
}

// "2.x","2.x.x" --> ">=2.0.0 <2.1"
// "2.3.x" --> ">=2.3.0 <2.4.0"
function replaceXRanges (ranges) {
  return ranges.split(/\s+/)
               .map(replaceXRange)
               .join(" ")
}

function replaceXRange (version) {
  return version.trim().replace(expressions.parseXRange,
                                function (v, gtlt, M, m, p) {
    var anyX = !M || M.toLowerCase() === "x"
               || !m || m.toLowerCase() === "x"
               || !p || p.toLowerCase() === "x"
      , ret = v

    if (gtlt && anyX) {
      // just replace x'es with zeroes
      ;(!M || M.toLowerCase() === "x") && (M = 0)
      ;(!m || m.toLowerCase() === "x") && (m = 0)
      ;(!p || p.toLowerCase() === "x") && (p = 0)
      ret = gtlt + M+"."+m+"."+p
    } else if (!M || M.toLowerCase() === "x") {
      ret = "*" // allow any
    } else if (!m || m.toLowerCase() === "x") {
      // append "-" onto the version, otherwise
      // "1.x.x" matches "2.0.0beta", since the tag
      // *lowers* the version value
      ret = ">="+M+".0.0- <"+(+M+1)+".0.0-"
    } else if (!p || p.toLowerCase() === "x") {
      ret = ">="+M+"."+m+".0- <"+M+"."+(+m+1)+".0-"
    }
    //console.error("parseXRange", [].slice.call(arguments), ret)
    return ret
  })
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceSpermies (version) {
  return version.trim().replace(expressions.parseSpermy,
                                function (v, gtlt, M, m, p) {
    if (gtlt) throw new Error(
      "Using '"+gtlt+"' with ~ makes no sense. Don't do it.")
    if (!M || M.toLowerCase() === "x") {
      return "*"
    }
    // ~1 == >=1.0.0 <2.0.0
    if (!m || m.toLowerCase() === "x") {
      return ">="+M+".0.0 <"+(+M+1)+".0.0"
    }
    // ~1.2 == >=1.2.0 <1.3.0
    if (!p || p.toLowerCase() === "x") {
      return ">="+M+"."+m+".0 <"+M+"."+(+m+1)+".0"
    }
    // ~1.2.3 == >=1.2.3 <1.3.0
    return ">="+M+"."+m+"."+p+" <"+M+"."+(+m+1)+".0"
  })
}

function validRange (range) {
  range = range.trim().replace(starExpression, starReplace)
  var c = toComparators(range)
  return (c.length === 0)
       ? null
       : c.map(function (c) { return c.join(" ") }).join("||")
}

// returns the highest satisfying version in the list, or undefined
function maxSatisfying (versions, range) {
  return versions
    .filter(function (v) { return satisfies(v, range) })
    .sort(compare)
    .pop()
}
function satisfies (version, range) {
  version = valid(version)
  if (!version) return false
  range = toComparators(range)
  for (var i = 0, l = range.length ; i < l ; i ++) {
    var ok = false
    for (var j = 0, ll = range[i].length ; j < ll ; j ++) {
      var r = range[i][j]
        , gtlt = r.charAt(0) === ">" ? gt
               : r.charAt(0) === "<" ? lt
               : false
        , eq = r.charAt(!!gtlt) === "="
        , sub = (!!eq) + (!!gtlt)
      if (!gtlt) eq = true
      r = r.substr(sub)
      r = (r === "") ? r : valid(r)
      ok = (r === "") || (eq && r === version) || (gtlt && gtlt(version, r))
      if (!ok) break
    }
    if (ok) return true
  }
  return false
}

// return v1 > v2 ? 1 : -1
function compare (v1, v2) {
  var g = gt(v1, v2)
  return g === null ? 0 : g ? 1 : -1
}

function rcompare (v1, v2) {
  return compare(v2, v1)
}

function lt (v1, v2) { return gt(v2, v1) }
function gte (v1, v2) { return !lt(v1, v2) }
function lte (v1, v2) { return !gt(v1, v2) }
function eq (v1, v2) { return gt(v1, v2) === null }
function neq (v1, v2) { return gt(v1, v2) !== null }
function cmp (v1, c, v2) {
  switch (c) {
    case ">": return gt(v1, v2)
    case "<": return lt(v1, v2)
    case ">=": return gte(v1, v2)
    case "<=": return lte(v1, v2)
    case "==": return eq(v1, v2)
    case "!=": return neq(v1, v2)
    case "===": return v1 === v2
    case "!==": return v1 !== v2
    default: throw new Error("Y U NO USE VALID COMPARATOR!? "+c)
  }
}

// return v1 > v2
function num (v) {
  return v === undefined ? -1 : parseInt((v||"0").replace(/[^0-9]+/g, ''), 10)
}
function gt (v1, v2) {
  v1 = exports.parse(v1)
  v2 = exports.parse(v2)
  if (!v1 || !v2) return false

  for (var i = 1; i < 5; i ++) {
    v1[i] = num(v1[i])
    v2[i] = num(v2[i])
    if (v1[i] > v2[i]) return true
    else if (v1[i] !== v2[i]) return false
  }
  // no tag is > than any tag, or use lexicographical order.
  var tag1 = v1[5] || ""
    , tag2 = v2[5] || ""

  // kludge: null means they were equal.  falsey, and detectable.
  // embarrassingly overclever, though, I know.
  return tag1 === tag2 ? null
         : !tag1 ? true
         : !tag2 ? false
         : tag1 > tag2
}

function inc (version, release) {
  version = exports.parse(version)
  if (!version) return null

  var parsedIndexLookup =
    { 'major': 1
    , 'minor': 2
    , 'patch': 3
    , 'build': 4 }
  var incIndex = parsedIndexLookup[release]
  if (incIndex === undefined) return null

  var current = num(version[incIndex])
  version[incIndex] = current === -1 ? 1 : current + 1

  for (var i = incIndex + 1; i < 5; i ++) {
    if (num(version[i]) !== -1) version[i] = "0"
  }

  if (version[4]) version[4] = "-" + version[4]
  version[5] = ""

  return stringify(version)
}

if (module === require.main) {  // tests below

var tap = require("tap")
  , test = tap.test

tap.plan(5)

test("\ncomparison tests", function (t) {
; [ ["0.0.0", "0.0.0foo"]
  , ["0.0.1", "0.0.0"]
  , ["1.0.0", "0.9.9"]
  , ["0.10.0", "0.9.0"]
  , ["0.99.0", "0.10.0"]
  , ["2.0.0", "1.2.3"]
  , ["v0.0.0", "0.0.0foo"]
  , ["v0.0.1", "0.0.0"]
  , ["v1.0.0", "0.9.9"]
  , ["v0.10.0", "0.9.0"]
  , ["v0.99.0", "0.10.0"]
  , ["v2.0.0", "1.2.3"]
  , ["0.0.0", "v0.0.0foo"]
  , ["0.0.1", "v0.0.0"]
  , ["1.0.0", "v0.9.9"]
  , ["0.10.0", "v0.9.0"]
  , ["0.99.0", "v0.10.0"]
  , ["2.0.0", "v1.2.3"]
  , ["1.2.3", "1.2.3-asdf"]
  , ["1.2.3-4", "1.2.3"]
  , ["1.2.3-4-foo", "1.2.3"]
  , ["1.2.3-5", "1.2.3-5-foo"]
  , ["1.2.3-5", "1.2.3-4"]
  , ["1.2.3-5-foo", "1.2.3-5-Foo"]
  ].forEach(function (v) {
    var v0 = v[0]
      , v1 = v[1]
    t.ok(gt(v0, v1), "gt('"+v0+"', '"+v1+"')")
    t.ok(lt(v1, v0), "lt('"+v1+"', '"+v0+"')")
    t.ok(!gt(v1, v0), "!gt('"+v1+"', '"+v0+"')")
    t.ok(!lt(v0, v1), "!lt('"+v0+"', '"+v1+"')")
    t.ok(eq(v0, v0), "eq('"+v0+"', '"+v0+"')")
    t.ok(eq(v1, v1), "eq('"+v1+"', '"+v1+"')")
    t.ok(neq(v0, v1), "neq('"+v0+"', '"+v1+"')")
    t.ok(cmp(v1, "==", v1), "cmp('"+v1+"' == '"+v1+"')")
    t.ok(cmp(v0, ">=", v1), "cmp('"+v0+"' >= '"+v1+"')")
    t.ok(cmp(v1, "<=", v0), "cmp('"+v1+"' <= '"+v0+"')")
    t.ok(cmp(v0, "!=", v1), "cmp('"+v0+"' != '"+v1+"')")
  })
  t.end()
})

test("\nequality tests", function (t) {
; [ ["1.2.3", "v1.2.3"]
  , ["1.2.3", "=1.2.3"]
  , ["1.2.3", "v 1.2.3"]
  , ["1.2.3", "= 1.2.3"]
  , ["1.2.3", " v1.2.3"]
  , ["1.2.3", " =1.2.3"]
  , ["1.2.3", " v 1.2.3"]
  , ["1.2.3", " = 1.2.3"]
  , ["1.2.3-0", "v1.2.3-0"]
  , ["1.2.3-0", "=1.2.3-0"]
  , ["1.2.3-0", "v 1.2.3-0"]
  , ["1.2.3-0", "= 1.2.3-0"]
  , ["1.2.3-0", " v1.2.3-0"]
  , ["1.2.3-0", " =1.2.3-0"]
  , ["1.2.3-0", " v 1.2.3-0"]
  , ["1.2.3-0", " = 1.2.3-0"]
  , ["1.2.3-01", "v1.2.3-1"]
  , ["1.2.3-01", "=1.2.3-1"]
  , ["1.2.3-01", "v 1.2.3-1"]
  , ["1.2.3-01", "= 1.2.3-1"]
  , ["1.2.3-01", " v1.2.3-1"]
  , ["1.2.3-01", " =1.2.3-1"]
  , ["1.2.3-01", " v 1.2.3-1"]
  , ["1.2.3-01", " = 1.2.3-1"]
  , ["1.2.3beta", "v1.2.3beta"]
  , ["1.2.3beta", "=1.2.3beta"]
  , ["1.2.3beta", "v 1.2.3beta"]
  , ["1.2.3beta", "= 1.2.3beta"]
  , ["1.2.3beta", " v1.2.3beta"]
  , ["1.2.3beta", " =1.2.3beta"]
  , ["1.2.3beta", " v 1.2.3beta"]
  , ["1.2.3beta", " = 1.2.3beta"]
  ].forEach(function (v) {
    var v0 = v[0]
      , v1 = v[1]
    t.ok(eq(v0, v1), "eq('"+v0+"', '"+v1+"')")
    t.ok(!neq(v0, v1), "!neq('"+v0+"', '"+v1+"')")
    t.ok(cmp(v0, "==", v1), "cmp("+v0+"=="+v1+")")
    t.ok(!cmp(v0, "!=", v1), "!cmp("+v0+"!="+v1+")")
    t.ok(!cmp(v0, "===", v1), "!cmp("+v0+"==="+v1+")")
    t.ok(cmp(v0, "!==", v1), "cmp("+v0+"!=="+v1+")")
    t.ok(!gt(v0, v1), "!gt('"+v0+"', '"+v1+"')")
    t.ok(gte(v0, v1), "gte('"+v0+"', '"+v1+"')")
    t.ok(!lt(v0, v1), "!lt('"+v0+"', '"+v1+"')")
    t.ok(lte(v0, v1), "lte('"+v0+"', '"+v1+"')")
  })
  t.end()
})


test("\nrange tests", function (t) {
; [ ["1.0.0 - 2.0.0", "1.2.3"]
  , ["1.0.0", "1.0.0"]
  , [">=*", "0.2.4"]
  , ["", "1.0.0"]
  , ["*", "1.2.3"]
  , ["*", "v1.2.3-foo"]
  , [">=1.0.0", "1.0.0"]
  , [">=1.0.0", "1.0.1"]
  , [">=1.0.0", "1.1.0"]
  , [">1.0.0", "1.0.1"]
  , [">1.0.0", "1.1.0"]
  , ["<=2.0.0", "2.0.0"]
  , ["<=2.0.0", "1.9999.9999"]
  , ["<=2.0.0", "0.2.9"]
  , ["<2.0.0", "1.9999.9999"]
  , ["<2.0.0", "0.2.9"]
  , [">= 1.0.0", "1.0.0"]
  , [">=  1.0.0", "1.0.1"]
  , [">=   1.0.0", "1.1.0"]
  , ["> 1.0.0", "1.0.1"]
  , [">  1.0.0", "1.1.0"]
  , ["<=   2.0.0", "2.0.0"]
  , ["<= 2.0.0", "1.9999.9999"]
  , ["<=  2.0.0", "0.2.9"]
  , ["<    2.0.0", "1.9999.9999"]
  , ["<\t2.0.0", "0.2.9"]
  , [">=0.1.97", "v0.1.97"]
  , [">=0.1.97", "0.1.97"]
  , ["0.1.20 || 1.2.4", "1.2.4"]
  , [">=0.2.3 || <0.0.1", "0.0.0"]
  , [">=0.2.3 || <0.0.1", "0.2.3"]
  , [">=0.2.3 || <0.0.1", "0.2.4"]
  , ["||", "1.3.4"]
  , ["2.x.x", "2.1.3"]
  , ["1.2.x", "1.2.3"]
  , ["1.2.x || 2.x", "2.1.3"]
  , ["1.2.x || 2.x", "1.2.3"]
  , ["x", "1.2.3"]
  , ["2", "2.1.2"]
  , ["2.3", "2.3.1"]
  , ["~2.4", "2.4.0"] // >=2.4.0 <2.5.0
  , ["~2.4", "2.4.5"]
  , ["~>3.2.1", "3.2.2"] // >=3.2.1 <3.3.0
  , ["~1", "1.2.3"] // >=1.0.0 <2.0.0
  , ["~>1", "1.2.3"]
  , ["~> 1", "1.2.3"]
  , ["~1.0", "1.0.2"] // >=1.0.0 <1.1.0
  , ["~ 1.0", "1.0.2"]
  , ["<1", "1.0.0beta"]
  , ["< 1", "1.0.0beta"]
  , [">=1", "1.0.0"]
  , [">= 1", "1.0.0"]
  , ["<1.2", "1.1.1"]
  , ["< 1.2", "1.1.1"]
  , ["1", "1.0.0beta"]
  ].forEach(function (v) {
    t.ok(satisfies(v[1], v[0]), v[0]+" satisfied by "+v[1])
  })
  t.end()
})

test("\nnegative range tests", function (t) {
; [ ["1.0.0 - 2.0.0", "2.2.3"]
  , ["1.0.0", "1.0.1"]
  , [">=1.0.0", "0.0.0"]
  , [">=1.0.0", "0.0.1"]
  , [">=1.0.0", "0.1.0"]
  , [">1.0.0", "0.0.1"]
  , [">1.0.0", "0.1.0"]
  , ["<=2.0.0", "3.0.0"]
  , ["<=2.0.0", "2.9999.9999"]
  , ["<=2.0.0", "2.2.9"]
  , ["<2.0.0", "2.9999.9999"]
  , ["<2.0.0", "2.2.9"]
  , [">=0.1.97", "v0.1.93"]
  , [">=0.1.97", "0.1.93"]
  , ["0.1.20 || 1.2.4", "1.2.3"]
  , [">=0.2.3 || <0.0.1", "0.0.3"]
  , [">=0.2.3 || <0.0.1", "0.2.2"]
  , ["2.x.x", "1.1.3"]
  , ["2.x.x", "3.1.3"]
  , ["1.2.x", "1.3.3"]
  , ["1.2.x || 2.x", "3.1.3"]
  , ["1.2.x || 2.x", "1.1.3"]
  , ["2", "1.1.2"]
  , ["2.3", "2.4.1"]
  , ["~2.4", "2.5.0"] // >=2.4.0 <2.5.0
  , ["~2.4", "2.3.9"]
  , ["~>3.2.1", "3.3.2"] // >=3.2.1 <3.3.0
  , ["~>3.2.1", "3.2.0"] // >=3.2.1 <3.3.0
  , ["~1", "0.2.3"] // >=1.0.0 <2.0.0
  , ["~>1", "2.2.3"]
  , ["~1.0", "1.1.0"] // >=1.0.0 <1.1.0
  , ["<1", "1.0.0"]
  , [">=1.2", "1.1.1"]
  , ["1", "2.0.0beta"]
  ].forEach(function (v) {
    t.ok(!satisfies(v[1], v[0]), v[0]+" not satisfied by "+v[1])
  })
  t.end()
})

test("\nincrement versions test", function (t) {
; [ [ "1.2.3",   "major", "2.0.0"   ]
  , [ "1.2.3",   "minor", "1.3.0"   ]
  , [ "1.2.3",   "patch", "1.2.4"   ]
  , [ "1.2.3",   "build", "1.2.3-1" ]
  , [ "1.2.3-4", "build", "1.2.3-5" ]

  , [ "1.2.3tag",    "major", "2.0.0"   ]
  , [ "1.2.3-tag",   "major", "2.0.0"   ]
  , [ "1.2.3tag",    "build", "1.2.3-1" ]
  , [ "1.2.3-tag",   "build", "1.2.3-1" ]
  , [ "1.2.3-4-tag", "build", "1.2.3-5" ]
  , [ "1.2.3-4tag",  "build", "1.2.3-5" ]

  , [ "1.2.3", "fake",  null ]
  , [ "fake",  "major", null ]
  ].forEach(function (v) {
    t.equal(inc(v[0], v[1]), v[2], "inc("+v[0]+", "+v[1]+") === "+v[2])
  })

  t.end()
})

}
