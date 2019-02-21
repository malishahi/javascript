var express = require('express')
var app = express()
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));

const passport = require('./passport-oauth2');
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());


app.get('/login', function (req, res) {
    console.log('login');
    res.send('Login')
});

app.get('/oauth', passport.authenticate('oauth', (err, user) => {
    if (err || !user) {
        console.log(err, user);
        res.json({ err, user });
        return next();
    }
})
);

app.get('/oauth/callback', (req, res, next) => {
    passport.authenticate("oauth", (err, user, info) => {
        if (err || !user) {
            res.json({ err, user });
            return next();
        }

        req.logIn(user, err => {
            if (err)
                return next(err);

            //redirect to home page
            // or just show a json status report.
            res.redirect('/api/data');
            // return res.json({
            //     message: 'req.logIn execution was successful in retrun uri',
            //     user,
            //     fullname: user.fullName,
            //     email: user.email
            // });
        });
    })(req, res, next);
});

//GET /api/data
app.get('/api/data',
    passport.authenticate('main', {
        noredirect: true //Don't redirect a user to the authentication page, just show an error
    }), function (req, res) {
        res.json('/api/data');
    });

const server = app.listen(3000, () => {
    console.log('App listening on port 3000');
});

module.exports = { app, server };