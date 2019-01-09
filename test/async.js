const async = require('../src/async.js');
let chai = require('chai');
let should = chai.should();

describe('Callbacks', function () {
    it('todos tests', function (done) {
        let todos = ['a', 'b'];
        let newtodos = ['a', 'b', 'c', 'd'];

        async.setTodos(todos);
        async.addTodo('c');
        let ret = async.getTodos();
        console.log(ret);

        async.addTodo('d', () => {
            console.log('added d.');
            ret = async.getTodos();
            console.log(ret);
            ret.should.be.a('array');
            ret.should.have.length(4);
            ret.should.deep.eql(newtodos);
        });

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

        setTimeout(() => { done(); }, 2900);
    });
});

describe('Promises', function () {
    it('promise tests', function (done) {
        const p1 = async.createPromise('promise1', 1000, false);
        const p2 = async.createPromise('promise2', 2000, true);
        const p3 = async.createPromise('promise3', 3000, false);

        p1.then((msg) => { console.log(msg); }).catch((err) => { console.log(msg) });
        p2.then((msg) => { console.log(msg); }).catch((err) => { console.log(err.message) });
        p3.then((msg) => { console.log(msg); }).catch((err) => { console.log(msg) });

        setTimeout(() => { done(); }, 3400);
    });

    it('promise resolves', function (done) {
        const p1 = async.createPromise('promise1', 1000, false);
        p1
            .then((msg) => { msg.should.equal('Promise promise1 resolved.'); done(); })
            .catch(done);
    });

    it('promise resolves without done', function () {
        const p1 = async.createPromise('promise1', 1000, false);
        return p1
            .then((msg) => { msg.should.equal('Promise promise1 resolved.'); });
    });

    it('promise fails', function (done) {
        const p1 = async.createPromise('promise2', 1000, true);
        p1
            .catch(done);
    });

    it('promise fails without done', function () {
        const p1 = async.createPromise('promise2', 1000, true);
        return p1;
    });
});
