# Introduction
A simple node.js module that recursively iterates over an object and makes the
properties read-only. This is useful for values in objects that are never to
change.

In the past, if you set a constant property, the assignment silently failed.
Now, assignments to constant properties throw exceptions.

# Installation

    $ npm install const-obj

# API

The following are exported from the const-obj module:

  - [makeObjConst()](#makeobjconstobjobject)
  - [makePropConst()](#makepropconstobjectobjectpropertystring)

## makeObjConst(obj)
Recursively makes each property in the object and its sub-objects immutable.
This function returns the object upon success and false upon failure.

## makePropConst(obj, property)
Make a property immutable (assuring it cannot be changed from the current
value).  This operation cannot be un-done. This function returns the object on
success and false on any failure.

# Examples

    var assert = require('assert');
    var makeObjConst = require('const-obj').makeObjConst;
    var obj = {
        a: 111,
        b: '222',
        c: { d: 333 } };
    makeObjConst(obj);

    try {
        obj.a = 222;            // this will throw
    } catch (err) {
        assert.ok(err.message === 'Cannot assign to read only property \'a\' of #<Object>');
    }
    assert.ok(obj.a === 111);

The above code will throw because the values cannot be changed.

        var makePropConst = require('const-obj').makePropConst;
        var obj = { alpha: '0', beta: false };
        makePropConst(obj, 'alpha');

        try {
            obj.alpha = 678;
        } catch(err) {
            assert.ok(err.message === 'Cannot assign to read only property \'alpha\' of #<Object>');
        }
        assert.ok(obj.alpha === '0');

        obj.beta = true;
        assert.ok(obj.beta === true);

The above code will throw because the property is constant and cannot be
changed.

# License
[The MIT License (MIT)](http://opensource.org/licenses/MIT/ "MIT License webpage")

Copyright (c) 2013,2014 Edmond Meinfelder

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
