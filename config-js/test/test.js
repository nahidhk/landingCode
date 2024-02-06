'use strict';
var assert = require('assert');
var Config = require('../index');

describe('Config()', function() {
    it('Should throw if pathToConfigFile is an empty string', function() {
        assert.throws(function() { new Config(''); });
    });
});

describe('Config()', function() {
    it('Should throw if pathToConfigFile is not a string', function() {
        assert.throws(function() { new Config(true); });
    });
});

describe('Config()', function() {
    it('Should throw if pathToConfigFile does not point to a file', function() {
        assert.throws(function() { new Config('/djdkd/djkdjddk'); });
    });
});

describe('get()', function() {
    var config = new Config('./test/cfg_example.js');
    it('Should retrieve values from the configuration file and default val', function() {
        assert.ok(config.get('server.port') === 4201);
        assert.ok(config.get('logging.name') === 'mush.js');

        // test default.js value add
        assert.ok(config.get('mush.name') === 'mush.js');
        //assert.ok(config.get('mush.defaultVal') === 'Hi default');
        assert.ok(config.get('defaultTest.working') === true);

        // test sep char arguement
        assert.ok(config.get('server/port', null, '/') === 4201);
        assert.ok(config.get('logging/name', null, '/') === 'mush.js');
    });

    it('Should retrieve values from the environment', function() {
        process.env.LOGGING_NAME = 'edmond.log';
        assert.ok(config.get('logging.name') === 'edmond.log');
        assert.ok(config.get('LOGGING.NAME') === 'edmond.log');
        assert.ok(config.get('LOGGING_NAME') === 'edmond.log');
        delete process.env.LOGGING_NAME;
    });

    it('Should throw when no value is available', function() {
        assert.throws(function() { config.get('blogging.name'); });
    });

    it('Should retrieve values from  with different sep chars', function() {
        // test default sep char method
        try {
            // should throw
            assert.ok(config.setSepChr() === false);
            assert.ok('should not reach here' === false);
        } catch(err) {
        }
        assert.ok(config.setSepChr('') === false);
        assert.ok(config.setSepChr('/') === true);
        assert.ok(config.get('server/port') === 4201);
        assert.ok(config.get('logging/name') === 'mush.js');
        assert.ok(config.setSepChr('.') === true);

        // test default value
        assert.ok(config.get('No.Such.Value.Exists', 511) === 511);
    });
});

describe('getByRegion()', function() {
    it('Should retrieve values from the configured region of the config file', function() {
        var config = new Config('./test/cfg_example2.js');
        assert.ok(config.getByRegion('welcome') === 'Welcome to this file.');
        assert.ok(config.get('en.welcome') === 'Welcome to this file.');

        config = new Config('./test/cfg_example2.js', 'de');
        assert.ok(config.getByRegion('welcome') === 'Willkommen zu dieser datei.');
        assert.ok(config.get('de.welcome') === 'Willkommen zu dieser datei.');

        config = new Config('./test/cfg_example2.js', 'es');
        assert.ok(config.getByRegion('welcome') === 'Bienvenidos a este archivo.');
        assert.ok(config.get('es.welcome') === 'Bienvenidos a este archivo.');
    });
});

describe('Config()', function() {
    it('Should subst \'##\' wth contents of NODE_ENV env var ', function() {
        var config;
        process.env.NODE_ENV = 'PRODUCTION';
        config = new Config('./test/cfg_example_##.js');
        assert.ok(config.get('production') === true);
    });
});
