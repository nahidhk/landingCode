'use strict';
var assert = require('assert');
var makeObjConst = require('./index').makeObjConst;
var makePropConst = require('./index').makePropConst;

describe('makeObjConst()', function() {
    it('Should make an object\'s properties constant.', function() {
        var obj = {
            a: 111,
            b: '222',
            c: { d: 333 }
        };

        // make the object properties constant
        makeObjConst(obj);

        try {
            obj.a = 222;            // this will throw
        } catch (err) {
            assert.ok(err.message === 'Cannot assign to read only property \'a\' of #<Object>');
        }
        assert.ok(obj.a === 111);

        try {
            obj.b = 'Hmm';              // this will throw
        } catch (err) {
            assert.ok(err.message === 'Cannot assign to read only property \'b\' of #<Object>');
        }
        assert.ok(obj.b === '222');

        try {
            obj.c.d = true;
        } catch(err) {
            assert.ok(err.message === 'Cannot assign to read only property \'d\' of #<Object>');
        }
        assert.ok(obj.c.d === 333);
    });
});

describe('makePropConst()', function() {
    it('Should make a single property constant.', function() {
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
    });
});
