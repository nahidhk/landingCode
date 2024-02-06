
var assert = require('assert')
  , have = require('./have.js')
  , funcName = "";

have.assert(function(cond, msg) {
  assert(cond, 'inside function: ' + funcName + ', ' + msg);
});

have = (function(have_) {
  return function(args, schema) {
    funcName = args.callee.name;
    have_(args, schema);
    funcName = "";
  };
})(have);


function test() {
  have(arguments, { one: 'string' });
}

test(123);

