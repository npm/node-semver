import compare from './compare.js'
const gte = (a, b, loose) => compare(a, b, loose) >= 0
export default gte
