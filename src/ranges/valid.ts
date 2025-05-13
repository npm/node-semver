import type { Options } from '../internal/parse-options.js'
import type Comparator from '../classes/comparator.js'
import Range from '../classes/range.js'

export default (range: Range | Comparator | string, options?: Options | boolean) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch {
    return null
  }
}
