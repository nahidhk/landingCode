/**
 * @fileOverview
 * Get and set a properties by a path with optional separator character.
 */
'use strict';

module.exports = {
    getChild: getChild,
    getParentPath: getParentPath,
    get: get,
    set: set,
    remove: remove,
    setSepChar: setSepChar
};

var is = require('is2');
var filter = require('lodash.filter');
var defaultSepChar = '.';       // global separator character, default is '.'

/**
 * Allows you to change the default separator character from '.' to whatever
 * you want.
 * @param {String} chr The separator character to use to separate path parts.
 * @return {Boolean} true if the separator character was set and false otherwise.
 */
function setSepChar(chr) {
    if (is.nonEmptyStr(chr)) {
        defaultSepChar = chr;
        return true;
    }
    return false;
}

/**
 * Given a char separated object path, return the child element (last part) of
 * the path. For the path, '1.2.3.4', the child path would be '4'.
 * @param {String} path The path for which which we want the child.
 * @param {String} sep The separator character to separate path elements in the string path.
 * @return {String|Boolean} Child element of the input path parameter or false is there is no child element.
 */
function getChild(path, sep) {
    if (!is.nonEmptyStr(path))  return false;
    if (!is.nonEmptyStr(sep))  sep = defaultSepChar;

    // create new path and remove leading and trailing sep chars
    var pathParts = filter(path.split(sep), function(elem) {
        return is.str(elem) && elem.length;
    });

    var child = pathParts.length === 0 ? false : pathParts[pathParts.length-1];
    return child;
}

/**
 * Given a char separated object path, return the parent part of the path. Given
 * a path, return the parent path, for '1.2.3.4', the parent path would be
 * '1.2.3'.
 * @param {String} path The path for which which we want the parent.
 * @param {String} sep The separator character to separate path elements.
 * @return {String|Boolean} The parent to the path input parameter or false if there is no parent path.
 */
function getParentPath(path, sep) {
    if (!is.nonEmptyStr(path))  return false;
    if (!is.nonEmptyStr(sep))  sep = defaultSepChar;

    // create new path and remove leading and trailing sep chars
    var properties = filter(path.split(sep), function(elem) {
        return is.str(elem) && elem.length;
    });

    // create a parent path
    var parentPath = '';
    for (var i=0; i<properties.length-1; i++) {
        parentPath += properties[i];
        parentPath += (i < properties.length-2) ? sep : '';
    }

    return parentPath.length ? parentPath : false;
}

/**
 * Given an object and a char-separated path, return the value at the path
 * or false if no such value can be found.
 * @param {Object} obj An object upon which to apply the path.
 * @param {String} path The path to traverse the object, e.g 'a.b.c'
 * @param {String} [sep] The separator char to delimit the properties in the path. Optional. If not specified, '.' is assumed.
 * @return {Undefined|Any} returns the value, if found or undefined otherwise.
 */
function get(obj, path, sep) {
    if (!is.obj(obj))  return undefined;
    if (!is.nonEmptyStr(path))  return obj;
    if (!is.nonEmptyStr(sep))  sep = defaultSepChar;

    // create new path and remove leading and trailing sep chars
    var properties = filter(path.split(sep), function(elem) {
        return is.str(elem) && elem.length;
    });

    var currVal = obj;
    for (var i=0; i<properties.length; i++) {
        var currPropertyName = properties[i];
        if (!currVal.hasOwnProperty(currPropertyName)) {
            return undefined;
        }
        currVal = currVal[currPropertyName];
    }

    return currVal;
}

/**
 * Given an object and a char-separated path, return the value at the path
 * or false if no such value can be found.
 * @param {Object} obj An object upon which to apply the path.
 * @param {String} path The path to traverse the object, e.g 'a.b.c'
 * @param {Any} value The value to set the property to.
 * @param {String} [sep] The separator char to delimit the properties in the path. Optional. If not specified, '.' is assumed.
 * @return {Undefined|Any} returns the value set if the property is found or undefined otherwise.
 */
function set(obj, path, value, sep) {
    if (!is.nonEmptyStr(sep))  sep = defaultSepChar;
    if (!is.obj(obj))  return undefined;
    if (!is.nonEmptyString(path))  return obj;

    var parentPath = getParentPath(path, sep);
    var child = getChild(path, sep);
    if (!is.nonEmptyString(child))  return undefined;

    // case where there is a parent path
    if (parentPath.length) {
        var parentObj = get(obj, parentPath, sep);
        if (is.undefined(parentObj))  return undefined;
        parentObj[child] = value;
        return parentObj[child];
    }

    // there is no path
    obj[child] = value;
    return obj[child];
}

/**
 * Given an object and a '/' separated path, remove the property at the path,
 * return true if found and deleted and false if not found.
 * @param {Object} obj An object upon which to apply the path.
 * @param {String} path The path to traverse the object, e.g 'a.b.c'
 * @param {String} [sep] The separator char to delimit the properties in the path. Optional. If not specified, '.' is assumed.
 * @return {Boolean} returns true if found and removed and false otherwise.
 */
function remove(obj, path, sep) {
    if (!is.obj(obj) || !is.nonEmptyStr(path))  return false;
    if (!is.nonEmptyStr(sep))  sep = defaultSepChar;

    var parentPath = getParentPath(path, sep);
    var child = getChild(path, sep);
    if (!is.nonEmptyStr(child))  return false;

    // if there is a parent path, we get the parent object, check to see what it
    // is and then update it
    if (parentPath.length) {
        var parentObj = get(obj, path, sep);
        if (is.undef(parentObj))  return false;
        delete parentObj[child];
        return true;
    }

    if (is.undef(obj[child]))  return false;
    delete obj[child];
    return true;
}
