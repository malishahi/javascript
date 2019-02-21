let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username === 'unauthorized')
            return done(null, false, { message: 'unauthorized username.' });

        const user = { id: 'userid', username, name: 'Mehdi', family: 'Sheikhalishahi' };
        return done(null, user);
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

function userFind(id, cb) {
    //query user information from database based on id
    const user = { id: id, name: 'Mehdi', family: 'Sheikhalishahi' };
    cb(null, user);
}

module.exports = passport;

/*
FIXME:
user model
User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
*/