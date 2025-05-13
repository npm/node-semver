/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-empty-function */
const debug =
  typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)
    ? (...args: unknown[]) => console.error('SEMVER', ...args)
    : () => {}

export default debug
