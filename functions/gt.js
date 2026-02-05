import compare from './compare.js'
const gt = (a, b, loose) => compare(a, b, loose) > 0
export default gt