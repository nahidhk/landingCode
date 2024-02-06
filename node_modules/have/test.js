
// test.js - Test suites for have.js
(function() {

  var assert = require('chai').assert
    , filename = process.env.COVER ? './have-cov.js' : './have.js'
    , have = require(filename);

  var NON_ARRS = [null, undefined, 'str', 123, true, { }, function() { }]
    , NON_OBJS = [null, undefined, 'str', 123, true];

  var COMMON_TYPES = ['string', 'number', 'object', 'boolean', 'function']
    , FUNC = function() { };


  describe('HAVE module', function() {
    it('should exports a function', function() { assert.isFunction(have); });

    describe('configuration', function() {
      describe('assert() function', function() {
        it('should be exported', function() {
          assert.isFunction(have.assert);
        });

        it('should returns the native assert() function when called normally', function() {
          assert.equal(have.assert(), require('assert'));
        });

        it('should use given function as assert() replacement', function() {
          var called = false
            , spy = function() { called = true; };

          have.assert(spy);
          have([123], { one: 'string' });

          assert.isTrue(called);
          have.assert(require('assert'));
        });
      });
    });

    it('should throws if `args` argument does not looks like an array', function() {
      NON_ARRS.forEach(function(thing) {
        assert.throws(function() { have(thing); }, /arguments/i);
      });
    });
    // TODO: Check arguments object
    //
    it('should *not* throws if `args` is function `arguments`', function() {
      assert.doesNotThrow(function() {
        var func = function() { have(arguments, { }); };
        func.call(this);
      });
    });

    it('should throws if `schema` argument does not looks like an options hash or non empty array', function() {
      NON_OBJS.concat([[]]).forEach(function(thing) {
        assert.throws(function() { have([], thing); }, /schema/i);
      });
    });

    describe('with empty schema', function() {
      [ [[], {}]
      , [[], [{}]]
      , [[], [{}, {}]]
      , [[], [[{}], {}]]
      ].forEach(function (args) {
        it('should *not* throws', function() {
          assert.doesNotThrow(function() { have.apply(null, args); });
        });

        it('should *not* throws (strict mode)', function() {
          assert.doesNotThrow(function() { have.strict.apply(null, args); });
        });
      });
    }); // empty schema

    // templated tests
    function checkThrows(cases, strict) {
      for (var description in cases) (function(description, args) {
        it('should throws if ' + description, function() {
          assert.throws(function() {
            strict
              ? have.strict.call(this, args[0], args[1])
              : have.call(this, args[0], args[1]);
          }, args[2]);
        });
      })(description, cases[description]);
    }

    function checkNotThrows(cases, strict) {
      for (var description in cases) (function(description, args) {
        it('should *not* throws if ' + description, function() {
          assert.doesNotThrow(function() {
            strict
              ? have.strict.call(this, args[0], args[1])
              : have.call(this, args[0], args[1]);
          }, args[2]);
        });
      })(description, cases[description]);
    }

    function checkResult(cases, strict) {
      for (var description in cases) (function(description, args) {
        describe('resulting object when ' + description, function() {
          var result = strict
            ? have.strict.call(this, args[0], args[1])
            : have.call(this, args[0], args[1]);
          var expected = args[2];

          for (var key in expected) (function(key) {
            assert.strictEqual(result[key], expected[key])
          })(key);
        });
      })(description, cases[description]);
    }

    // schema tests
    describe('with basic schema', function() {
      var SCHEMA =
        { one   : 'string'
        , two   : 'number'
        , three : 'function'
        , four  : 'object'
        , five  : 'boolean' };

      checkThrows(
        { 'first argument is missing'          : [[], SCHEMA, /one/i]
        , 'second argument is missing'         : [['str'], SCHEMA, /two/i]
        , 'third argument is missing'          : [['str', 123], SCHEMA, /three/i]
        , 'fourth argument is missing'         : [['str', 123, FUNC], SCHEMA, /four/i]
        , 'fifth argument is missing'          : [['str', 123, FUNC, {}], SCHEMA, /five/i]
        , 'first argument is of invalid type'  : [[123], SCHEMA, /one/i]
        , 'second argument is of invalid type' : [['str', 'str'], SCHEMA, /two/i]
        , 'third argument is of invalid type'  : [['str', 123, 'str'], SCHEMA, /three/i]
        , 'fourth argument is of invalid type' : [['str', 123, FUNC, 123], SCHEMA, /four/i]
        , 'fifth argument is of invalid type'  : [['str', 123, FUNC, /rx/i, 123], SCHEMA, /five/i]
        });

      var args = ['str', 123, FUNC, { }, true]
        , result =
        { one   : args[0]
        , two   : args[1]
        , three : args[2]
        , four  : args[3]
        , five  : args[4] };

      checkNotThrows({ 'all arguments given correctly': [args, SCHEMA] });
      checkResult({ 'all given arguments': [args, SCHEMA, result]});
    }); // basic schema

    describe('with built-in types schema', function() {
      describe('RegExp type', function() {
        var SCHEMA = { one: 'regex' };

        checkThrows(
          { 'regex argument is missing'        : [[], SCHEMA, /one/i]
          , 'regex argument is *not* a RegExp' : [['123'], SCHEMA, /one/i]
          });

        var args = [new RegExp(), /test/i];

        checkNotThrows(
          { 'RegExp instance given as argument'            : [[args[0]], SCHEMA]
          , 'regular expression literal given as argument' : [[args[1]], SCHEMA]
          });

        checkResult(
          { 'RegExp argument' : [[args[0]], SCHEMA, { one: args[0]}]
          , 'RegExp literal'  : [[args[1]], SCHEMA, { one: args[1]}]
          });
      });

      describe('Date type', function() {
        var SCHEMA = { one: 'date' };

        checkThrows(
          { 'date argument is missing'               : [[], SCHEMA, /one/i]
          , 'date argument is *not* a Date instance' : [[{ }], SCHEMA, /one/i]
          , 'date argument is a string'              : [['' + new Date()], SCHEMA, /one/i]
          });

        var args = [new Date()]

        checkNotThrows({ 'date argument is given correctly': [args, SCHEMA] });
        checkResult({ 'date argument': [args, SCHEMA, { one: args[0] }] });
      });
    });

    describe('with array schema', function() {
      var SCHEMA = { arr: 'array' };

      checkThrows(
        { 'array argument is missing'        : [[], SCHEMA, /arr/i]
        , 'array argument is *not* an array' : [['str'], SCHEMA, /arr/i]
        });

      var args = [[123, 456]];

      checkNotThrows({ 'array argument given correctly': [args, SCHEMA] });
      checkResult({ 'array argument': [args, SCHEMA, { arr: args[0] }] });

      describe('with member type specified', function() {
        var SCHEMA = { nums: 'number array' };

        checkThrows(
          { 'array member is falsy'           : [[[null]], SCHEMA, /element/i]
          , 'array member is of invalid type' : [[['str']], SCHEMA, /nums/i]
          });

        checkNotThrows({ 'array argument with members given correctly': [args, SCHEMA] });
        checkResult({ 'array argument': [args, SCHEMA, { nums: args[0] }] });

      });
    }); // array schema

    describe('with OR argument schema', function() {
      var SCHEMA = { str: 'string or number' };

      checkThrows(
        { 'argument is missing or falsy'              : [[null], SCHEMA, /str/i]
        , 'argument is of neither the specified type' : [[FUNC], SCHEMA, /str/i]
        });

      checkNotThrows(
        { 'argument is of the first type': [['str'], SCHEMA]
        , 'argument is of the second type': [[123], SCHEMA]
        });

      checkResult(
        { 'string argument': [['str'], SCHEMA, { str: 'str' }]
        , 'number argument': [[123], SCHEMA, { str: 123 }]
        });

    }); // OR schema

    describe('with optional argument schema', function() {
      var SCHEMA =
        { str : 'string'
        , num : 'optional number'
        , cb  : 'function' };

      checkThrows(
        { 'arguments before the optional arg is missing'         : [[], SCHEMA, /str/i]
        , 'arguments after the optional arg is missing'          : [['str', 123], SCHEMA, /cb/i]
        , 'arguments before the optional arg is of invalid type' : [[123], SCHEMA, /str/i]
        , 'arguments after the optional arg is of invalid type'  : [['str', 123, 'str'], SCHEMA, /cb/i]
        });

      var cases =
        [ ['str', FUNC]
        , ['str', 123, FUNC]
        , ['str', null, FUNC]
        , ['str', undefined, FUNC]
        ];

      checkNotThrows(
        { 'optional argument omitted but other arguments are given correctly'        : [cases[0], SCHEMA]
        , 'optional arguments specified and all other arguments are given correctly' : [cases[1], SCHEMA]
        , 'optional argument is specified as `null`'                                 : [cases[2], SCHEMA]
        , 'optioanl argument is specified as `undefined`'                            : [cases[3], SCHEMA]
        });

      checkResult(
        { 'if optional argument omitted but other arguments are given correctly'        : [cases[0], SCHEMA, { str: cases[0][0], cb: cases[0][1]}]
        , 'if optional arguments specified and all other arguments are given correctly' : [cases[1], SCHEMA, { str: cases[1][0], num: cases[1][1], cb: cases[1][2]}]
        , 'if optional argument is specified as `null`'                                 : [cases[2], SCHEMA, { str: cases[2][0], num: cases[2][1], cb: cases[2][2]}]
        , 'if optional argument is specified as `undefined`'                            : [cases[3], SCHEMA, { str: cases[3][0], num: cases[3][1], cb: cases[3][2]}]
        });

    }); // optional arg schema

    describe('with complex schema', function() {
      describe('`string array or number array` type', function() {
        var SCHEMA = { arg: 'string array or number array' };

        it('should throws if non-array is given', function() {
          NON_ARRS.forEach(function(thing) {
            assert.throws(function() { have([thing], SCHEMA); }, /array/i);
          });
        });

        it('should throws if array given but element is of neither type', function() {
          assert.throws(function() { have([{ }], SCHEMA); }, /neither/i);
        });

        it('should *not* throws if element is of string type', function() {
          assert.doesNotThrow(function() { have([['string']], SCHEMA); });
        });

        it('should *not* throws if element is of number type', function() {
          assert.doesNotThrow(function() { have([[123]], SCHEMA); });
        });

      });

      describe('`opt num, str, opt str, str, opt num` type (ambiguous optionals)', function() {
        var SCHEMA =
          { one   : 'opt num'
          , two   : 'str'
          , three : 'opt str'
          , four  : 'str'
          , five  : 'opt num'
          , six   : 'opt str'
          };

        checkThrows(
          { 'nothing is given'            : [[], SCHEMA, /two/i]
          , 'a single argument is given'  : [['two'], SCHEMA, /four/i]
          , 'two numbers are given'       : [[123, 456], SCHEMA, /two/i]
          , 'two strings are given'       : [['str', 'abc'], SCHEMA, /four/i]
          , 'only the 3rd arg is omitted' : [[123, 'str', 'abc', 456, 'def'], SCHEMA, /four/i]
          });

        checkNotThrows(
          { 'three strings are given'              : [['str', 'abc', 'def'], SCHEMA]
          , 'a number and three strings are given' : [[123, 'a', 'b', 'c'], SCHEMA]
          , 'everything is given'                  : [[123, 'a', 'b', 'c', 456, 'd'], SCHEMA]
          });

        // WARN: explicit check for `undefined` is slippery, better to not rely on this.
        var results =
          [ { two: 'str', three: 'abc', four: 'def' }
          , { one: 123, two: 'a', three: 'b', four: 'c' }
          , { one: 123, two: 'a', three: 'b', four: 'c', five: undefined }
          , { two: 'a', three: 'b', four: 'c', five: 456 }
          , { one: 123, two: 'a', four: 'c', five: 456, six: 'd' }
          , { one: 123, two: 'a', three: 'b', four: 'c', five: 456, six: 'd' }
          ];

        checkResult(
          { 'three strings are given'                         : [['str', 'abc', 'def'], SCHEMA, results[0]]
          , 'a number and three strings are given'            : [[123, 'a', 'b', 'c'], SCHEMA, results[1]]
          , 'a number, three strings and undefined are given' : [[123, 'a', 'b', 'c', undefined], SCHEMA, results[2]]
          , 'undefined, three strings and number are given'   : [[undefined, 'a', 'b', 'c', 456], SCHEMA, results[3]]
          , 'only the 3rd argument is undefined'              : [[123, 'a', undefined, 'c', 456, 'd'], SCHEMA, results[4]]
          , 'everything is given'                             : [[123, 'a', 'b', 'c', 456, 'd'], SCHEMA, results[5]]
          });
      });

      // actually an invalid type but we're testing it to make sure nonetheless
      describe('`str or opt num` type (nested optional)', function() {
        var SCHEMA = { one: 'str or opt num' };

        checkNotThrows(
          { 'argument is given but of neither type' : [[{ }], SCHEMA]
          , 'string argument is given'              : [['str'], SCHEMA]
          , 'number argument is given'              : [[123], SCHEMA]
          });
      });

      describe('`str or num or arr or func` type (nested ORs)', function() {
        var SCHEMA = { one: 'str or num or arr or func' };

        checkNotThrows(
          { 'string is given'   : [['str'], SCHEMA]
          , 'number is given'   : [[123], SCHEMA]
          , 'array is given'    : [[[]], SCHEMA]
          , 'function is given' : [[FUNC], SCHEMA]
          });

        checkThrows({ 'object is given': [[{ }], SCHEMA] });
      });

      describe('`num arr arr arr` type (nested arrays)', function() {
        var SCHEMA = { one: 'num arr arr arr' };

        checkThrows(
          { 'non-array is given at first nesting level'  : [[[123]], SCHEMA, /one/i]
          , 'non-array is given at second nesting level' : [[[[123]]], SCHEMA, /one/i]
          });

        checkNotThrows(
          { 'an empty array is given'                : [[[]], SCHEMA]
          , 'a nested empty array is given'          : [[[[]]], SCHEMA]
          , 'deeply nested empty array is given'     : [[ [[[]]] ], SCHEMA]
          , 'multiple nested empty arrays are given' : [[ [], [[]], [[[]]], [[[[]]]] ], SCHEMA]
          , 'number array is given at correct depth' : [[ [[[123]]] ], SCHEMA]
          , 'multiple nested number arrays are given' : [[ [[[123], [456]], [[789]]] ], SCHEMA]
          })
      });
    }); // complex schema

    describe('with schema matchers variants', function () {
      var matchers =
          { 's|str|string'        : 'str'
          , 'n|num|number'        : 1
          , 'b|bool|boolean'      : true
          , 'f|fun|func|function' : function() {}
          , 'a|arr|array'         : []
          , 'o|obj|object'        : {}
          , 'r|rx|regex|regexp'   : /regex/
          , 'd|date'              : new Date
          , 'opt str|optional str': 'str'
          };

      for (var m in matchers) {
        var variants = m.split(/\|/);
        for (var v in variants) {
          var SCHEMA = { arg: variants[v] };
          var arg = matchers[m];
          checkResult({ 'given matcher variant': [[arg], SCHEMA, { arg: arg }] });
        }
      }

      checkThrows({ 'unknown matcher specified': [['str'], { arg: 'foo' }, /foo/i] });
    });

    describe('with "strict" mode', function () {
      var SCHEMA = { one: 'str', tow: 'num', three: 'opt str' };

      checkThrows(
        { 'wrong optional argument specified': [['str', 1, 777], SCHEMA, /777/i]
        , 'extra unnecessary argument specified': [['str', 1, 'str', 'extra'], SCHEMA, /extra/i]
        }, true);
    });

    describe('with schema list', function() {
      describe('in standard mode', function () {
        var SCHEMA =
          [ { one1: 'obj', tow1: 'opt bool' }
          , { one2: 'str', tow2: 'opt obj', three2: 'opt bool' }
          , { one3: 'str', tow3: 'opt str', three3: 'opt bool' }
          ];

        var obj = {};
        var date = new Date;

        checkThrows(
          { '[num] arguments not correspond to any schema in list': [[1], SCHEMA, /one1/i]
          });

        var cases =
            { '[str, str, boot] arguments correspond to third schema in list':
              [['str1', 'str2', true], SCHEMA, { one3: 'str1', tow3: 'str2', three3: true }]
            , '[str, obj, bool] arguments correspond to second schema in list':
              [['str1', obj, true], SCHEMA, { one2: 'str1', tow2: obj, three2: true }]
            , '[str, obj] arguments correspond to second schema in list':
              [['str1', obj], SCHEMA, { one2: 'str1', tow2: obj }]
            , '[str, date] arguments correspond to second schema in list':
              [['str1', date], SCHEMA, { one2: 'str1' }]
            };

        checkNotThrows(cases);
        checkResult(cases);
      });

      describe('in strict mode', function () {
        var SCHEMA =
          [ { one1: 'obj', tow1: 'opt bool' }
          , { one2: 'str', tow2: 'opt obj', three2: 'opt bool' }
          , { one3: 'str', tow3: 'opt str', three3: 'opt bool' }
          ];

        var obj = {};

        checkThrows(
          { '[num] arguments not correspond to any schema in list': [[1], SCHEMA, /one1/i]
          , '[str, num] arguments not correspond to any schema in list':
            [['str1', 555], SCHEMA, /\"555\"/i]
          , 'long string arguments not correspond to any schema in list':
            [['str1', 'str2', 'Whis string argument is longer when 15 simbols'], SCHEMA, /\"Whis string arg\.\.\"/i]
          }, true);

        var cases =
          { '[str, str, boot] arguments correspond to third schema in list':
            [['str1', 'str2', true], SCHEMA, { one3: 'str1', tow3: 'str2', three3: true }]
          , '[str, obj, bool] arguments correspond to second schema in list':
            [['str1', obj, true], SCHEMA, { one2: 'str1', tow2: obj, three2: true }]
          , '[str, obj] arguments correspond to second schema in list':
            [['str1', obj], SCHEMA, { one2: 'str1', tow2: obj }]
          };

        checkNotThrows(cases, true);
        checkResult(cases, true);
      })
    }); // schema list
  });

})();

