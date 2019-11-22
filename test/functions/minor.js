const { test } = require('tap')
const minor = require('../../functions/minor')

test('minor tests', (t) => {
  // [range, version]
  // Version should be detectable despite extra characters
  [
    ['1.1.3', 1],
    [' 1.1.3 ', 1],
    [' 1.2.3-4 ', 2],
    [' 1.3.3-pre ', 3],
    ['v1.5.3', 5],
    [' v1.8.3 ', 8],
    ['\t1.13.3', 13],
    ['=1.21.3', 21, true],
    ['v=1.34.3', 34, true]
  ].forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const loose = tuple[2] || false
    const msg = `minor(${range}) = ${version}`
    t.equal(minor(range, loose), version, msg)
  })
  t.end()
})
