import compare from './compare.js'
const lt = (a, b, loose) => compare(a, b, loose) < 0
export default lt