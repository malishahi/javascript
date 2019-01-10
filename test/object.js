
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

describe('Object', function () {
    it('defineProperty', function () {
        const object1 = {};

        Object.defineProperty(object1, 'property1', {
            value: 42,
            writable: false
        });

        object1.property1 = 77;
        // throws an error in strict mode
        object1.property1.should.equal(42);
        object1.property1.should.not.equal(77);
    });

    it('defineProperty 2', function () {
        // using __proto__
        var obj = {};
        var descriptor = Object.create(null); // no inherited properties
        // not enumerable, not configurable, not writable as defaults
        descriptor.value = 'static';
        Object.defineProperty(obj, 'key', descriptor);
        obj.key.should.equal('static');

        // being explicit
        Object.defineProperty(obj, 'key', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: 'static'
        });
        obj.key.should.equal('static');

        // recycling same object
        function withValue(value) {
            var d = withValue.d || (
                withValue.d = {
                    enumerable: false,
                    writable: false,
                    configurable: false,
                    value: null
                }
            );
            d.value = value;
            return d;
        }
        // ... and ...
        Object.defineProperty(obj, 'key', withValue('static'));
        obj.key.should.equal('static');
        Object.defineProperty(obj, 'key2', withValue('static2'));
        obj.key2.should.equal('static2');

        // if freeze is available, prevents adding or
        // removing the object prototype properties
        // (value, get, set, enumerable, writable, configurable)  
        (Object.freeze || Object)(Object.prototype);

    });

    it('defineProperty 3', function () {
        var o = {}; // Creates a new object

        // Example of an object property added
        // with defineProperty with a data property descriptor
        Object.defineProperty(o, 'a', {
            value: 37,
            writable: true,
            enumerable: true,
            configurable: true
        });
        // 'a' property exists in the o object and its value is 37
        o.a.should.equal(37);

        // Example of an object property added
        // with defineProperty with an accessor property descriptor
        var bValue = 38;
        Object.defineProperty(o, 'b', {
            // Using shorthand method names (ES2015 feature).
            // This is equivalent to:
            // get: function() { return bValue; },
            // set: function(newValue) { bValue = newValue; },
            get() { return bValue; },
            set(newValue) { bValue = newValue; },
            enumerable: true,
            configurable: true
        });
        o.b.should.equal(38);

        // 'b' property exists in the o object and its value is 38
        // The value of o.b is now always identical to bValue,
        // unless o.b is redefined
        o.b.should.equal(38);
        //o.b.set(39);
        //o.b.should.equal(39);

        // You cannot try to mix both:
        // Object.defineProperty(o, 'conflict', {
        //     value: 0x9f91102,
        //     get() { return 0xdeadbeef; }
        // });
        // throws a TypeError: value appears
        // only in data descriptors,
        // get appears only in accessor descriptors
    });

    it('defineProperty: writable: false', function () {
        var o = {}; // Creates a new object

        Object.defineProperty(o, 'a', {
            value: 37,
            writable: false
        });

        o.a.should.equal(37); // logs 37
        o.a = 25; // No error thrown
        // (it would throw in strict mode,
        // even if the value had been the same)
        o.a.should.equal(37); // logs 37. The assignment didn't work.

        // strict mode
        const ob = (function () {
            'use strict';
            var o = {};
            Object.defineProperty(o, 'b', {
                value: 2,
                writable: false
            });
            //o.b = 3; // throws TypeError: "b" is read-only
            return o.b; // returns 2 without the line above
        }());
        ob.should.equal(2);
    });

    it('defineProperty: enumerable', function () {
        /*
         For non-Symbols properties it also defines whether it shows up in a for...in loop and Object.keys() or not
        */
        var o = {};

        Object.defineProperty(o, 'a', {
            value: 1,
            enumerable: true
        });

        Object.defineProperty(o, 'b', {
            value: 2,
            enumerable: false
        });

        Object.defineProperty(o, 'c', {
            value: 3
        }); // enumerable defaults to false

        o.d = 4; // enumerable defaults to true

        // when creating a property by setting it
        Object.defineProperty(o, Symbol.for('e'), {
            value: 5,
            enumerable: true
        });

        Object.defineProperty(o, Symbol.for('f'), {
            value: 6,
            enumerable: false
        });


        expect(o).to.have.all.keys('a', 'd', Symbol.for('e'));

        const expected = ['a', 'd'];
        for (var i in o) {
            expected.should.contain(i);
        }
        // logs 'a' and 'd' (in undefined order)

        expect(Object.keys(o)).to.have.members(['a', 'd']);

        o.propertyIsEnumerable('a').should.equal(true); // true
        o.propertyIsEnumerable('b').should.equal(false); // false
        o.propertyIsEnumerable('c').should.equal(false); // false
        o.propertyIsEnumerable('d').should.equal(true); // true
        o.propertyIsEnumerable(Symbol.for('e')).should.equal(true); // true
        o.propertyIsEnumerable(Symbol.for('f')).should.equal(false); // false

        var p = { ...o };
        p.a.should.equal(1); // 1
        should.equal(p.b, undefined);
        should.equal(p.c, undefined);
        p.d.should.equal(4); // 4
        p[Symbol.for('e')].should.equal(5); // 5
        should.equal(p[Symbol.for('f')], undefined);
    });

    it('defineProperty: configurable: false', function () {
        var o = {};
        Object.defineProperty(o, 'a', {
            get() { return 1; },
            configurable: false
        });

        expect(() => Object.defineProperty(o, 'a', {
            configurable: true
        })).to.throw();
        // throws a TypeError

        expect(() => Object.defineProperty(o, 'a', {
            enumerable: true
        })).to.throw();
        // throws a TypeError

        expect(() => Object.defineProperty(o, 'a', {
            set() { }
        })).to.throw(); // throws a TypeError (set was undefined previously)

        expect(() => Object.defineProperty(o, 'a', {
            get() { return 1; }
        })).to.throw(); // throws a TypeError
        // (even though the new get does exactly the same thing)

        expect(() => Object.defineProperty(o, 'a', {
            value: 12
        })).to.throw(); // throws a TypeError

        o.a.should.equal(1); // logs 1
        delete o.a; // Nothing happens
        o.a.should.equal(1); // logs 1
    });

    it('Custom Setters and Getters', function () {
        function Archiver() {
            var temperature = null;
            var archive = [];

            Object.defineProperty(this, 'temperature', {
                get() {
                    console.log('get!');
                    return temperature;
                },
                set(value) {
                    temperature = value;
                    archive.push({ val: temperature });
                }
            });

            this.getArchive = function () { return archive; };
        }

        var arc = new Archiver();
        //arc.temperature; // 'get!'
        arc.temperature = 11;
        arc.temperature = 13;
        // [{ val: 11 }, { val: 13 }]
        arc.getArchive()[0].should.deep.include({ val: 11 });
        arc.getArchive()[0].val.should.equal(11);
        arc.getArchive()[1].should.deep.include({ val: 13 });
    });

    it('a getter always returns the same value', function () {
        var pattern = {
            get() {
                return 'I always return this string, ' +
                    'whatever you have assigned';
            },
            set() {
                this.myname = 'this is my name string';
            }
        };

        function TestDefineSetAndGet() {
            Object.defineProperty(this, 'myproperty', pattern);
        }

        var instance = new TestDefineSetAndGet();
        instance.myproperty = 'test';

        instance.myproperty.should.equal('I always return this string, whatever you have assigned');
        instance.myname.should.equal('this is my name string');
    });

    it('Inheritance of properties: shared value', function () {
        function myclass() {
        }

        var value;
        Object.defineProperty(myclass.prototype, "x", {
            get() {
                return value;
            },
            set(x) {
                value = x;
            }
        });

        var a = new myclass();
        var b = new myclass();
        a.x = 1;
        b.x.should.equal(1); // 1
    });

    it('This can be fixed by storing the value in another property. In get and set methods, this points to the object which is used to access or modify the property.', function () {
        function myclass() {
        }

        Object.defineProperty(myclass.prototype, "x", {
            get() {
                return this.stored_x;
            },
            set(x) {
                this.stored_x = x;
            }
        });

        var a = new myclass();
        var b = new myclass();
        a.x = 1;
        should.equal(b.x, undefined);
    });

    it('Inheritance of properties: value properties', function () {
        function myclass() {
        }

        myclass.prototype.x = 1;
        Object.defineProperty(myclass.prototype, "y", {
            writable: false,
            value: 1
        });

        var a = new myclass();
        a.x = 2;
        a.x.should.equal(2);
        myclass.prototype.x.should.equal(1);

        a.y = 2; // Ignored, throws in strict mode
        a.y.should.equal(1);
        myclass.prototype.y.should.equal(1);
    });

});