
var is = require('is2');


/**
 * Recursively makes each property in the object and its sub-objects immutable.
 * @param {object} obj An object for which to make immutable properties.
 * @return {Object} The object passed in.
 */
exports.makeObjConst = function(obj) {

    if (!is.obj(obj))
        return false;

    for (var prop in obj) {
        if (!obj.hasOwnProperty(prop))
            continue;

        if (is.obj(obj[prop]))
            exports.makeObjConst(obj[prop]);
        else
            exports.makePropConst(obj, prop);
    }

    return obj;
};

/**
 * Make a property immutable (assuring it cannot be changed from the current value).
 * This operation cannot be un-done.
 * @param {Object} object - The object to attach an immutable property into.
 * @param {String} property - The name of the property to make immutable.
 * @return {Object} object - The original object is returned - for chaining.
 */
exports.makePropConst = function(object, property) {

    if (!is.object(object) || !is.nonEmptyStr(property))
        return false;

    // Disable writing, and make sure the property cannot be re-configured.
    Object.defineProperty(object, property, {
        value : object[property],
        writable : false,
        configurable: false
     });

    return object;
};