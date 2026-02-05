import compare from './compare.js'
const lte = (a, b, loose) => compare(a, b, loose) <= 0
export default lte
