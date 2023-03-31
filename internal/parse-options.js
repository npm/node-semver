const var1 = Object.freeze({ includePrerelease: true, loose: true, rtl: true });
const var2 = Object.freeze({ includePrerelease: true, loose: true });
const var3 = Object.freeze({ includePrerelease: true, rtl: true });
const var4 = Object.freeze({ includePrerelease: true });
const var5 = Object.freeze({ loose: true, rtl: true });
const var6 = Object.freeze({ loose: true });
const var7 = Object.freeze({ rtl: true });
const emptyOpts = Object.freeze({});

const parseOptions = options => {
  if (!options) return emptyOpts;

  if (typeof options !== 'object') return var6;

  if (options.includePrerelease) {
    if (options.loose && options.rtl) {
      return var1;
    }

    if (options.loose) {
      return var2;
    }

    if (options.rtl) {
      return var3;
    }

    return var4;
  } else if (options.loose) {
    if (options.rtl) {
      return var5;
    }

    return var6;
  } else if (options.rtl) {
    return var7;
  } else {
    return emptyOpts;
  }
};
module.exports = parseOptions;
