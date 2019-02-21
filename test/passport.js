let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let should = chai.should();
chai.use(chaiHttp);

const { server, app } = require('../src/passport/passport-local/routes_passport_local');


describe('Passport Local Authentication', function () {
    after(function (done) {
        if (server) {
            server.close();
        }

        server.close();
        done();
    });

    it('post to login with right credentials', function (done) {
        const userCredentials = { username: 'Mehdi', password: 'password' };

        chai.request(app)
            .post('/login')
            .send(userCredentials)
            .end(function (err, res) {
                expect(err).to.be.null;
                console.log(res.body);

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.eql('req.logIn execution was successful');
                done();
            });
    });

    it('post to login with right credentials, since user does not persist in the session the subsequent get request is not authenticated.', function (done) {
        const userCredentials = { username: 'Mehdi', password: 'password' };

        chai.request(app)
            .post('/login')
            .send(userCredentials)
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.eql('req.logIn execution was successful');
                chai.request(app)
                    .get('/login')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.message.should.eql('NOT AUTH');
                        done();
                    });
            });
    });

    it('post to login with missing username', function (done) {
        const userCredentials = { username: '', password: 'password' };

        chai.request(app)
            .post('/login')
            .send(userCredentials)
            .end(function (err, res) {
                expect(err).to.be.null;
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.eql('Missing credentials');
                done();
            });
    });

    it('post to login with missing password', function (done) {
        const userCredentials = { username: 'Mehdi', password: '' };

        chai.request(app)
            .post('/login')
            .send(userCredentials)
            .end(function (err, res) {
                expect(err).to.be.null;
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.eql('Missing credentials');
                done();
            });
    });
    
    it('post to login with unauthorized username', function (done) {
        const userCredentials = { username: 'unauthorized', password: 'password' };

        chai.request(app)
            .post('/login')
            .send(userCredentials)
            .end(function (err, res) {
                expect(err).to.be.null;
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.eql('unauthorized username.');
                done();
            });
    });
});

//describe('Passport OAuth2 Token');

function test() {
    // let server = null;
    // before(function (done) {
    //     mongoService.launchSyncMongo(
    //         () => {
    //             db.connectCb((err) => {
    //                 if (err) {
    //                     console.log('unable to connect to database', err);
    //                 } else {
    //                     server = app.listen(3000, () => {
    //                         console.log('connected to database, app listening on port 3000');
    //                     });
    //                 }
    //                 done();
    //             });
    //         }
    //     );
    // });

    after(function (done) {
        if (server) {
            console.log('after')
            server.close();
        }
        done();
    });

    it('get /profile', function (done) {
        chai.request(app)
            .get('/profile')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('get /api/data', function (done) {
        chai.request(app)
            .get('/api/data')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('get /oauth', function (done) {
        chai.request(app)
            .get('/oauth')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('get /oauth/callback', function (done) {
        chai.request(app)
            .get('/oauth/callback')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
}
    // it('insert a todo, check if it exists', function (done) {
    //     const todo = { todo: 'Todo 2' };
    //     let n;

    //     chai.request(app)
    //         .put('/search')
    //         .send(todo)
    //         .end(function (err, res) {
    //             expect(res).to.have.status(200);
    //             n = res.body.length;
    //         });

    //     chai.request(app)
    //         .post('/')
    //         .send(todo)
    //         .end(function (err, res) {
    //             expect(err).to.be.null;
    //             res.should.have.status(200);
    //             res.should.be.json;
    //             res.body.should.be.a('object');
    //             res.body.document.should.have.property('todo').eql(todo.todo);
    //             res.body.result.should.have.property('ok').eql(1);
    //             res.body.result.should.have.property('n').eql(1);
    //             res.body.should.have.property('msg').eql("Successfully inserted Todo!!!");
    //         });

    //     chai.request(app)
    //         .put('/search')
    //         .send(todo)
    //         .end(function (err, res) {
    //             expect(res).to.have.status(200);
    //             res.body.should.have.length(n + 1);
    //         });
    //     done();
    // });

