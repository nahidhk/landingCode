/*!
 * A very simple configuration utility, that uses a JavaScript file as a
* config. The '.js' file must have the config data in module.exports, e.g.:
 *
 * module.exports = {
 *     region : 'US',
 *     port : 4201,
 *     [...]
 * };
 */
'use strict';

module.exports = Config;

var assert = require('assert');
var is = require('is2');
var fs = require('fs');
var path = require('path');
var have = require('have');
var makeObjConst = require('const-obj').makeObjConst;
var propPath = require('property-path');
var defaultSepChr = '.';
var debug = require('debug')('config-js');
var merge = require('lodash.merge');
var util = require('util');

/**
 * Config provides a simple read-only API to a configuration object.
 * @param {String} pathToConfigFile The configuration file
 * @param {String} [region] Optional indicator for the current region, e.g. 'en'
 */
function Config(pathToConfigFileIn, region) {
    have(arguments, {pathToConfigFile: 'str', region: 'opt str' });
    debug('pathToConfigFileIn: '+pathToConfigFileIn);

    // if the path has '##' and process.env.NODE_ENV is a non-empty string,
    // replace '##' with the contents of process.env.NODE_ENV
    var pathToConfigFile = pathToConfigFileIn;
    var idx = pathToConfigFileIn.indexOf('##');
    if (idx > -1 && is.nonEmptyStr(process.env.NODE_ENV)) {
        pathToConfigFile = pathToConfigFileIn.substr(0, idx) +
            process.env.NODE_ENV + pathToConfigFileIn.substr(idx+2);
    }

    // complimentary to have arg checking
    if (!is.nonEmptyStr(pathToConfigFile))
        throw new Error('Bad path to config file: '+pathToConfigFile);
    if (!fs.existsSync(pathToConfigFile))
        throw new Error('Config file is missing: '+pathToConfigFile);
    if (is.defined(region))  assert.ok(is.nonEmptyStr(region));

    // english is the default
    if (is.undefined(region)) region = 'en';

    debug('## sub: pathToConfigFileIn: '+pathToConfigFileIn);
    this.pathToDefaults = path.join(path.dirname(pathToConfigFileIn),
                                    'defaults.js');
    this.pathToConfigFile = pathToConfigFile;
    debug('region: '+region);
    this.region = region;
    var self = this;
    debug('pathToDeafults: '+this.pathToDefaults);

    // set a watch for when the file changes, to reload the file.
    fs.watchFile(this.pathToConfigFile, {persistent: false}, function () {
        self.loadConfig(self.pathToDefaults, self.pathToConfigFile, self.region);
    });

    // we can't wait for the file to change to re-load, so we load it now
    this.loadConfig(self.pathToDefaults, self.pathToConfigFile, self.region);
    var util = require('util');
    debug('Config: '+util.inspect(this.configObj));
}

/**
 * Set the default separator character used for property strings.
 * @param {String} chr The new default character to separate properties in the path string.
 */
Config.prototype.setSepChr = function(chr) {
    have(arguments, {chr: 'str'});
    if (is.nonEmptyStr(chr)) {
        defaultSepChr = chr;
        return true;
    }
    return false;
};

/**
 * Loads the configuration from the location specified by the parameter.
 * @param {string} pathToConfigFile The file name path to the configuration file.
 * @return {Boolean} true if the new default character was set and false otherwise.
 */
Config.prototype.loadConfig = function(pathToDefaults, pathToConfigFile) {
    have(arguments, {pathToDefaults: 'str', pathToConfigFile: 'str'});

    assert.ok(is.nonEmptyStr(pathToDefaults));
    assert.ok(is.nonEmptyStr(pathToConfigFile));
    assert.ok(fs.existsSync(pathToConfigFile));
    pathToDefaults = path.resolve(pathToDefaults);
    pathToConfigFile = path.resolve(pathToConfigFile);

    var defaults = {};
    if (fs.existsSync(pathToDefaults)) {
        debug('defaults file found: '+pathToDefaults);
        // if present, remove the defaults
        if (require.cache[pathToDefaults])
            delete require.cache[pathToDefaults];
        try {
            defaults = require(pathToDefaults);
            debug('defaults file required');
        } catch(err) {
            // do nothing on purpose - it just a default
            debug('Could not load default config: "'+pathToConfigFile+'"');
        }
    } else {
        debug('defaults file NOT found: '+pathToDefaults);
    }
    debug('defaults object: ',util.inspect(defaults, {depth: null}));
    // Now defaults is either a JS object with config or empty

    // now remove, if present, the target config
    if (require.cache[pathToConfigFile])
        delete require.cache[pathToConfigFile];

    var targetConfig = {};
    try {
        targetConfig = require(pathToConfigFile);
        debug('Required config: '+pathToConfigFile);
    } catch(err) {
        debug('Could not load target config: "'+pathToConfigFile+'"');
    }
    debug('config object: ',util.inspect(targetConfig, {depth: null}));

    // now overwrite defaults with target config
    this.configObj = merge(defaults, targetConfig);
    if (!this.region && this.configObj && this.configObj.region)
        this.region = this.configObj.region;
    debug('resulting config: ',util.inspect(this.configObj, {depth: null}));

    makeObjConst(this.configObj);
};

/**
 * Return the value associated with the specified property. If no such property is
 * found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.
 *
 * @param {string} propertyName The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param {string} defaultValue A default value to use in case no property having propertyName was found.
 * @return The value found, if no value is found, then the default value. If there is no default value then undefined.
 */
Config.prototype.get = function(propertyName, defaultValue, sep) {
    have(arguments, {propertyName: 'str', sep: 'opt str'});
    debug('config.get of '+propertyName+', def='+defaultValue+', sep='+sep);

    assert.ok(is.nonEmptyStr(propertyName));
    if (!is.nonEmptyStr(sep))  sep = defaultSepChr;

    if (!is.nonEmptyString(propertyName))
        return defaultValue || null;

    // Try to get value from environemnt first
    // We convert name to upper case and if '.' is used as a sep char,
    // replace with "_", so 'logging.name' becomes "LOGGING_NAME"
    var envPropName;
    if (sep === '.')
        envPropName = propertyName.replace(/\./g, '_');
    else
        envPropName = propertyName.replace(new RegExp(sep, 'g'), '_');

    if (!is.nonEmptyStr(envPropName)) {
        debug('Could not remove "."s from '+ propertyName);
    } else {
        envPropName = envPropName.toUpperCase();
    }

    var fromEnv = false;
    var envStr;
    if (process.env[envPropName]) {
        fromEnv = true;
        envStr = process.env[envPropName];
        debug('Propery '+envPropName+' found in environment: '+process.env[envPropName]);
    }

    var currVal = propPath.get(this.configObj, propertyName, sep);
    var isValid = ('undefined'!==typeof currVal && null!==currVal);

    // invalid value found and no default value, then we throw an error
    if (!isValid && typeof defaultValue === 'undefined' && !fromEnv) {
        debug('Var statuses ','!isValid',!isValid,'typeof defaultValue',
              typeof defaultValue, '!fromEnv',!fromEnv);
        throw new Error('No config value found for: '+propertyName);
    }

    // either return found value or default
    if (!fromEnv) {
        debug('Propery '+envPropName+' gotten from config file: ',(isValid ? currVal : defaultValue));
        return isValid ? currVal : defaultValue;
    } else {
        debug('Attempting to coercion checks.');
        if (is.num(currVal)) {
            debug('Coercing env '+envPropName+' to a numeric.');
            return Number(envStr);
        } else if (is.array(currVal)) {
            debug('Coercing env '+envPropName+' to an array.');
            if (/^\[(.)*\]$/.match(envStr)) {
                envStr = envStr.substr(1);  // remove '['
                envStr = envStr.substring(0, envStr.length-1);
                var elems = envStr.split(',');
                for (var i=0; i<currVal.length; i++) {
                    if (typeof currVal[i] === 'number')
                        elems[i] = Number(elems[i]);
                }
                return elems;
            }
            debug('No coercion done '+envPropName+': '+envStr);
        }
        return envStr;
    }
};

/**
 * Return the region-specific value associated with the specified property. If no such property
 * is found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.  The region should be provided in the constructor to this object.
 * If no region was specified when this object was created, the defaultValue will be returned.
 *
 * @param {String} propertyName The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param {String} defaultValue A default value to use in case no property having propertyName was found.
 * @return The value found, if no value is found, then the default value. If there is no default value, then undefined.
 */
Config.prototype.getByRegion = function(propertyName, defaultValue, sep) {
    have(arguments, {propertyName: 'str', sep: 'opt str'});

    assert.ok(is.nonEmptyStr(propertyName));
    if (this.region === undefined || propertyName === undefined)
        return defaultValue;

    propertyName = this.region + '.' + propertyName;
    return this.get(propertyName, defaultValue, sep);
};
