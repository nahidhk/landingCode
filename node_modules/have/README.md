
[![Build Status](https://travis-ci.org/chakrit/have.png?branch=master)](https://travis-ci.org/chakrit/have)

# HAVE.js

Have your arguments, and validate it too:

```js
var have = require('have');

function safeFunc(id, options, callback) {
  have(arguments,
    { id       : 'string or number'
    , options  : 'optional object'
    , callback : 'function'
    });
}
```

HAVE.js gives you a mini-DSL to quickly validate your function arguments.

# MINI-DSL

In order of precedence:

* `opt X|optional X` - Optional X
* `X or Y` - Either X or Y
* `X a|X arr|x array` - Array of X
* `s|str|string` - String
* `n|num|number` - Number
* `b|bool|boolean` - Boolean
* `f|fun|func|function` - Function
* `a|arr|array` - Array
* `o|obj|object` - Object
* `r|rx|regex|regexp` - RegExp
* `d|date` - Date

These matchers can be combined. These are all valid HAVE.js matchers:

* `str or num array` - String or Array of Number
* `num arr or str arr` - Array of Number or Array of String
* `num a a a a` - Array of Array of Array of Array of Number
* `opt str or num array` - Optional (String or Array of Number)

Have fun!

# PARSED ARGUMENTS

The HAVE.js function also returns any parsed argument collected in a hash keyed to the
same key as was given in the schema. You can inspect the returned object to more easily
obtain the parsed value without having to duplicate the HAVE.js parsing logic in your code
to extract them.

```js
var have = require('have');

function safeFunc(id, options, callback) {
  var args = have(arguments,
    { id       : 'string or number'
    , options  : 'optional object'
    , callback : 'function'
    });
  
  options = args.options || { some: 'value' };
  
  // some stuff
  someDb.loadById(args.id, options, args.callback);
};
```

For a more careful argument names parsing you can pass several schema.

```js
var have = require('have');

function safeFunc() {
  var args = have(arguments,
    [ { id       : 'string or number'
      , options  : 'optional object'
      , callback : 'function'
      }
    , { query    : 'object'
      , options  : 'optional object'
      , callback : 'function'
      }
    ]);
  
  var options = args.options || { some: 'value' };
  
  // some stuff
  if (args.id) {
    someDb.loadById(args.id, options, args.callback);
  } else {
    someDb.find(args.query, options, args.callback);    
  }
};
```

And use "strict" mode to fail for those extra arguments that do not match the schema.

```js
var have = require('have');

function safeFunc(id, options, callback) {
  var args = have.strict(arguments,
    { id       : 'string or number'
    , options  : 'optional object'
    , callback : 'function'
    });
  
  // some stuff
};

// This throws an AssertionError: Wrong argument "foo"
safeFunc('id', { key: 'value' }, cb, 'foo') 
```

# SOFT ASSERTS

If you are like me and you write a lot of method preconditions that should be turned off
or atleast, should *not* throws in production, you can replace HAVE.js assert function
like so:

```js
var have = require('have');

have.assert(function(cond, message) {
  if (!cond) {
    console.log('WARN: assertion failed: ' + message);
  }
});
```

This will replace the `assert` function HAVE.js uses internally with your implementation
so if you want to completely turns assertion off, then just give it a no-op function.

# SHORTERs

For those who like it short, the above example can also be written like this:

```js
var have = require('have');

function safeFunc(id, options, callback) {
  have(arguments, { id: 's or n', options: 'opt o', callback: 'f' });
}
```

This is not very readable, of course. But HAVE.js does not dictate your readability
preference for you. So go wild if you think it is ok : )

# LICENSE

BSD (if you don't like BSD, just contact me)

# CHANGELOG

#### v0.3.0

* (credit: @wmakeev) The function now returns parsed arguments as a hash object.

#### v0.2.3

* Adds the forgotten `boolean` support.

#### v0.2.1 - v0.2.2

* Eat `null` and `undefined` where optional argument is expected.

# SUPPORT / CONTRIBUTE

Test with `npm test` or `make test`.

Just open a [new GitHub issue](https://github.com/chakrit/have/issues/new) or ping me
[@chakrit](https://twitter.com/chakrit) on Twitter.

Pull requests and feature suggestions totally welcome.

```
    40	Chakrit Wichian
     2	Makeev Vitaliy
     1	Edmond Meinfelder
```
