// [prereleaseParts, version, loose]
module.exports = [
  [['alpha', 1], '1.2.2-alpha.1', false],
  [[1], '0.6.1-1', false],
  [['beta', 2], '1.0.0-beta.2', false],
  [['pre'], 'v0.5.4-pre', false],
  [['alpha', 1], '1.2.2-alpha.1', false],
  [['beta'], '0.6.1beta', true],
  [null, '1.0.0', true],
  [null, '~2.0.0-alpha.1', false],
  [null, 'invalid version', false],
]
