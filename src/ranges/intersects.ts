import Range from '../classes/range.js'
import type { Options } from '../internal/parse-options.js'
import type Comparator from '../classes/comparator.js'

export default (
  r1: Range | Comparator | string,
  r2: Range | Comparator | string,
  options?: Options | boolean
): boolean => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
