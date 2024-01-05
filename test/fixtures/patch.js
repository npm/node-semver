// [range, version, loose]
// Version should be detectable despite extra characters
module.exports = [
  ['1.2.1', 1, false],
  [' 1.2.1 ', 1, false],
  [' 1.2.2-4 ', 2, false],
  [' 1.2.3-pre ', 3, false],
  ['v1.2.5', 5, false],
  [' v1.2.8 ', 8, false],
  ['\t1.2.13', 13, false],
  ['=1.2.21', 21, true],
  ['v=1.2.34', 34, true],
]
