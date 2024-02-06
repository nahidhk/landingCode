property-path
=============

Get and set object properties by a string path, where you can specify the
separator.

## Example

    var propPath = require('property-path');

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

    console.log(propPath.get(testObj, 'a'));
    console.log(propPath.get(testObj, 'b'));
    console.log(propPath.get(testObj, 'c.d.e'));
    console.log(propPath.get(testObj, 'c/d/e', '/'));

    propPath.set(testObj, 'c.d.f.0', 333);
    console.log(testObj.c.d.f[0]);

The above code results in the following output:

    1
    true
    Hello
    Hello
    333

## Installation

    npm install property-path

## API

### get(obj, path, [sep])

Given an object and a char-separated path, return the value at the path
or false if no such value can be found.

#### Params: 

* **Object** *obj* An object upon which to apply the path.
* **String** *path* The path to traverse the object, e.g &#39;a.b.c&#39;
* **String** *[sep]* The separator char to delimit the properties in the path. Optional. If not specified, &#39;.&#39; is assumed.

#### Return:

* **Undefined|Any** returns the value, if found or undefined otherwise.

### set(obj, path, value, [sep])

Given an object and a char-separated path, return the value at the path
or false if no such value can be found.

#### Params: 

* **Object** *obj* An object upon which to apply the path.
* **String** *path* The path to traverse the object, e.g &#39;a.b.c&#39;
* **Any** *value* The value to set the property to.
* **String** *[sep]* The separator char to delimit the properties in the path. Optional. If not specified, &#39;.&#39; is assumed.

#### Return:

* **Undefined|Any** returns the value set, if the property is found or undefined otherwise.

### remove(obj, path, [sep])
Delete the property at path on obj.

* **Object** *obj* An object upon which to apply the path.
* **String** *path* The path to traverse the object, e.g &#39;a.b.c&#39;
* **String** *[sep]* The separator char to delimit the properties in the path. Optional. If not specified, &#39;.&#39; is assumed.

#### Return:

* **Boolean** returns the value set, if the property is found or undefined otherwise.

### setSepChar(chr)
Set the default separator character. Normally, when not specified, '.' is used,
however, you may set the default to whatever you want.

* **String** *chr* The new default separator char to delimit the properties in the path.

#### Return:

* **Boolean** true if set and false otherwise.


## License
The MIT License (MIT)

Copyright (c) 2014 Edmond Meinfelder

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

