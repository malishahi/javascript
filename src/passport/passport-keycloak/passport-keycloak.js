let passport = require('passport');
const KeycloakStrategy = require("@exlinc/keycloak-passport");

let kcConfig = {
    host: 'https://keycloak.waziup.io',
    realm: 'waziup',
    clientID: 'dashboard',
    clientSecret: 'a2ea2668-cf02-482d-9ee1-0965728f001a',
    callbackURL: `/api/auth/keycloak/return`
};

kcConfig.authorizationURL = `${kcConfig.host}/auth/realms/${kcConfig.realm}/protocol/openid-connect/auth`;
kcConfig.tokenURL = `${kcConfig.host}/auth/realms/${kcConfig.realm}/protocol/openid-connect/token`;
kcConfig.userInfoURL = `${kcConfig.host}/auth/realms/${kcConfig.realm}/protocol/openid-connect/userinfo`;

// Register the strategy with passport
passport.use(
    "keycloak",
    new KeycloakStrategy(
        kcConfig,
        (accessToken, refreshToken, profile, done) => {
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
    )
);

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    console.log('deserializeUser');

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