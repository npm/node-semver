// [range, version, loose]
// Version should be detectable despite extra characters
module.exports = [
  ['1.2.3', 1, false],
  [' 1.2.3 ', 1, false],
  [' 2.2.3-4 ', 2, false],
  [' 3.2.3-pre ', 3, false],
  ['v5.2.3', 5, false],
  [' v8.2.3 ', 8, false],
  ['\t13.2.3', 13, false],
  ['=21.2.3', 21, true],
  ['v=34.2.3', 34, true],
]
