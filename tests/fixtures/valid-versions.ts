// [version, major, minor, patch, prerelease[], build[]]
export default [
  ['1.0.0', 1, 0, 0, [], []],
  ['2.1.0', 2, 1, 0, [], []],
  ['3.2.1', 3, 2, 1, [], []],
  ['v1.2.3', 1, 2, 3, [], []],

  // prerelease
  ['1.2.3-0', 1, 2, 3, [0], []],
  ['1.2.3-123', 1, 2, 3, [123], []],
  ['1.2.3-1.2.3', 1, 2, 3, [1, 2, 3], []],
  ['1.2.3-1a', 1, 2, 3, ['1a'], []],
  ['1.2.3-a1', 1, 2, 3, ['a1'], []],
  ['1.2.3-alpha', 1, 2, 3, ['alpha'], []],
  ['1.2.3-alpha.1', 1, 2, 3, ['alpha', 1], []],
  ['1.2.3-alpha-1', 1, 2, 3, ['alpha-1'], []],
  ['1.2.3-alpha-.-beta', 1, 2, 3, ['alpha-', '-beta'], []],

  // build
  ['1.2.3+456', 1, 2, 3, [], ['456']],
  ['1.2.3+build', 1, 2, 3, [], ['build']],
  ['1.2.3+new-build', 1, 2, 3, [], ['new-build']],
  ['1.2.3+build.1', 1, 2, 3, [], ['build', '1']],
  ['1.2.3+build.1a', 1, 2, 3, [], ['build', '1a']],
  ['1.2.3+build.a1', 1, 2, 3, [], ['build', 'a1']],
  ['1.2.3+build.alpha', 1, 2, 3, [], ['build', 'alpha']],
  ['1.2.3+build.alpha.beta', 1, 2, 3, [], ['build', 'alpha', 'beta']],

  // mixed
  ['1.2.3-alpha+build', 1, 2, 3, ['alpha'], ['build']],
] as [string, number, number, number, string[], string[]][]
