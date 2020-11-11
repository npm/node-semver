const {t, src} = require('../internal/re')
const identifier = (version) => {
    const split = version.split('\.');
    const valid = split.every(part => new RegExp(`^${src[t.PRERELEASEIDENTIFIER]}$`).test(part));
    if (!valid) {
        return null;
    }
    return version;
}
module.exports = identifier
