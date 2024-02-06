
var assert = require('assert')
  , have = require('./have.js');


function withHave(id, arr, opts, callback) {
  var args = have(arguments,
    { id: 'str or num'
    , arr: 'str or str array'
    , opts: 'optional obj'
    , callback: 'func' });

  if (!(arr instanceof Array)) { arr = [arr]; }

  if (!args.opts) {
    opts = { x: 'some default value' };
    callback = args.callback;
  }

  // logic...
}


function withoutHave(id, arr, opts, callback) {
  assert(typeof id === 'string' || typeof id === 'number',
    'id argument not string or number');

  if (!(arr instanceof Array)) { arr = [arr]; }
  for (var i = 0; i < arr.length; i++) {
    assert(typeof arr[i] === 'string', 'arr member not a string');
  }

  if (typeof opts === 'function') {
    callback = opts;
    opts = { x: 'some default value' };
  }

  assert(!opts || typeof opts === 'object', 'options object not a hash');
  assert(typeof callback === 'function', 'callback missing or not a function');

  // logic...
}


test(withHave);
test(withoutHave);

function test(func) {
  // passes
  func('123', [], function() { });
  func('123', ['str'], { opts: 123 }, function() { });
  func(123, ['str'], function() { });

  // fails
  try { func(function() { }); } catch (e) { console.error(e); }
  try { func(123, 456); } catch (e) { console.error(e); }
  try { func(123, [456], function() { }); } catch (e) { console.error(e); }
}

