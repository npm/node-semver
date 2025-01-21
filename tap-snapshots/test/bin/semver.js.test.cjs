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
  "out": String(
    SemVer @@VERSION@@
    
    A JavaScript implementation of the https://semver.org/ specification
    Copyright Isaac Z. Schlueter
    
    Usage: semver [options] <version> [<version> [...]]
    Prints valid versions sorted by SemVer precedence
    
    Options:
    -r --range <range>
            Print versions that match the specified range.
    
    -i --increment [<level>]
            Increment a version by the specified level.  Level can
            be one of: major, minor, patch, premajor, preminor,
            prepatch, prerelease, or release.  Default level is 'patch'.
            Only one version may be specified.
    
    --preid <identifier>
            Identifier to be used to prefix premajor, preminor,
            prepatch or prerelease version increments.
    
    -l --loose
            Interpret versions and ranges loosely
    
    -p --include-prerelease
            Always include prerelease versions in range matching
    
    -c --coerce
            Coerce a string into SemVer if possible
            (does not imply --loose)
    
    --rtl
            Coerce version strings right to left
    
    --ltr
            Coerce version strings left to right (default)
    
    -n <base>
            Base number to be used for the prerelease identifier.
            Can be either 0 or 1, or false to omit the number altogether.
            Defaults to 0.
    
    Program exits successfully if any valid version satisfies
    all supplied ranges, and prints all satisfying versions.
    
    If no satisfying versions are found, then exits failure.
    
    Versions are printed in ascending order, so supplying
    multiple versions to the utility will just sort them.
    
  ),
  "signal": null,
}
`

exports[`test/bin/semver.js TAP help output > --help 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": String(
    SemVer @@VERSION@@
    
    A JavaScript implementation of the https://semver.org/ specification
    Copyright Isaac Z. Schlueter
    
    Usage: semver [options] <version> [<version> [...]]
    Prints valid versions sorted by SemVer precedence
    
    Options:
    -r --range <range>
            Print versions that match the specified range.
    
    -i --increment [<level>]
            Increment a version by the specified level.  Level can
            be one of: major, minor, patch, premajor, preminor,
            prepatch, prerelease, or release.  Default level is 'patch'.
            Only one version may be specified.
    
    --preid <identifier>
            Identifier to be used to prefix premajor, preminor,
            prepatch or prerelease version increments.
    
    -l --loose
            Interpret versions and ranges loosely
    
    -p --include-prerelease
            Always include prerelease versions in range matching
    
    -c --coerce
            Coerce a string into SemVer if possible
            (does not imply --loose)
    
    --rtl
            Coerce version strings right to left
    
    --ltr
            Coerce version strings left to right (default)
    
    -n <base>
            Base number to be used for the prerelease identifier.
            Can be either 0 or 1, or false to omit the number altogether.
            Defaults to 0.
    
    Program exits successfully if any valid version satisfies
    all supplied ranges, and prints all satisfying versions.
    
    If no satisfying versions are found, then exits failure.
    
    Versions are printed in ascending order, so supplying
    multiple versions to the utility will just sort them.
    
  ),
  "signal": null,
}
`

exports[`test/bin/semver.js TAP help output > -? 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": String(
    SemVer @@VERSION@@
    
    A JavaScript implementation of the https://semver.org/ specification
    Copyright Isaac Z. Schlueter
    
    Usage: semver [options] <version> [<version> [...]]
    Prints valid versions sorted by SemVer precedence
    
    Options:
    -r --range <range>
            Print versions that match the specified range.
    
    -i --increment [<level>]
            Increment a version by the specified level.  Level can
            be one of: major, minor, patch, premajor, preminor,
            prepatch, prerelease, or release.  Default level is 'patch'.
            Only one version may be specified.
    
    --preid <identifier>
            Identifier to be used to prefix premajor, preminor,
            prepatch or prerelease version increments.
    
    -l --loose
            Interpret versions and ranges loosely
    
    -p --include-prerelease
            Always include prerelease versions in range matching
    
    -c --coerce
            Coerce a string into SemVer if possible
            (does not imply --loose)
    
    --rtl
            Coerce version strings right to left
    
    --ltr
            Coerce version strings left to right (default)
    
    -n <base>
            Base number to be used for the prerelease identifier.
            Can be either 0 or 1, or false to omit the number altogether.
            Defaults to 0.
    
    Program exits successfully if any valid version satisfies
    all supplied ranges, and prints all satisfying versions.
    
    If no satisfying versions are found, then exits failure.
    
    Versions are printed in ascending order, so supplying
    multiple versions to the utility will just sort them.
    
  ),
  "signal": null,
}
`

exports[`test/bin/semver.js TAP help output > -h 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": String(
    SemVer @@VERSION@@
    
    A JavaScript implementation of the https://semver.org/ specification
    Copyright Isaac Z. Schlueter
    
    Usage: semver [options] <version> [<version> [...]]
    Prints valid versions sorted by SemVer precedence
    
    Options:
    -r --range <range>
            Print versions that match the specified range.
    
    -i --increment [<level>]
            Increment a version by the specified level.  Level can
            be one of: major, minor, patch, premajor, preminor,
            prepatch, prerelease, or release.  Default level is 'patch'.
            Only one version may be specified.
    
    --preid <identifier>
            Identifier to be used to prefix premajor, preminor,
            prepatch or prerelease version increments.
    
    -l --loose
            Interpret versions and ranges loosely
    
    -p --include-prerelease
            Always include prerelease versions in range matching
    
    -c --coerce
            Coerce a string into SemVer if possible
            (does not imply --loose)
    
    --rtl
            Coerce version strings right to left
    
    --ltr
            Coerce version strings left to right (default)
    
    -n <base>
            Base number to be used for the prerelease identifier.
            Can be either 0 or 1, or false to omit the number altogether.
            Defaults to 0.
    
    Program exits successfully if any valid version satisfies
    all supplied ranges, and prints all satisfying versions.
    
    If no satisfying versions are found, then exits failure.
    
    Versions are printed in ascending order, so supplying
    multiple versions to the utility will just sort them.
    
  ),
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

exports[`test/bin/semver.js TAP inc tests > -i premajor 1.0.0 --preid=beta -n 1 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.0.0-beta.1\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP inc tests > -i premajor 1.0.0 --preid=beta -n false 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.0.0-beta\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP inc tests > -i premajor 1.0.0 --preid=beta 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": "2.0.0-beta.0\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP inc tests > -i release 1.0.0-pre`] = `
Object {
  "code": 0,
  "err": "",
  "out": "1.0.0\\n",
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 -v 3.2.1 --version 2.3.4 -rv 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": String(
    3.2.1
    2.3.4
    1.2.3
    
  ),
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 -v 3.2.1 --version 2.3.4 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": String(
    1.2.3
    2.3.4
    3.2.1
    
  ),
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
  "out": String(
    1.2.3
    2.3.4
    3.2.1
    
  ),
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 2.3.4 2.3.4-beta 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": String(
    1.2.3
    2.3.4-beta
    2.3.4
    3.2.1
    
  ),
  "signal": null,
}
`

exports[`test/bin/semver.js TAP sorting and filtering > 1.2.3 3.2.1 2.3.4 2.3.4-beta 2.0.0asdf -r 2.x -p 1`] = `
Object {
  "code": 0,
  "err": "",
  "out": String(
    2.3.4-beta
    2.3.4
    
  ),
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
  "out": String(
    2.3.4-beta
    2.3.4
    
  ),
  "signal": null,
}
`
