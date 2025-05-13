import SemVer from '../classes/semver.js'
import parse from './parse.js'
import { safeRe as re, t } from '../internal/re.js'
import type { Options } from '../internal/parse-options.js'

/**
 * Coerces a value to a SemVer object if possible.
 *
 * Attempts to convert the input `version` into a valid `SemVer` object. It handles
 * various input types, including strings, numbers, and existing `SemVer` objects.
 * If the input cannot be coerced, it returns `null`.
 *
 * @param version The value to coerce into a `SemVer` object.
 *   If a `SemVer` object is passed, it is returned directly. If a number is passed,
 *   it is converted to a string before coercion. If a string is passed, it is
 *   parsed and coerced according to the provided options.
 * @param options Options to control the coercion process.
 *   See the documentation for `parseOptions` for details on available options.
 * @returns A `SemVer` object representing the coerced version, or
 *   `null` if coercion fails.
 */
export default (version: SemVer | string | number, options: Options = {}): SemVer | null => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  let match = null
  if (!options.rtl) {
    match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL]
    let next: RegExpExecArray | null
    while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
      if (!match || next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    coerceRtlRegex.lastIndex = -1
  }

  if (match === null) {
    return null
  }

  const major = match[2]
  const minor = match[3] || '0'
  const patch = match[4] || '0'
  const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : ''
  const build = options.includePrerelease && match[6] ? `+${match[6]}` : ''

  return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options)
}
