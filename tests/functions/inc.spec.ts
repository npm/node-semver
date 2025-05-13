import { test } from '@japa/runner'
import inc from '../../src/functions/inc.js'
import type { Options } from '../../src/internal/parse-options.js'
import parse from '../../src/functions/parse.js'
import increments from '../fixtures/increments.js'

test.group('increment versions test', () => {
  test('increment versions')
    .with(increments)
    .run(({ assert }, [pre, what, wanted, options, id, base]) => {
      const found = inc(pre, what, options as Options, id, base)
      const cmd = `inc(${pre}, ${what}, ${id}, ${base})`
      assert.strictEqual(found, wanted, `${cmd} === ${wanted}`)

      const parsed = parse(pre, options)!
      const parsedAsInput = parse(pre, options)!

      if (wanted) {
        // Increment using the parsed object
        parsed.inc(what, id, base)
        assert.strictEqual(parsed.version, wanted, `${cmd} object version updated`)

        if (parsed.build.length) {
          assert.strictEqual(
            parsed.raw,
            `${wanted}+${parsed.build.join('.')}`,
            `${cmd} object raw field updated with build`
          )
        } else {
          assert.strictEqual(parsed.raw, wanted, `${cmd} object raw field updated`)
        }

        // Ensure the input object is not modified
        const preIncObject = JSON.stringify(parsedAsInput)
        inc(parsedAsInput, what, options as Options, id, base)
        const postIncObject = JSON.stringify(parsedAsInput)
        assert.strictEqual(postIncObject, preIncObject, `${cmd} didn't modify its input`)
      } else if (parsed) {
        // Ensure increment throws for invalid cases
        assert.throws(() => {
          parsed.inc(what, id, base)
        })
      } else {
        assert.isNull(parsed, `${cmd} parsed result should be null`)
      }
    })
})
