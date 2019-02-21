let express = require('express');
let app = express();
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
const passport = require('./passport-oauth2-local');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({
    secret: 'test', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        return res.json({ message: 'AUTH OK /' });
    }

    res.render('login.ejs', { message: 'Please enter your credentials' });
});

app.get('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.json({
                message: 'local strategy failed',
                err,
                user
            });
            return next();
        }

        req.logIn(user, err => {
            if (err)
                return next(err);

            return res.json({
                message: 'req.logIn execution was successful',
                username: req.body.username,
                name: user.name,
                family: user.family
            });
        });
    })(req, res, next);
});

app.get('/oauth/callback', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.json({
                message: 'local strategy failed',
                username: req.body.username
            });
            return next();
        }

        req.logIn(user, err => {
            if (err)
                return next(err);

            return res.json({
                message: 'req.logIn execution was successful',
                username: req.body.username,
                name: user.name,
                family: user.family
            });
        });
    })(req, res, next);
});


const server = app.listen(3000, () => {
    console.log('App listening on port 3000');
});

module.exports = { app, server };