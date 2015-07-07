var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var db = require('monk')(process.env.MONGO_URI);
var users = db.get('user');
var userDecks = db.get('userdeck');
var bcrypt = require('bcryptjs');
var userNameValidator = require("../lib/validation.js").validUserName;
var passwordValidator = require("../lib/validation.js").validPassword;

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
  var validUsernameArray = userNameValidator(userNameInput);
  var validPasswordArray = passwordValidator(userPwInput);
  if (validUsernameArray.length > 0 || validPasswordArray.length > 0) {
    res.render('signup', {userName: userNameInput, usernameErrorArray: validUsernameArray,
      pwErrorArray: validPasswordArray});
  }
  else {
    users.findOne({userName: userNameInput}, function (err, data) {
      if (data) {
        if (data.userName != userNameInput) {
          if (userPwInput === userPwConfirm) {
            var hash = bcrypt.hashSync(userPwInput, 8);
            users.insert({userName: userNameInput, password: hash});
            res.redirect('/');
          }
          else {
            res.render('signup', {userName: userNameInput, inputError: 'Passwords do not match'});
          }
        }
        else {
          res.render('signup', {userName: userNameInput, inputError: 'That username already exists'});
        }
      }
      else {
        if (userPwInput === userPwConfirm) {
          var hash = bcrypt.hashSync(userPwInput, 8);
          users.insert({userName: userNameInput, password: hash});
          res.redirect('/');
        }
        else {
          res.render('signup', {userName: userNameInput, inputError: 'Passwords do not match'});
        }
      }
    });
  }
});

router.post('/login', function (req, res, next) {
  var userNameInput = req.body.user_name;
  var userPwInput = req.body.password;
  users.findOne({userName: userNameInput}, function (err, data) {
    bcrypt.compare(userPwInput, data.password, function (err, answer) {
      if (answer === true) {
        if (userNameInput === 'Chronos') {
          res.cookie('currentUser', userNameInput);
          res.cookie('admin', 'You Are an Admin');
          res.redirect('/');
        }
        else {
        res.cookie('currentUser', userNameInput);
        res.redirect('/');
        }
      }
      else {
        res.render('index', {userName: userNameInput, inputError: 'Something does not match'});
      }
    });
  });
});

router.post('/logout', function (req, res, next) {
  var userNameCookie = req.cookies.currentUser
  res.clearCookie('admin');
  res.clearCookie('currentUser');
  res.redirect('/');
});

router.get('/user-cards/:id', function (req, res, next) {
  var userNameCookie = req.cookies.currentUser;
  var cardInfoArray = [];
  userDecks.findOne({userName: userNameCookie}, function (err, data) {
    if (data) {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/" + data.cardClass)
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
    }
    else {
      res.render('user-cards', {userName: userNameCookie});
    }
  });
});

router.post('/user-cards/:id', function (req, res, next) {
  var userNameCookie = req.cookies.currentUser;
  userDecks.insert({userName: userNameCookie, usersCards: req.body.cardId,
  cardClass: req.body.playerClass[0]});
  res.redirect('/user-cards/' + req.params.id);
});

router.get('/remove-cards/:id', function (req, res, next) {
  var userNameCookie = req.cookies.currentUser;
  userDecks.remove({userName: userNameCookie});
  res.redirect('/user-cards/' + req.params.id);
});

router.post('/remove-cards/:id', function (req, res, next) {
  var userNameCookie = req.cookies.currentUser;
  userDecks.findOne({userName: userNameCookie}, function (err, data) {
    for (key in req.body) {
      userDecks.update({usersCards: key}, { $pull: {usersCards: key}});
    }
  });
  res.redirect('/user-cards/' + req.params.id);
});

function checkAuth(req, res, next) {
  if (!req.cookies.admin) {
    res.redirect('/' + '?error=notadmin');
  } else {
    next();
  }
}

router.get('/admin', checkAuth, function (req, res, next) {
  res.send('Welcome ' + req.cookies.currentUser + ', if you are seeing this, you are a bad ass! Or an admin');
});

module.exports = router;
