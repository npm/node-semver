var eq = require('./eq');
var neq = require('./neq');
var gt = require('./gt');
var gte = require('./gte');
var lt = require('./lt');
var lte = require('./lte');

module.exports = function cmp (a, op, b, loose) {
    switch (op) {
      case '===':
        if (typeof a === 'object')
          a = a.version
        if (typeof b === 'object')
          b = b.version
        return a === b
  
      case '!==':
        if (typeof a === 'object')
          a = a.version
        if (typeof b === 'object')
          b = b.version
        return a !== b
  
      case '':
      case '=':
      case '==':
        return eq(a, b, loose)
  
      case '!=':
        return neq(a, b, loose)
  
      case '>':
        return gt(a, b, loose)
  
      case '>=':
        return gte(a, b, loose)
  
      case '<':
        return lt(a, b, loose)
  
      case '<=':
        return lte(a, b, loose)
  
      default:
        throw new TypeError('Invalid operator: ' + op)
    }
  }