let chai = require('chai');
let expect = chai.expect;
let should = chai.should();

const mainClosure = require('../src/closure.js').mainClosure;

describe('Closure Unit Test', function () {
    const outer = mainClosure();
    const inner = mainClosure()();

    it('Closure inner call once', function () {
        let abc = inner();
        expect(abc).to.eql([21, 11, 6]);
        abc[0].should.equal(21);
        abc[1].should.equal(11);
        abc[2].should.equal(6);
    });

    it('Closure inner call twice, third', function () {
        let abc = inner();
        expect(abc).to.eql([21, 12, 7]);
        abc[0].should.equal(21);
        abc[1].should.equal(12);
        abc[2].should.equal(7);

        abc = inner();
        expect(abc).to.eql([21, 13, 8]);
        abc[0].should.equal(21);
        abc[1].should.equal(13);
        abc[2].should.equal(8);
    });

});



