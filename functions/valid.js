import parse from './parse.js'
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
export default valid
