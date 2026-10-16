'use strict'

const { test } = require('tap')
const {
  Range,
  SemVer,
  valid,
  validRange,
  satisfies,
  minVersion,
  minSatisfying,
  maxSatisfying,
} = require('../../')
const {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
} = require('../../internal/constants')

const longId = '928490632884417731e7af463c92b034d6a78268fc993bcb88a57944'
const options = [
  {},
  { loose: true },
  { includePrerelease: true },
  { loose: true, includePrerelease: true },
]

const checkRange = (t, input, expected, version, opts) => {
  const range = new Range(input, opts)
  const versions = ['0.0.0-0', version, '1.2.4']
  t.equal(range.range, expected, 'Range preserves the identifier')
  t.equal(validRange(input, opts), expected, 'validRange preserves the identifier')
  t.ok(range.test(version), 'Range.test accepts the matching version')
  t.ok(satisfies(version, input, opts), 'satisfies accepts the matching version')
  t.notOk(satisfies('0.0.0-0', input, opts), 'excludes a different prerelease')
  t.notOk(satisfies('1.2.4', input, opts), 'excludes a different release')
  t.equal(minVersion(input, opts).version, version, 'minVersion preserves the identifier')
  t.equal(minSatisfying(versions, input, opts), version, 'minSatisfying selects the version')
  t.equal(maxSatisfying(versions, input, opts), version, 'maxSatisfying selects the version')
}

test('long numeric-prefix prereleases from #580 and #583', t => {
  const versions = [
    `0.0.0-${longId}`,
    `1.1.1-${longId}`,
    `${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}-${longId}`,
  ]
  for (const length of [
    MAX_SAFE_COMPONENT_LENGTH - 1,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH + 1,
    18,
    MAX_LENGTH - '1.2.3-a'.length,
  ]) {
    versions.push(`1.2.3-${'9'.repeat(length)}a`)
  }

  for (const opts of options) {
    for (const version of versions) {
      t.equal(valid(version, opts), version, 'valid accepts the long prerelease')
      t.equal(new SemVer(version, opts).version, version, 'SemVer preserves the prerelease')
      checkRange(t, `= \t ${version}`, version, version, opts)
      checkRange(t, `>= \t ${version} <= \n ${version}`,
        `>=${version} <=${version}`, version, opts)
      checkRange(t, `${version} - ${version}`, `>=${version} <=${version}`, version, opts)
    }
  }
  t.end()
})

test('build metadata respects version and range length limits', t => {
  const version = '1.2.3'
  const identifiers = [
    [longId, true],
    ['9'.repeat(MAX_SAFE_COMPONENT_LENGTH + 1), true],
    ['9'.repeat(MAX_SAFE_BUILD_LENGTH), true],
    ['9'.repeat(MAX_SAFE_BUILD_LENGTH + 1), true],
  ]

  for (const opts of options) {
    for (const [identifier, rangeValid] of identifiers) {
      const input = `${version}+${identifier}`
      if (input.length <= MAX_LENGTH) {
        t.equal(valid(input, opts), version, 'valid accepts metadata within the version limit')
        t.strictSame(new SemVer(input, opts).build, [identifier], 'SemVer preserves metadata')
      } else {
        t.equal(valid(input, opts), null, 'valid retains the version length limit')
        t.throws(() => new SemVer(input, opts), TypeError, 'SemVer retains the version length limit')
      }

      if (rangeValid) {
        checkRange(t, `= ${input}`, version, version, opts)
        checkRange(t, `>= ${input} <= ${input}`, `>=${version} <=${version}`, version, opts)
      } else {
        for (const range of [`= ${input}`, `>= ${input} <= ${input}`]) {
          t.throws(() => new Range(range, opts), TypeError, 'Range retains the version length limit')
          t.equal(validRange(range, opts), null, 'validRange retains the version length limit')
          t.notOk(satisfies(version, range, opts), 'satisfies rejects the overlong version')
          t.throws(() => minVersion(range, opts), TypeError, 'minVersion rejects the overlong version')
          t.equal(minSatisfying([version], range, opts), null, 'minSatisfying rejects')
          t.equal(maxSatisfying([version], range, opts), null, 'maxSatisfying rejects')
        }
      }
    }
  }
  t.end()
})

test('invalid version limits remain enforced', t => {
  const versions = [
    `1.2.3-${'9'.repeat(MAX_LENGTH - '1.2.3-'.length)}a`,
    `${MAX_SAFE_INTEGER + 1}.1.1`,
    `1.${MAX_SAFE_INTEGER + 1}.1`,
    `1.1.${MAX_SAFE_INTEGER + 1}`,
  ]

  for (const opts of options) {
    for (const version of versions) {
      const input = `= ${version}`
      t.equal(valid(version, opts), null, 'valid rejects the invalid version')
      t.throws(() => new SemVer(version, opts), TypeError, 'SemVer rejects the invalid version')
      t.throws(() => new Range(input, opts), TypeError, 'Range rejects the invalid version')
      t.equal(validRange(input, opts), null, 'validRange rejects the invalid version')
      t.notOk(satisfies('1.2.3', input, opts), 'satisfies rejects the invalid range')
      t.throws(() => minVersion(input, opts), TypeError, 'minVersion rejects the invalid range')
      t.equal(minSatisfying(['1.2.3'], input, opts), null, 'minSatisfying rejects the invalid range')
      t.equal(maxSatisfying(['1.2.3'], input, opts), null, 'maxSatisfying rejects the invalid range')
    }
  }
  t.end()
})
