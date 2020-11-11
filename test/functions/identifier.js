const {test} = require('tap')
const identifier = require('../../functions/identifier.js')

test('identifier tests', t => {
    t.equal(identifier('hotfix-410'), 'hotfix-410')
    t.equal(identifier('hotfix/410'), null)
    t.equal(identifier('123.123.123'), '123.123.123')
    t.equal(identifier('007.james.bond'), null)
    t.end()
})
