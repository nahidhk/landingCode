
// have.js - Main have.js exports
module.exports = (function(undefined) {

  var assert = require('assert')
    , log    = function() { } // require('util').log; // disabled
    ;

  var ARR_RX = /^(.+) a(rr(ay)?)?$/i
    , OR_RX  = /^(.+) or (.+)$/i
    , OPT_RX = /^opt(ional)? (.+)$/i;

  // core recursive check
  function ensure(argName, argType, value, check) {
    var memberType = null
      , valid      = true
      , reason     = null
      , match      = null
      , i          = 0;

    function softAssert(cond, reason_) { if (!(valid = cond)) reason = reason_; }
    function logMatch() { log(match[0]); }

    if (match = argType.match(OPT_RX)) {
      logMatch();
      memberType = match[2];

      ensure(argName, memberType, value, softAssert);

      // optional is consumed if it match or a null/undefined is given.
      return valid ||
        value === null ||
        value === undefined;
    }

    if (match = argType.match(OR_RX)) {
      logMatch();
      memberType = match[1];
      ensure(argName, memberType, value, softAssert);

      if (valid) return true;
      valid = true; // reset previous softAssert

      memberType = match[2];
      ensure(argName, memberType, value, softAssert);

      check(valid, argName + " argument is neither a " + match[1] + " nor " + match[2]);
      return true;
    }

    if (match = argType.match(ARR_RX)) {
      logMatch();
      ensure(argName, 'array', value, softAssert);

      if (!valid) {
        check(false, reason);
        return false;
      }

      memberType = match[1];
      for (i = 0; i < value.length; i++) {
        ensure(argName, memberType, value[i], softAssert);

        if (!valid) {
          check(false, argName + " element is falsy or not a " + memberType);
          return false;
        }
      }

      return true;
    }

    // atom types
    log(argType);
    switch(argType) {

      // basic types
      case 's': case 'str': case 'string':
        valid = typeof value === 'string'; break;

      case 'n': case 'num': case 'number':
        valid = typeof value === 'number'; break;

      case 'b': case 'bool': case 'boolean':
        valid = typeof value === 'boolean'; break;

      case 'f': case 'fun': case 'func': case 'function':
        valid = typeof value === 'function'; break;

      case 'a': case 'arr': case 'array':
        valid = value instanceof Array; break;

      case 'o': case 'obj': case 'object':
        valid = value && typeof value === 'object'; break;

      // built-in types
      case 'r': case 'rx': case 'regex': case 'regexp':
        valid = value && value instanceof RegExp; break;

      case 'd': case 'date': // TODO: case 't': case 'time': case 'datetime': // ?
        valid = value && value instanceof Date; break;

      default:
        valid = false; break;
    }

    check(valid, argName + " argument is not " + argType);
    return true;
  }

  function ensureArgs(args, schema, strict) {
    if (!(args && typeof args === 'object' && 'length' in args))
      throw new Error('have() called with invalid arguments list');
    if (!(schema && typeof schema === 'object'))
      throw new Error('have() called with invalid schema object');

    var ensureResults = []
      , parsedArgs = {}
      , argIndex = 0
      , fail = null
      , i;

    if (schema instanceof Array) {
      if (!schema.length)
        throw new Error('have() called with empty schema list');

      for (i = 0, len = schema.length; i < len; i++) {
        ensureResults[i] = ensureArgs(args, schema[i], strict);
      }

      ensureResults.sort(function (a, b) {
        if (a.argIndex > b.argIndex) return -1;
        if (a.argIndex < b.argIndex) return 1;
        return 0
      });

      for (i = 0; i < ensureResults.length; i++) {
        if (!ensureResults[i].fail) return ensureResults[i];
      }

      return ensureResults[0];
    } else {
      for (var argName in schema) {
        if (schema.hasOwnProperty(argName)) {
          var ensured = ensure(argName, schema[argName], args[argIndex], function (cond, fail_) {
            if (!cond) fail = fail_;
          });
          if (fail) break;
          if (ensured) {
            parsedArgs[argName] = args[argIndex];
            argIndex++;
          }
        }
      }

      if (strict && !fail && argIndex < args.length) {
        var argStr = args[argIndex].toString();
        fail = 'Wrong argument "' + (argStr.length > 15 ? argStr.substring(0, 15) + '..' : argStr) + '"';
      }

      return {
        fail: fail,
        parsedArgs: parsedArgs,
        argIndex: argIndex
      }
    }
  }

  // exports
  function have(args, schema, strict) {
    var res = ensureArgs(args, schema, strict);
    assert(!res.fail, res.fail);
    return res.parsedArgs;
  }

  // configuration
  have.assert = function(assert_) {
    return (assert_ === undefined) ? assert : (assert = assert_);
  };

  have.strict = function(args, schema) {
    return have(args, schema, true);
  };

  return have;

})();

