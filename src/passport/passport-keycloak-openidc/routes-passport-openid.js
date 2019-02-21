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
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));

// setup local strategy
const passport = require('../passport-local/passport-local.js');
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());


// Accept the OpenID identifier and redirect the user to their OpenID
// provider for authentication.  When complete, the provider will redirect
// the user back to the application at:
//     /auth/openid/return
app.post('/auth/openid', passport.authenticate('openid'));

// The OpenID provider has redirected the user back to the application.
// Finish the authentication process by verifying the assertion.  If valid,
// the user will be logged in.  Otherwise, authentication has failed.
app.get('/auth/openid/return',
  passport.authenticate('openid', { successRedirect: '/',
                                    failureRedirect: '/login' }));

                                    
app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        return res.json({ message: 'AUTH OK /' });
    }

    res.render('login.ejs', { message: 'Please enter your credentials' });
});

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        //console.log('user authenticated', req.user);
        return res.json({ message: 'AUTH OK /login' });
    }

    return res.json({ message: 'NOT AUTH' });
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.json({
                message: info.message,
                username: req.body.username,
                name: user.name,
                family: user.family
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