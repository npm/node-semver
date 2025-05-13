import type { Options } from '../internal/parse-options.js'
import type Comparator from '../classes/comparator.js'
import Range from '../classes/range.js'

// Mostly just for testing and legacy API reasons
export default (range: Range | Comparator | string, options?: Options | boolean) =>
  new Range(range, options).set.map((comp) =>
    comp
      .map((c) => c.value)
      .join(' ')
      .trim()
      .split(' ')
  )
