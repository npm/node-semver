// [range, version, loose]
// Version should be detectable despite extra characters
module.exports = [
  ['1.1.3', 1, false],
  [' 1.1.3 ', 1, false],
  [' 1.2.3-4 ', 2, false],
  [' 1.3.3-pre ', 3, false],
  ['v1.5.3', 5, false],
  [' v1.8.3 ', 8, false],
  ['\t1.13.3', 13, false],
  ['=1.21.3', 21, true],
  ['v=1.34.3', 34, true],
]
