const { test } = require('tap')
const intersects = require('../../ranges/intersects')
const Range = require('../../classes/range')
const Comparator = require('../../classes/comparator')

test('intersect comparators', (t) => {
  [
    // One is a Version
    ['1.3.0', '>=1.3.0', true],
    ['1.3.0', '>1.3.0', false],
    ['>=1.3.0', '1.3.0', true],
    ['>1.3.0', '1.3.0', false],
    // Same direction increasing
    ['>1.3.0', '>1.2.0', true],
    ['>1.2.0', '>1.3.0', true],
    ['>=1.2.0', '>1.3.0', true],
    ['>1.2.0', '>=1.3.0', true],
    // Same direction decreasing
    ['<1.3.0', '<1.2.0', true],
    ['<1.2.0', '<1.3.0', true],
    ['<=1.2.0', '<1.3.0', true],
    ['<1.2.0', '<=1.3.0', true],
    // Different directions, same semver and inclusive operator
    ['>=1.3.0', '<=1.3.0', true],
    ['>=v1.3.0', '<=1.3.0', true],
    ['>=1.3.0', '>=1.3.0', true],
    ['<=1.3.0', '<=1.3.0', true],
    ['<=1.3.0', '<=v1.3.0', true],
    ['>1.3.0', '<=1.3.0', false],
    ['>=1.3.0', '<1.3.0', false],
    // Opposite matching directions
    ['>1.0.0', '<2.0.0', true],
    ['>=1.0.0', '<2.0.0', true],
    ['>=1.0.0', '<=2.0.0', true],
    ['>1.0.0', '<=2.0.0', true],
    ['<=2.0.0', '>1.0.0', true],
    ['<=1.0.0', '>=2.0.0', false]
  ].forEach((v) => {
    const comparator1 = new Comparator(v[0])
    const comparator2 = new Comparator(v[1])
    const expect = v[2]

    const actual1 = comparator1.intersects(comparator2, false)
    const actual2 = comparator2.intersects(comparator1, { loose: false })
    const actual3 = intersects(comparator1, comparator2)
    const actual4 = intersects(comparator2, comparator1)
    const actual5 = intersects(comparator1, comparator2, true)
    const actual6 = intersects(comparator2, comparator1, true)
    const actual7 = intersects(v[0], v[1])
    const actual8 = intersects(v[1], v[0])
    const actual9 = intersects(v[0], v[1], true)
    const actual10 = intersects(v[1], v[0], true)
    t.equal(actual1, expect)
    t.equal(actual2, expect)
    t.equal(actual3, expect)
    t.equal(actual4, expect)
    t.equal(actual5, expect)
    t.equal(actual6, expect)
    t.equal(actual7, expect)
    t.equal(actual8, expect)
    t.equal(actual9, expect)
    t.equal(actual10, expect)
  })
  t.end()
})

test('ranges intersect', (t) => {
  [
    ['1.3.0 || <1.0.0 >2.0.0', '1.3.0 || <1.0.0 >2.0.0', true],
    ['<1.0.0 >2.0.0', '>0.0.0', false],
    ['>0.0.0', '<1.0.0 >2.0.0', false],
    ['<1.0.0 >2.0.0', '>1.4.0 <1.6.0', false],
    ['<1.0.0 >2.0.0', '>1.4.0 <1.6.0 || 2.0.0', false],
    ['>1.0.0 <=2.0.0', '2.0.0', true],
    ['<1.0.0 >=2.0.0', '2.1.0', false],
    ['<1.0.0 >=2.0.0', '>1.4.0 <1.6.0 || 2.0.0', false],
    ['1.5.x', '<1.5.0 || >=1.6.0', false],
    ['<1.5.0 || >=1.6.0', '1.5.x', false],
    ['<1.6.16 || >=1.7.0 <1.7.11 || >=1.8.0 <1.8.2', '>=1.6.16 <1.7.0 || >=1.7.11 <1.8.0 || >=1.8.2', false],
    ['<=1.6.16 || >=1.7.0 <1.7.11 || >=1.8.0 <1.8.2', '>=1.6.16 <1.7.0 || >=1.7.11 <1.8.0 || >=1.8.2', true],
    ['>=1.0.0', '<=1.0.0', true],
    ['>1.0.0 <1.0.0', '<=0.0.0', false],
    ['*', '0.0.1', true],
    ['*', '>=1.0.0', true],
    ['*', '>1.0.0', true],
    ['*', '~1.0.0', true],
    ['*', '<1.6.0', true],
    ['*', '<=1.6.0', true],
    ['1.*', '0.0.1', false],
    ['1.*', '2.0.0', false],
    ['1.*', '1.0.0', true],
    ['1.*', '<2.0.0', true],
    ['1.*', '>1.0.0', true],
    ['1.*', '<=1.0.0', true],
    ['1.*', '^1.0.0', true],
    ['1.0.*', '0.0.1', false],
    ['1.0.*', '<0.0.1', false],
    ['1.0.*', '>0.0.1', true],
    ['*', '1.3.0 || <1.0.0 >2.0.0', true],
    ['1.3.0 || <1.0.0 >2.0.0', '*', true],
    ['1.*', '1.3.0 || <1.0.0 >2.0.0', true],
    ['x', '0.0.1', true],
    ['x', '>=1.0.0', true],
    ['x', '>1.0.0', true],
    ['x', '~1.0.0', true],
    ['x', '<1.6.0', true],
    ['x', '<=1.6.0', true],
    ['1.x', '0.0.1', false],
    ['1.x', '2.0.0', false],
    ['1.x', '1.0.0', true],
    ['1.x', '<2.0.0', true],
    ['1.x', '>1.0.0', true],
    ['1.x', '<=1.0.0', true],
    ['1.x', '^1.0.0', true],
    ['1.0.x', '0.0.1', false],
    ['1.0.x', '<0.0.1', false],
    ['1.0.x', '>0.0.1', true],
    ['x', '1.3.0 || <1.0.0 >2.0.0', true],
    ['1.3.0 || <1.0.0 >2.0.0', 'x', true],
    ['1.x', '1.3.0 || <1.0.0 >2.0.0', true],
    ['*', '*', true],
    ['x', '', true]
  ].forEach((v) => {
    t.test(`${v[0]} <~> ${v[1]}`, t => {
      const range1 = new Range(v[0])
      const range2 = new Range(v[1])
      const expect = v[2]
      const actual1 = range1.intersects(range2)
      const actual2 = range2.intersects(range1)
      const actual3 = intersects(v[1], v[0])
      const actual4 = intersects(v[0], v[1])
      const actual5 = intersects(v[1], v[0], true)
      const actual6 = intersects(v[0], v[1], true)
      const actual7 = intersects(range1, range2)
      const actual8 = intersects(range2, range1)
      const actual9 = intersects(range1, range2, true)
      const actual0 = intersects(range2, range1, true)
      t.equal(actual1, expect)
      t.equal(actual2, expect)
      t.equal(actual3, expect)
      t.equal(actual4, expect)
      t.equal(actual5, expect)
      t.equal(actual6, expect)
      t.equal(actual7, expect)
      t.equal(actual8, expect)
      t.equal(actual9, expect)
      t.equal(actual0, expect)
      t.end()
    })
  })
  t.end()
})

test('missing comparator parameter in intersect comparators', (t) => {
  t.throws(() => {
    new Comparator('>1.0.0').intersects()
  }, new TypeError('a Comparator is required'),
  'throws type error')
  t.end()
})

test('missing range parameter in range intersect', (t) => {
  t.throws(() => {
    new Range('1.0.0').intersects()
  }, new TypeError('a Range is required'),
  'throws type error')
  t.end()
})
