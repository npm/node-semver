const { test } = require('tap')
const clean = require('../../functions/clean')

test('clean tests', (t) => {
  // [range, version]
  // Version should be detectable despite extra characters
  [
    ['1.2.3', '1.2.3'],
    [' 1.2.3 ', '1.2.3'],
    [' 1.2.3-4 ', '1.2.3-4'],
    [' 1.2.3-pre ', '1.2.3-pre'],
    ['  =v1.2.3   ', '1.2.3'],
    ['v1.2.3', '1.2.3'],
    [' v1.2.3 ', '1.2.3'],
    ['\t1.2.3', '1.2.3'],
    ['>1.2.3', null],
    ['~1.2.3', null],
    ['<=1.2.3', null],
    ['1.2.x', null]
  ].forEach(([range, version]) => {
    const msg = `clean(${range}) = ${version}`
    t.equal(clean(range), version, msg)
  })
  t.end()
})
