let express = require('express')
let app = express();
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

// setup local strategy
const passport = require('./passport-keycloak.js');
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

app.get('/api/auth/keycloak/',
    passport.authenticate("keycloak", (err, user) => {
        if (err || !user) {
            console.log(err, user);
            res.json({ err, user });
            return next();
        }
    })
);

// req.body.username is undefined here, and info is {} serializeUser happens here
app.get('/api/auth/keycloak/return', (req, res, next) => {
    passport.authenticate("keycloak", (err, user, info) => {
        if (err || !user) {
            res.json({ err, user });
            return next();
        }

        req.logIn(user, err => {
            if (err)
                return next(err);

            //redirect to home page
            // or just show a json status report.
            res.redirect('/api');
            // return res.json({
            //     message: 'req.logIn execution was successful in retrun uri',
            //     user,
            //     fullname: user.fullName,
            //     email: user.email
            // });
        });
    })(req, res, next);
});

app.get('/api/auth/keycloak/return-simple', passport.authenticate("keycloak", (err, user, info) => {
    if (err || !user) {
        res.json({ err, user });
        return next();
    }

    req.logIn(user, err => {
        if (err)
            return next(err);
        res.redirect('/api');
    });
}));

//deserializeUser http://localhost:3000/api/auth/keycloak/
app.get('/api',
    (req, res) => {
        if (req.isAuthenticated()) {
            return res.json({ message: 'AUTH OK /api/', user: req.user });
        }

        return res.json({ message: 'NOT AUTH' });
    });


app.get('/api/auth',
    passport.authenticate("keycloak", (err, user, info) => {
        if (err || !user) {
            res.json({ err });
            return next();
        }

        req.logIn(user, err => {
            if (err)
                return next(err);
            console.log(user, info);
            return res.json({
                message: 'req.logIn execution was successful in retrun uri',
                user,
                fullname: user.fullName,
                email: user.email
            });
        });
    })
);
const server = app.listen(3000, () => {
    console.log('App listening on port 3000');
});

module.exports = { app, server };