const addAllValues = require('../src/js.js').addAllValues;
const addAllValuesAndArg = require('../src/js.js').addAllValuesAndArg;

let chai = require('chai');
let should = chai.should();

describe('Bind, call, apply', function () {
    it('bind an object to addAllValues', function () {
        let todos = { values: [2, 3] };
        const addValues = addAllValues.bind(todos);
        const sum = addValues();
        sum.should.equal(5);
    });

    it('2 test bind an object to addAllValues', function () {
        const addValues = addAllValues.bind({ values: [2, 3, 1, 1, 5] });
        //console.log(addAllValues.bind({ values: [2, 3, 1, 1, 5] })());
        addValues().should.equal(12);
        addAllValues.bind({ values: [2, 3, 1, 1, 5, 5] })().should.equal(17);
    });

    it('call an object to addAllValues', function () {
        let todos = { values: [2, 3, 20] };
        const sum = addAllValues.call(todos);
        sum.should.equal(25);
    });


    it('apply an object to addAllValues', function () {
        let todos = { values: [2, 3, 10] };
        const sum = addAllValues.apply(todos);
        sum.should.equal(15);
    });

    it('bind an object to addAllValuesAndArg', function () {
        let todos = { values: [2, 3] };
        const addValues = addAllValuesAndArg.bind(todos);
        const sum = addValues(10);
        sum.should.equal(15);
    });

    it('2nd test bind an object to addAllValuesAndArg', function () {
        const addValues = addAllValuesAndArg.bind({ values: [2, 3, 1, 1, 5] });
        //console.log(addAllValuesAndArg.bind({ values: [2, 3, 1, 1, 5] })());
        addValues(2).should.equal(14);
        addAllValuesAndArg.bind({ values: [2, 3, 1, 1, 5, 5] })(3).should.equal(20);
    });

    it('call an object to addAllValuesAndArg', function () {
        let todos = { values: [2, 3, 20] };
        const sum = addAllValuesAndArg.call(todos, 2);
        sum.should.equal(27);
    });


    it('apply an object to addAllValuesAndArg', function () {
        let todos = { values: [2, 3, 10] };
        const sum = addAllValuesAndArg.apply(todos, [3]);
        sum.should.equal(18);
    });
});
