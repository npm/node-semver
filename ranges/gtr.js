// Determine if version is greater than all the versions possible in the range.
import outside from './outside.js'
const gtr = (version, range, options) => outside(version, range, '>', options)
export default gtr