let passport = require('passport');
let OpenIDStrategy = require('passport-openid').Strategy;

passport.use(new OpenIDStrategy({
    returnURL: 'http://localhost/auth/openid/return',
    realm: 'http://localhost/'
},
    function (identifier, done) {
        User.findOrCreate({ openId: identifier }, function (err, user) {
            done(err, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    userFind(id, function (err, user) {
        done(err, user);
    });
});

function findOrCreate(id, cb) {
    //query user information from database based on id
    const user = { id: id, name: 'Mehdi', family: 'Sheikhalishahi' };
    cb(null, user);
}

module.exports = passport;