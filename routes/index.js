var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var db = require('monk')(process.env.MONGO_URI);
var users = db.get('decks');

/* GET home page. */
router.get('/', function(req, res, next) {
  var heroArray = [];
  unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
  .header("X-Mashape-Key", process.env.MASH_KEY)
  .end(function (result) {
    for (var i = 0; i < result.body.Basic.length; i++) {
      if (result.body.Basic[i].type === 'Hero') {
        heroArray.push(result.body.Basic[i])
      }
    }
    res.render('index', {classes: heroArray});
  });
});

router.get('/class-deck/:id', function (req, res, next) {
  var cardsArray = [];
  var queryArray = req.query.mana_cost;
  unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/" + req.params.id)
  .header("X-Mashape-Key", process.env.MASH_KEY)
  .end(function (result) {
    for (var i = 0; i < result.body.length; i++) {
      if (result.body[i].img) {
        if (result.body[i].cost || !result.body[i].cost || result.body[i].attack) {
          if (queryArray) {
            for (var j = 0; j < queryArray.length; j++) {
              //compair each [i] of .body.cost with each [j] of queryArray
              if (!result.body[i].cost && parseInt(queryArray[j]) === 0) {
                cardsArray.push(result.body[i]);
              }
              if (result.body[i].cost === parseInt(queryArray[j])) {
                cardsArray.push(result.body[i]);
              }
              if (result.body[i].attack === parseInt(queryArray[j])) {
                cardsArray.push(result.body[i]);
              }
            }
          } else {
            cardsArray.push(result.body[i]);
          }
        }

      }
    }
    // console.log(cardsArray);
    res.render('class-deck', {classCards: cardsArray, classId: req.params.id});
  });
});

// //all cards
// unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
// .header("X-Mashape-Key", "NuemzgQbLCmshHxhaiAjD7gbuNcwp1wnTK3jsnAugNVnUJNuXC")
// .end(function (result) {
//   // res.render('index', {allCards: result.body});
// });

// //cards by class
// unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Paladin")
// .header("X-Mashape-Key", "NuemzgQbLCmshHxhaiAjD7gbuNcwp1wnTK3jsnAugNVnUJNuXC")
// .end(function (result) {
//   //console.log(result.status, result.headers, result.body);
// });

// //info
// unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/info")
// .header("X-Mashape-Key", "NuemzgQbLCmshHxhaiAjD7gbuNcwp1wnTK3jsnAugNVnUJNuXC")
// .header("Accept", "application/json")
// .end(function (result) {
//   //console.log(result.status, result.headers, result.body);
// });


module.exports = router;
