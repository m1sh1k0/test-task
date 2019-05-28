var express = require('express');
var router = express.Router();
var passport = require('passport');
var checkSession = require('../middleware/checkSession');
var https = require('https');

router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});

router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.session.user = user;
    res.redirect('/country_list.html');
  })(req, res, next);
});

router.get('/isLoggedIn', function(req, res) {
  if (req.session.user) {
    return res.json({user: req.session.user});
  }

  res.status(403).json({message: 'Please log in'});
});

router.get('/countries', checkSession.isLoggedIn, function(req, res) {
  https.get('https://restcountries.eu/rest/v2/all', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      var json = JSON.parse(data);
      res.json(json);
    });

  }).on("error", (err) => {
    res.status(500).end("Internal server error")
  });
});

module.exports = router;
