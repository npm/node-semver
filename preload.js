const modules = require('./internal/modules');
for (const [key, path, subkey] of modules) {
  const module = require(`./${path}`)
  exports[key] = subkey ? module[subkey] : module
}
