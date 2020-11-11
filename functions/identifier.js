const { t, re } = require('../internal/re')
const identifier = (id) => {
  const withHyphen = `-${id}`
  const match = withHyphen.match(re[t.PRERELEASE])
  if (match && match[0] === withHyphen) {
    return id
  }
  return null
}
module.exports = identifier
