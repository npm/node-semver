const modules = require('./internal/modules');
const lrCache = {}
const lazyRequire = (path, subkey) => {
  const module = lrCache[path] || (lrCache[path] = require(path))
  return subkey ? module[subkey] : module
}

const lazyExport = (key, path, subkey) => {
  Object.defineProperty(exports, key, {
    get: () => {
      const res = lazyRequire(path, subkey)
      Object.defineProperty(exports, key, {
        value: res,
        enumerable: true,
        configurable: true
      })
      return res
    },
    configurable: true,
    enumerable: true
  })
}

for (const [key, path, subkey] of modules) {
  lazyExport(key, `./${path}`, subkey)
}
