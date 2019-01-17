let chai = require('chai');
let should = chai.should();

describe('Callbacks', function () {
    it('Throws with a ReferenceError because z is undefined', function () {
        try {
            const m = 1;
            const n = m + z;
        } catch (err) {
            // Handle the error here.
            chai.expect(err).to.be.a('ReferenceError');
        }
    });
});
