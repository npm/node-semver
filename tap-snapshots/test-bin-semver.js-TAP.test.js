/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/bin/semver.js TAP coercing > 1.2.3.4.5.6 -c --rtl --ltr 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP coercing > 1.2.3.4.5.6 -c --rtl 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "4.5.6\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP coercing > 1.2.3.4.5.6 -c 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP coercing > not a version -c 1`] = `
Object {
  "code": 1,
  "err": "",
  "out": "",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP coercing > not a version 1.2.3 -c 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP help output > (no args) 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "SemVer @@VERSION@@\\n\\nA JavaScript implementation of the https://semver.org/ specification\\nCopyright Isaac Z. Schlueter\\n\\nUsage: semver [options] <version> [<version> [...]]\\nPrints valid versions sorted by SemVer precedence\\n\\nOptions:\\n-r --range <range>\\n        Print versions that match the specified range.\\n\\n-i --increment [<level>]\\n        Increment a version by the specified level.  Level can\\n        be one of: major, minor, patch, premajor, preminor,\\n        prepatch, or prerelease.  Default level is 'patch'.\\n        Only one version may be specified.\\n\\n--preid <identifier>\\n        Identifier to be used to prefix premajor, preminor,\\n        prepatch or prerelease version increments.\\n\\n-l --loose\\n        Interpret versions and ranges loosely\\n\\n-p --include-prerelease\\n        Always include prerelease versions in range matching\\n\\n-c --coerce\\n        Coerce a string into SemVer if possible\\n        (does not imply --loose)\\n\\n--rtl\\n        Coerce version strings right to left\\n\\n--ltr\\n        Coerce version strings left to right (default)\\n\\nProgram exits successfully if any valid version satisfies\\nall supplied ranges, and prints all satisfying versions.\\n\\nIf no satisfying versions are found, then exits failure.\\n\\nVersions are printed in ascending order, so supplying\\nmultiple versions to the utility will just sort them.\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP help output > --help 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "SemVer @@VERSION@@\\n\\nA JavaScript implementation of the https://semver.org/ specification\\nCopyright Isaac Z. Schlueter\\n\\nUsage: semver [options] <version> [<version> [...]]\\nPrints valid versions sorted by SemVer precedence\\n\\nOptions:\\n-r --range <range>\\n        Print versions that match the specified range.\\n\\n-i --increment [<level>]\\n        Increment a version by the specified level.  Level can\\n        be one of: major, minor, patch, premajor, preminor,\\n        prepatch, or prerelease.  Default level is 'patch'.\\n        Only one version may be specified.\\n\\n--preid <identifier>\\n        Identifier to be used to prefix premajor, preminor,\\n        prepatch or prerelease version increments.\\n\\n-l --loose\\n        Interpret versions and ranges loosely\\n\\n-p --include-prerelease\\n        Always include prerelease versions in range matching\\n\\n-c --coerce\\n        Coerce a string into SemVer if possible\\n        (does not imply --loose)\\n\\n--rtl\\n        Coerce version strings right to left\\n\\n--ltr\\n        Coerce version strings left to right (default)\\n\\nProgram exits successfully if any valid version satisfies\\nall supplied ranges, and prints all satisfying versions.\\n\\nIf no satisfying versions are found, then exits failure.\\n\\nVersions are printed in ascending order, so supplying\\nmultiple versions to the utility will just sort them.\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP help output > -? 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "SemVer @@VERSION@@\\n\\nA JavaScript implementation of the https://semver.org/ specification\\nCopyright Isaac Z. Schlueter\\n\\nUsage: semver [options] <version> [<version> [...]]\\nPrints valid versions sorted by SemVer precedence\\n\\nOptions:\\n-r --range <range>\\n        Print versions that match the specified range.\\n\\n-i --increment [<level>]\\n        Increment a version by the specified level.  Level can\\n        be one of: major, minor, patch, premajor, preminor,\\n        prepatch, or prerelease.  Default level is 'patch'.\\n        Only one version may be specified.\\n\\n--preid <identifier>\\n        Identifier to be used to prefix premajor, preminor,\\n        prepatch or prerelease version increments.\\n\\n-l --loose\\n        Interpret versions and ranges loosely\\n\\n-p --include-prerelease\\n        Always include prerelease versions in range matching\\n\\n-c --coerce\\n        Coerce a string into SemVer if possible\\n        (does not imply --loose)\\n\\n--rtl\\n        Coerce version strings right to left\\n\\n--ltr\\n        Coerce version strings left to right (default)\\n\\nProgram exits successfully if any valid version satisfies\\nall supplied ranges, and prints all satisfying versions.\\n\\nIf no satisfying versions are found, then exits failure.\\n\\nVersions are printed in ascending order, so supplying\\nmultiple versions to the utility will just sort them.\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP help output > -h 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "SemVer @@VERSION@@\\n\\nA JavaScript implementation of the https://semver.org/ specification\\nCopyright Isaac Z. Schlueter\\n\\nUsage: semver [options] <version> [<version> [...]]\\nPrints valid versions sorted by SemVer precedence\\n\\nOptions:\\n-r --range <range>\\n        Print versions that match the specified range.\\n\\n-i --increment [<level>]\\n        Increment a version by the specified level.  Level can\\n        be one of: major, minor, patch, premajor, preminor,\\n        prepatch, or prerelease.  Default level is 'patch'.\\n        Only one version may be specified.\\n\\n--preid <identifier>\\n        Identifier to be used to prefix premajor, preminor,\\n        prepatch or prerelease version increments.\\n\\n-l --loose\\n        Interpret versions and ranges loosely\\n\\n-p --include-prerelease\\n        Always include prerelease versions in range matching\\n\\n-c --coerce\\n        Coerce a string into SemVer if possible\\n        (does not imply --loose)\\n\\n--rtl\\n        Coerce version strings right to left\\n\\n--ltr\\n        Coerce version strings left to right (default)\\n\\nProgram exits successfully if any valid version satisfies\\nall supplied ranges, and prints all satisfying versions.\\n\\nIf no satisfying versions are found, then exits failure.\\n\\nVersions are printed in ascending order, so supplying\\nmultiple versions to the utility will just sort them.\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP inc tests > -i 1.2.3 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.4\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP inc tests > -i major 1.0.0 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.0.0\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP inc tests > -i major 1.0.0 1.0.1 1`] = `
Object {
  "code": 1,
  "err": "--inc can only be used on a single version with no range\\n",
  "out": "",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP inc tests > -i premajor 1.0.0 --preid=beta 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.0.0-0\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 -v 3.2.1 --version 2.3.4 -rv 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "3.2.1\\n2.3.4\\n1.2.3\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 -v 3.2.1 --version 2.3.4 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3\\n2.3.4\\n3.2.1\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 -r 2.x 1`] = `
Object {
  "code": 1,
  "err": "",
  "out": "",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 -r 2.x 2.3.4 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.3.4\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 2.3.4 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3\\n2.3.4\\n3.2.1\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 2.3.4 2.3.4-beta 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3\\n2.3.4-beta\\n2.3.4\\n3.2.1\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 2.3.4 2.3.4-beta 2.0.0asdf -r 2.x -p 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.3.4-beta\\n2.3.4\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 2.3.4 2.3.4-beta 2.0.0asdf -r 2.x 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.3.4\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3foo 1.2.3-bar -l 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3-bar\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3foo 1.2.3-bar 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.2.3-bar\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 3.2.1 2.3.4 2.3.4-beta 2.0.0asdf -r 2.x -p -l 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.3.4-beta\\n2.3.4\\n",
  "signal": null,
}
`
