let OAuth2Strategy = require('passport-oauth2');
let LocalStrategy = require('passport-local').Strategy;
let OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
let passport = require('passport');

let refreshStrategy = new OAuth2RefreshTokenStrategy({
  refreshWindow: 10,
  userProperty: 'ticket',
  authenticationURL: '/login',
  callbackParameter: 'callback'
});

passport.use('main', refreshStrategy);

let oauthStartegy = new OAuth2Strategy({
  authorizationURL: 'https://keycloak.waziup.io/auth/realms/waziup/protocol/openid-connect/auth',
  tokenURL: 'https://keycloak.waziup.io/auth/realms/waziup/protocol/openid-connect/token',
  clientID: 'ivis-client',
  clientSecret: 'a2ea2668-cf02-482d-9ee1-0965728f001a',
  callbackURL: '/oauth/callback',
  passReqToCallback: false
},
  refreshStrategy.getOAuth2StrategyCallback()
);

refreshStrategy.useOAuth2Strategy(oauthStartegy);

let localStrategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  refreshStrategy.getLocalStrategyCallback() //Create a callback for LocalStrategy
);

passport.use('local', localStrategy); //Strategy to perform a username/password login
refreshStrategy.useLocalStrategy(localStrategy); //Register the LocalStrategy to perform an OAuth 'password' workflow

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  userFind(id, function (err, user) {
    done(err, user);
  });
});

function userFind(id, cb) {
  //query user information from database based on id
  const user = { id: id, name: 'Mehdi', family: 'Sheikhalishahi' };
  cb(null, user);
}
module.exports = passport;