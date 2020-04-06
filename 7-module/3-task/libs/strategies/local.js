const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {usernameField: 'email', session: false},
  async function(email, password, done) {
    if (!email) {
      return done(null, false, 'Email is not specified');
    }
    try {
      await User.validate({email}, ['email']);
      const user = await User.findOneAndUpdate({email}, {}, {
        upsert: true,
        new: true,
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);
