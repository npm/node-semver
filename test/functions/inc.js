'use strict'

const { test } = require('tap')
const inc = require('../../functions/inc')
const parse = require('../../functions/parse')
const compare = require('../../functions/compare')
const SemVer = require('../../classes/semver')
const increments = require('../fixtures/increments.js')

test('increment versions test', (t) => {
  increments.forEach(([pre, what, wanted, options, id, base]) => {
    const found = inc(pre, what, options, id, base)
    const cmd = `inc(${pre}, ${what}, ${id}, ${base})`
    t.equal(found, wanted, `${cmd} === ${wanted}`)

    const parsed = parse(pre, options)
    const parsedAsInput = parse(pre, options)
    if (wanted) {
      parsed.inc(what, id, base)
      t.equal(parsed.version, wanted, `${cmd} object version updated`)
      if (parsed.build.length) {
        t.equal(
          parsed.raw,
          `${wanted}+${parsed.build.join('.')}`,
          `${cmd} object raw field updated with build`
        )
      } else {
        t.equal(parsed.raw, wanted, `${cmd} object raw field updated`)
      }

      const preIncObject = JSON.stringify(parsedAsInput)
      inc(parsedAsInput, what, options, id, base)
      const postIncObject = JSON.stringify(parsedAsInput)
      t.equal(
        postIncObject,
        preIncObject,
        `${cmd} didn't modify its input`
      )
    } else if (parsed) {
      t.throws(() => {
        parsed.inc(what, id, base)
      })
    } else {
      t.equal(parsed, null)
    }
  })

  t.end()
})

test('inc prerelease with a dotted identifier keeps one id per element', (t) => {
  // Regression: a dotted identifier such as 'x.y' was stored as a single
  // prerelease element ('x.y'), so comparePre() compared 'x.y' against a plain
  // identifier and mis-ordered versions. The parsed object then compared
  // differently from the equivalent version string.
  const obj = new SemVer('1.2.3-alpha').inc('prerelease', 'x.y')
  t.equal(obj.version, '1.2.3-x.y.0')
  t.strictSame(obj.prerelease, ['x', 'y', 0], 'one identifier per array element')
  t.equal(
    obj.compare(new SemVer('1.2.3-x.y.1')),
    compare('1.2.3-x.y.0', '1.2.3-x.y.1'),
    'object comparison matches string comparison'
  )
  t.equal(obj.compare(new SemVer('1.2.3-x.y.1')), -1)

  // numeric ids inside a dotted identifier are numberified exactly like parse()
  const num = new SemVer('1.2.3').inc('prerelease', '1.2')
  t.strictSame(num.prerelease, parse(num.version).prerelease)

  t.end()
})
