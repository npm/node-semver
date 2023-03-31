const parseOptions = options => {
  if (!options) return {};

  if (typeof options !== 'object') return { loose: true };

  const parsedOptions = {};

  // parse out just the options we care about so we always get a consistent
  // obj with keys in a consistent order.

  if (options.includePrerelease) parsedOptions.includePrerelease = true;
  if (options.loose) parsedOptions.loose = true;
  if (options.rtl) parsedOptions.rtl = true;

  return parsedOptions;
};
module.exports = parseOptions;
