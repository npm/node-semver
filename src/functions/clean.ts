import type { Options } from '../internal/parse-options.js'
import parse from './parse.js'

const clean = (version: string, options?: Options): string | null => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
export default clean
