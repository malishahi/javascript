'use strict'
const async = require('../src/async.js');
let chai = require('chai');
let should = chai.should();

describe('Callbacks', function () {
    it('todos tests', function (done) {
        let todos = ['a', 'b'];
        let newtodos = ['a', 'b', 'c', 'd'];

        async.setTodos(todos);
        //takes 2000 ms
        async.addTodo('c');
        let ret = async.getTodos();
        ret.should.be.a('array');
        ret.should.have.length(2);
        ret.should.deep.eql(todos);
        console.log(ret);

        //takes 2000 ms
        async.addTodo('d', () => {
            console.log('added d.');
            ret = async.getTodos();
            console.log(ret);
            ret.should.be.a('array');
            ret.should.have.length(4);
            ret.should.deep.eql(newtodos);
        });

        //takes 2000 ms
        async.addTodo('e', () => {
            console.log('added e.');
            ret = async.getTodos();
            console.log(ret);
            ret.should.be.a('array');
            ret.should.have.length(5);
            newtodos.push('e')
            ret.should.deep.eql(newtodos);
            // async.removeTodo('e', () => {
            //     console.log('removed e.');
            //     ret = async.getTodos();
            //     console.log(ret);
            //     ret.should.be.a('array');
            //     ret.should.have.length(4);
            //     newtodos.remove('e');
            //     ret.should.deep.eql(newtodos);
            // })
        });

        ret.should.be.a('array');
        ret.should.have.length(2);
        ret.should.deep.eql(todos);

        setTimeout(() => done(), 2900);
    });
});

describe('Promises', function () {
    var resolveAfter2Seconds = function () {
        console.log("starting slow promise");
        return new Promise(resolve => {
            setTimeout(function () {
                resolve(20);
                console.log("slow promise is done");
            }, 2000);
        });
    };

    var resolveAfter1Second = function () {
        console.log("starting fast promise");
        return new Promise(resolve => {
            setTimeout(function () {
                resolve(10);
                console.log("fast promise is done");
            }, 1000);
        });
    };

    var sequentialStart = async function () {
        console.log('==SEQUENTIAL START==');

        // If the value of the expression following the await operator is not a Promise, it's converted to a resolved Promise.
        const slow = await resolveAfter2Seconds();

        const fast = await resolveAfter1Second();
        console.log(slow);
        console.log(fast);
    }

    var concurrentStart = async function () {
        console.log('==CONCURRENT START with await==');
        const slow = resolveAfter2Seconds(); // starts timer immediately
        const fast = resolveAfter1Second();

        console.log(await slow);
        console.log(await fast); // waits for slow to finish, even though fast is already done!
    }

    var stillConcurrent = function () {
        console.log('==CONCURRENT START with Promise.all==');
        Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then((messages) => {
            console.log(messages[0]); // slow
            console.log(messages[1]); // fast
        });
    }

    var parallel = function () {
        console.log('==PARALLEL with Promise.then==');
        resolveAfter2Seconds().then((message) => console.log(message));
        resolveAfter1Second().then((message) => console.log(message));
    }

    sequentialStart(); // after 2 seconds, logs "slow", then after 1 more second, "fast"
    // wait above to finish
    setTimeout(concurrentStart, 4000); // after 2 seconds, logs "slow" and then "fast"
    // wait again
    setTimeout(stillConcurrent, 7000); // same as concurrentStart
    // wait again
    setTimeout(parallel, 10000); // trully parallel: after 1 second, logs "fast", then after 1 more second, "slow"
});

describe('Promises', function () {
    it('promise tests: then, catch', function (done) {
        const p1 = async.createPromise('promise1', 1000, false);
        const p2 = async.createPromise('promise2', 2000, true);
        const p3 = async.createPromise('promise3', 3000, false);
        p1.then((msg) => { console.log(msg); }).catch((err) => { console.log(msg) });
        p2.then((msg) => { console.log(msg); }).catch((err) => { console.log(err.message) });
        p3.then((msg) => { console.log(msg); }).catch((err) => { console.log(msg) });

        setTimeout(() => { done(); }, 3400);
    });

    it('promise tests: .all promise2 fails', function (done) {
        const p1 = async.createPromise('promise1', 1000, false);
        const p2 = async.createPromise('promise2', 2000, true);
        const p3 = async.createPromise('promise3', 3000, false);

        Promise.all([p1, p2, p3]).catch((err) => {
            //err.should.eql(new Error('An error occurred in this promise promise2.'));
            chai.expect(err).to.be.an.instanceof(Error);
            err.message.should.deep.eql('An error occurred in this promise promise2.');
            done();
        });
    });

    it('promise tests: .all succeed', function (done) {
        const p1 = async.createPromise('promise1', 1000, false);
        const p2 = async.createPromise('promise2', 2000, false);
        const p3 = async.createPromise('promise3', 3000, false);
        Promise.all([p1, p2, p3]).then(result => { result.should.deep.eql(['Promise promise1 resolved.', 'Promise promise2 resolved.', 'Promise promise3 resolved.']); done(); }
        );
    });

    it('promise1 resolves', function (done) {
        const p1 = async.createPromise('promise1', 1000, false);
        p1
            .then((msg) => { msg.should.equal('Promise promise1 resolved.'); done(); })
            .catch(done);
    });

    it('promise1 resolves without done: mocha understands that it is a promise', function () {
        const p1 = async.createPromise('promise1', 1000, false);
        return p1
            .then((msg) => { msg.should.equal('Promise promise1 resolved.'); });
    });

    it('promise2 fails', function (done) {
        const p1 = async.createPromise('promise2', 1000, true);
        p1.catch(done);
    });

    it('promise2 fails without done', function () {
        const p1 = async.createPromise('promise2', 1000, true);
        return p1;
    });
});
