var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var db = require('monk')(process.env.MONGO_URI);
var users = db.get('user');
var userDecks = db.get('userdeck');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var heroArray = [];
  var userNameCookie = req.cookies.currentUser;
  unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
  .header("X-Mashape-Key", process.env.MASH_KEY)
  .end(function (result) {
    for (var i = 0; i < result.body.Basic.length; i++) {
      if (result.body.Basic[i].type === 'Hero') {
        heroArray.push(result.body.Basic[i])
      }
    }
    res.render('index', {classes: heroArray, userName: userNameCookie});
  });
});

router.get('/class-deck/:id', function (req, res, next) {
  var cardsArray = [];
  var userNameCookie = req.cookies.currentUser;
  var queryArray = req.query.mana_cost;
  unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/" + req.params.id)
  .header("X-Mashape-Key", process.env.MASH_KEY)
  .end(function (result) {
    for (var i = 0; i < result.body.length; i++) {
      if (result.body[i].img) {
        cardsArray.push(result.body[i]);
      }
    }
    res.render('class-deck', {classCards: cardsArray, classId: req.params.id, userName: userNameCookie});
  });
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', function (req, res, next) {
  var userNameInput = req.body.user_name;
  var userPwInput = req.body.password;
  var userPwConfirm = req.body.pass_confirm;
  if (userPwInput === userPwConfirm) {
    var hash = bcrypt.hashSync(userPwInput, 8);
    users.insert({userName: userNameInput, password: hash});
    res.redirect('/');
  }
  else {
    res.render('signup', {userName: userNameInput, inputError: 'Passwords do not match'});
  }
});

router.post('/login', function (req, res, next) {
  var userNameInput = req.body.user_name;
  var userPwInput = req.body.password;
  // var pwHash = bcrypt.compareSync(userPwInput, hash);
  users.findOne({userName: userNameInput}, function (err, data) {
    bcrypt.compare(userPwInput, data.password, function (err, answer) {
      if (answer === true) {
        res.cookie('currentUser', userNameInput);
        res.redirect('/');
      }
      else {
        res.render('index', {userName: userNameInput, inputError: 'Something does not match'});
      }
    });
  });
});

router.get('/user-cards/:id', function (req, res, next) {
  var userNameCookie = req.cookies.currentUser
  var cardInfoArray = [];
  userDecks.findOne({userName: userNameCookie}, function (err, data) {
    // for (var i = 0; i < data.usersCards.length; i++) {
    unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/" + data.cardClass[0])
    .header("X-Mashape-Key", process.env.MASH_KEY)
    .end(function (result) {
      for (var i = 0; i < result.body.length; i++) {
        for (var j = 0; j < data.usersCards.length; j++) {
          if (result.body[i].cardId === data.usersCards[j]) {
            cardInfoArray.push(result.body[i]);
          }
        }
      }
      res.render('user-cards', {userName: userNameCookie, deckInfo: cardInfoArray});
    });
  });
});

router.post('/user-cards/:id', function (req, res, next) {
  var userNameCookie = req.cookies.currentUser;
  userDecks.insert({userName: userNameCookie, usersCards: req.body.cardId,
  cardClass: req.body.playerClass});
  res.redirect('/user-cards/' + req.params.id);
});

module.exports = router;
