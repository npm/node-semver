// 6 was selected as an arbitrarily old version of Node to test in. This
// version of semver has no engines so this version of Node is a best effort
// to ensure no syntax is introduced that would break older Node versions.
// Problems found in even older versions of Node:
// - Node 4: RTL tests were not passing
// - Node 0.12: Necessary version of tap doesnt run
const OLD_NODE = '6.17.1'

module.exports = {
  windowsCI: false,
  macCI: false,
  updateNpm: false,
  eslint: false,
  dependabot: false,
  oldNode: OLD_NODE,
  ciVersions: [
    OLD_NODE,
    'latest',
  ],
  allowPaths: [
    '/range.bnf',
    '/semver.js',
  ],
  rootModule: {
    add: {
      'package.json': {
        file: './pkg.json',
        overwrite: false
      }
    }
  }
}
