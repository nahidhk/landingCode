'use strict';
var assert = require('assert');
var propPath = require('./index');

describe('property-path', function() {

    var testObj = {
        a: 1,
        b: true,
        c: {
            d: {
                e: 'Hello',
                f: [ 1, 2, false, 'hi' ]
            }
        }
    };

    it('get should return the right value for a given path', function() {
        assert.equal(1, propPath.get(testObj, 'a'));
        assert.equal(true, propPath.get(testObj, 'b'));

        var obj2 = {
            d: {
                e: 'Hello',
                f: [ 1, 2, false, 'hi' ]
            }
        };

        assert.deepEqual(obj2, propPath.get(testObj, 'c'));
        assert.equal('Hello', propPath.get(testObj, 'c.d.e'));
        assert.equal(1, propPath.get(testObj, 'a', '/'));
        assert.equal(true, propPath.get(testObj, 'b', '/'));
        assert.deepEqual(obj2, propPath.get(testObj, 'c', '/'));
        assert.equal('Hello', propPath.get(testObj, 'c/d/e', '/'));
    });

    it('get should return undefined for invalid pathes', function() {
        assert.equal(undefined, propPath.get(testObj, 'c/d/e/x', '/'));
        assert.equal(undefined, propPath.get(testObj, '////////x', '/'));
        assert.equal(undefined, propPath.get(testObj, 'xxx', '/'));
    });

    it('get should return the object given for root path', function() {
        assert.deepEqual(testObj, propPath.get(testObj, '', '/'));
        assert.deepEqual(testObj, propPath.get(testObj, '', '///'));
        // empty string is a root path
        assert.deepEqual(testObj, propPath.get(testObj, '', ''));
        assert.deepEqual(testObj, propPath.get(testObj, ''));
        assert.deepEqual(testObj, propPath.get(testObj, '', '/'));
    });

    it('get should handle duplicated separators in pathes', function() {
        // no path should be the root
        // should ignore duplicated separators
        assert.deepEqual('Hello', propPath.get(testObj, '///c//d///e///', '/'));

    });

    it('set should modify the right property for a given path', function() {
        propPath.set(testObj, 'a', 2);
        assert.equal(2, testObj.a);
        assert.equal(3, propPath.set(testObj, 'a', 3));
        assert.equal(3, testObj.a);

        propPath.set(testObj, 'c.d.e', 'Greetings');
        assert.equal(testObj.c.d.e, 'Greetings');

        propPath.set(testObj, 'a', 2, '/');
        assert.equal(2, testObj.a);
        assert.equal(3, propPath.set(testObj, 'a', 3));
        assert.equal(3, testObj.a);

        propPath.set(testObj, 'c/d/e', 'Greetings', '/');
        assert.equal(testObj.c.d.e, 'Greetings');

        assert.equal(333, propPath.set(testObj, 'c/d/f/0', 333, '/'));
        assert.equal(333, testObj.c.d.f[0]);
    });

    it('set return undefined for invalid pathes and change nothing', function() {
        assert.deepEqual(undefined, propPath.set(testObj, 'x/x/x', 'xxx', '/'));
        assert.deepEqual(undefined, propPath.set(testObj, '111728278/ksl/skl', 'xxx', '/'));
    });

    it('set should correctly handle leading and trailing separators', function() {

        var obj2 = {
            d: {
                e: 'Hello',
                f: [ 1, 2, false, 'hi' ]
            }
        };

        assert.deepEqual(2, propPath.set(obj2, '....a', 2));
        assert.deepEqual(obj2.a, 2);

        assert.deepEqual(5, propPath.set(obj2, '////a', 5, '/'));
        assert.deepEqual(obj2.a, 5);

        assert.deepEqual(4, propPath.set(obj2, 'g....', 4));
        assert.deepEqual(obj2.g, 4);

        assert.deepEqual(6, propPath.set(obj2, 'g////', 6, '/'));
        assert.deepEqual(obj2.g, 6);
    });

    it('setSepChar should allow setting of default sep char', function() {
        var obj = {
            d: {
                e: 'Hello',
                f: [ 1, 2, false, 'hi' ]
            }
        };

        assert.ok(true === propPath.setSepChar('-'));
        assert.deepEqual('hi', propPath.get(obj, 'd-f-3'));
        assert.deepEqual('hi', propPath.get(obj, 'd/f/3', '/'));
    });
});
