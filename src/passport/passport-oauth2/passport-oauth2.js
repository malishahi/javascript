let OAuth2Strategy = require('passport-oauth2');
let OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
let passport = require('passport');

let refreshStrategy = new OAuth2RefreshTokenStrategy({
    refreshWindow: 10, // Time in seconds to perform a token refresh before it expires
    userProperty: 'ticket', // Active user property name to store OAuth tokens
    authenticationURL: '/login', // URL to redirect unathorized users to
    callbackParameter: 'callback' // URL query parameter name to pass a return URL
});

passport.use('main', refreshStrategy);
//Main authorization strategy that authenticates
//user with OAuth access token
//and performs a token refresh if needed

let oauthStartegy = new OAuth2Strategy({
    authorizationURL: 'https://keycloak.waziup.io/auth/realms/waziup/protocol/openid-connect/auth',
    tokenURL: 'https://keycloak.waziup.io/auth/realms/waziup/protocol/openid-connect/token',
    clientID: 'dashboard',
    clientSecret: 'a2ea2668-cf02-482d-9ee1-0965728f001a',
    callbackURL: '/oauth/callback',
    passReqToCallback: false //Must be omitted or set to false in order to work with OAuth2RefreshTokenStrategy
},
    (accessToken, refreshToken, profile, done) => {
        refreshStrategy.getOAuth2StrategyCallback();
        //profile gets user profile from keycloak
        // This is called after a successful authentication has been completed
        // Here's a sample of what you can then do, i.e., write the user to your DB
        findOrCreate({ profile }, (err, user) => {
            if (err)
                done(err, false);

            //user.save((err, savedUser) => done(err, savedUser));
            done(null, user);
        });
    }
    //Create a callback for OAuth2Strategy
);

passport.use('oauth', oauthStartegy); //Strategy to perform regular OAuth2 code grant workflow
refreshStrategy.useOAuth2Strategy(oauthStartegy); //Register the OAuth strategy
//to perform OAuth2 refresh token workflow

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    userFind(email, function (err, user) {
        done(err, user);
    });
});

function userFind(email, cb) {
    //query user information from database based on id, or profile, save missing profile data into database, merge, etc.
    const user = {
        keycloakId: '2ecfae24-f340-4ad0-a12e-02cdc60cd8ba',
        fullName: 'Corentin Dupont',
        firstName: 'Corentin',
        lastName: 'Dupont',
        username: 'cdupont',
        email: 'cdupont@fbk.eu',
        avatar: undefined,
        realm: 'waziup',
        emailKey: email
    };

    cb(null, user);
}

function findOrCreate(profile, cb) {
    //query user information from database based on id, or profile, save missing profile data into database, merge, etc.
    const user = Object.assign({}, profile.profile);

    cb(null, user);
}

module.exports = passport;