import { test } from '@japa/runner'
import * as classes from '../../src/classes/index.js'

test('export all classes at semver/classes', ({ assert }) => {
  assert.anyProperties(
    classes,
    {
      SemVer: true,
      Range: true,
      Comparator: true,
    },
    'export all classes at semver/classes'
  )
})
