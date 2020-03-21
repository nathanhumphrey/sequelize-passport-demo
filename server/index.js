const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
// Requiring our models for syncing
const db = require('../db/models/index');

// grab the User model from the db object, the sequelize
// index.js file takes care of the exporting for us and the
// syntax below is called destructuring, its an es6 feature
const { User } = db;

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(
  new Strategy(
    {
      usernameField: 'email'
    },
    async (email, password, cb) => {
      try {
        // User.authenticate throws if user doesn't exist or password is invalid
        const user = await User.authenticate(email, password);
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findOne({ where: { id } });
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

/**
 * Custom middleware that requires authentication for a route.
 * If the user is not authenticated, redirect to the login route.
 */
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

// set up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup session management
app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 's3Cur3',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes

/* Index Route
========================================================= */
app.get('/', (req, res) => {
  res.send(JSON.stringify({ route: 'index', method: 'get', user: req.body }));
});

/* Register Routes
========================================================= */
app.get('/register', (req, res) => {
  res.send(
    JSON.stringify({ route: 'register', method: 'get', user: req.user })
  );
});

app.post('/register', async (req, res) => {
  // hash the password provided by the user with bcrypt so that
  // we are never storing plain text passwords. This is crucial
  // for keeping your db clean of sensitive data
  const hash = bcrypt.hashSync(req.body.password, 10);

  try {
    // create a new user with the password hash from bcrypt
    let user = await User.create(
      Object.assign(req.body, { passwordHash: hash })
    );

    // send back the new user and details
    return res.json({
      route: 'register',
      method: 'post',
      user,
      auth: req.isAuthenticated()
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

/* Login Routes
========================================================= */
app.get('/login', (req, res) => {
  res.send(JSON.stringify({ route: 'login', method: 'get', user: req.user }));
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({
    route: 'login',
    method: 'post',
    user: req.user,
    auth: req.isAuthenticated()
  });
});

/* Logout Route
========================================================= */
app.delete('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/* Me Route - get the currently logged in user 
 * (requires authentication)
========================================================= */
app.get('/me', requireAuth, (req, res) => {
  res.json({
    route: 'me',
    method: 'get',
    user: req.user,
    auth: req.isAuthenticated()
  });
});

// sync our sequelize models and then start server
// force: true will wipe our database on each server restart
// this is ideal while we change the models around
db.sequelize.sync({ force: true }).then(() => {
  // inside our db sync callback, we start the server
  // this is our way of making sure the server is not listening
  // to requests if we have not made a db connection
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});
