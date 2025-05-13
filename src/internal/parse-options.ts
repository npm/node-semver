// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({})

export interface Options {
  /**
   * Be more forgiving about not-quite-valid semver strings.
   *
   * (Any resulting output will always be 100% strict compliant, of course.)
   *
   * For backwards compatibility reasons, if the `options` argument is a boolean value
   * instead of an object, it is interpreted to be the `loose` param.
   * @default false
   */
  loose?: boolean
  /**
   * Set to suppress the [default behavior](https://github.com/npm/node-semver#prerelease-tags)
   * of excluding prerelease tagged versions from ranges unless they are explicitly opted into.
   *
   * @default false
   */
  includePrerelease?: boolean
  rtl?: boolean
}

export default (options: unknown): Options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
