let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();
const app = require('../src/http.js');

chai.use(chaiHttp);

describe('WebService', function () {

    after(() => {
        app.close();
    });

    it('get request on /search has not error, and respose status code is 200', function (done) {
        chai.request(app)
            .get('/search')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('get request on /search2 has not error, and  respose status code is 404', function (done) {
        chai.request(app)
            .get('/search2')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                done();
            });
    });

    it('post on /entities should return the passed entity', (done) => {
        const entity = { id: 1, name: 'Entity1' };
        chai.request(app)
            .post('/entities')
            .send(entity)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.include(entity);
                res.body.should.have.property('id').eql(1);
                res.body.should.have.property('name').eql('Entity1');
                expect(err).to.be.null;
                done();
            });
    });

    // it('post on /entities-pipe-impl should return the passed entity', (done) => {
    //     const entity = { id: 1, name: 'Entity1' };
    //     chai.request(app)
    //         .post('/entities-pipe-impl')
    //         .send(entity)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.should.deep.include(entity);
    //             res.body.should.have.property('id').eql(1);
    //             res.body.should.have.property('name').eql('Entity1');
    //             expect(err).to.be.null;
    //             done();
    //         });
    // });

    it('post on /entities should return the passed entity', (done) => {
        const entity = { id: 4, name: 'Entity2', ttl: 128 };
        chai.request(app)
            .post('/entities')
            .send(entity)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.include(entity);
                res.body.should.have.property('id').eql(entity.id);
                res.body.should.have.property('name').eql(entity.name);
                res.body.should.have.property('ttl').eql(entity.ttl);
                done();
            });
    });

    it('post on /entities with empty object', (done) => {
        const entity = {};
        chai.request(app)
            .post(`/entities`)
            .send(entity)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.include({ });
                done();
            });
    });

    it('post on /entities2 should have respose status code is 404', (done) => {
        const entity = { id: 1, name: 'Entity1' };
        chai.request(app)
            .post(`/entities2`)
            .send(entity)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    it('put on /entities should return the passed entity', (done) => {
        const entity = { id: 1, name: 'Entity1' };
        chai.request(app)
            .put('/entities')
            .send(entity)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.include(entity);
                res.body.should.have.property('id').eql(entity.id);
                res.body.should.have.property('name').eql(entity.name);
                done();
            });
    });

    it('delete on /entities should return the passed entity', (done) => {
        const entity = { id: 1, name: 'Entity1' };
        chai.request(app)
            .delete('/entities')
            .send(entity)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.include(entity);
                res.body.should.have.property('id').eql(entity.id);
                res.body.should.have.property('name').eql(entity.name);
                done();
            });
    });
});