var loginButton = document.getElementById('login-button');
var hiddenLoginBox = document.getElementById('hidden-login');
if (loginButton) {
  loginButton.addEventListener('click', function (a) {
    a.preventDefault();
    hiddenLoginBox.style.display = 'inline-block';
  });
}

var loginBoxClose = document.getElementById('close-hidden');
if (loginBoxClose) {
  loginBoxClose.addEventListener('click', function (button) {
    button.preventDefault();
    hiddenLoginBox.style.display = 'none';
  });
}

var submit = document.getElementById('filterSubmit');
var cost = document.getElementsByClassName('cost');
var filtersDiv = document.getElementsByClassName('filter-options');
for (var i = 0; i < filtersDiv.length; i++) {
  filtersDiv[i].addEventListener('change', function () {
    var cardImgDiv = document.getElementsByClassName('card-img')[0];
    var attack = document.getElementsByClassName('attack');
    var rarity = document.getElementsByClassName('rarity');
    var type = document.getElementsByClassName('type');
    var currentUrl = document.URL;
    currentUrl = currentUrl.split('/');
    var className = currentUrl[4];
    var cardArray = [];
    var costArray = [];
    var attackArray = [];
    var rarityArray = [];
    var typeArray = [];
    var xhr = new XMLHttpRequest();
    xhr.open( "GET", 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/' + className, false );
    xhr.setRequestHeader('X-Mashape-Key', 'TKfQ1tYF8ImshskebOBHNwVMxFUSp1ZTcGljsnp6Fw3pWtSFCs');
    xhr.send( null );
    var parsedObj = JSON.parse(xhr.responseText);
    for (var i = 0; i < cost.length; i++) {
      if (cost[i].checked) {
        costArray.push(cost[i].value);
      }
    }
    for (var i = 0; i < attack.length; i++) {
      if (attack[i].checked) {
        attackArray.push(attack[i].value);
      }
    }
    for (var i = 0; i < rarity.length; i++) {
      if (rarity[i].checked) {
        rarityArray.push(rarity[i].value);
      }
    }
    for (var i = 0; i < type.length; i++) {
      if (type[i].checked) {
        typeArray.push(type[i].value);
      }
    }
    for (var i = 0; i < parsedObj.length; i++) {
      if (parsedObj[i].img) {
        if (costArray.length === 0 && attackArray.length === 0 && rarityArray.length === 0
          && typeArray.length === 0 ) {
          cardArray.push(parsedObj[i]);
        }
        if (costArray.length > 0) {
          for (var j = 0; j < costArray.length; j++) {
            if (parsedObj[i].cost === parseInt(costArray[j])) {
              cardArray.push(parsedObj[i]);
            }
            if (parsedObj[i].cost === undefined && parseInt(costArray[j]) === 0) {
              cardArray.push(parsedObj[i]);
            }
          }
        }
        if (attackArray.length > 0) {
          for (var j = 0; j < attackArray.length; j++) {
            if (parsedObj[i].attack === parseInt(attackArray[j])) {
              cardArray.push(parsedObj[i]);
            }
            if (parsedObj[i].attack === undefined && parseInt(attackArray[j]) === 0) {
              cardArray.push(parsedObj[i]);
            }
          }
        }
        if (rarityArray.length > 0) {
          for (var j = 0; j < rarityArray.length; j++) {
            if (parsedObj[i].rarity === rarityArray[j]) {
              cardArray.push(parsedObj[i]);
            }
          }
        }
        if (typeArray.length > 0) {
          for (var j = 0; j < typeArray.length; j++) {
            if (parsedObj[i].type === typeArray[j]) {
              cardArray.push(parsedObj[i]);
            }
          }
        }
      }
    }
    cardImgDiv.innerHTML = '';
    for (var i = 0; i < cardArray.length; i++) {
      var img = document.createElement('img');
      var a = document.createElement('a');
      var cardDiv = document.createElement('div');
      cardDiv.className = 'card';
      cardImgDiv.appendChild(cardDiv);
      cardDiv.appendChild(a);
      a.appendChild(img);
      img.src = cardArray[i].img;
      a.href = cardArray[i].cardId;
      a.className = 'card-id';
    }
    var cardId = document.getElementsByClassName('card-id');
    var cardDiv = document.getElementsByClassName('card');
    var cardDatabody = document.getElementById('card-data');
    var cardCount = document.getElementById('card-counter');
    var counterError = document.getElementById('card-at-max');
    for (var i = 0; i < cardDiv.length; i++) {
      cardId[i].addEventListener('click', function (a) {
        if (holdingArray.length < 30) {
          a.preventDefault();
          holdingArray.push(this);
          var singleCardId = this.href.split('/')[4];
          var xhr = new XMLHttpRequest();
          xhr.open( "GET", 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/' + singleCardId, false );
          xhr.setRequestHeader('X-Mashape-Key', 'TKfQ1tYF8ImshskebOBHNwVMxFUSp1ZTcGljsnp6Fw3pWtSFCs');
          xhr.send( null );
          var parsedObj = JSON.parse(xhr.responseText);
          objectArray.push(parsedObj);
          var tableRow = document.createElement('tr');
          tableRow.className = 'card-count'
          var cardName = document.createElement('td');
          var cardCost = document.createElement('td');
          var cardObjId = document.createElement('input');
          var cardType = document.createElement('input');
          cardType.type = 'hidden';
          cardType.className = 'class-id';
          cardType.value = parsedObj[0].playerClass;
          cardType.name = 'playerClass';
          cardObjId.type = 'hidden';
          cardObjId.className = 'class-id';
          cardObjId.value = parsedObj[0].cardId;
          cardObjId.name = 'cardId';
          cardDatabody.appendChild(tableRow);
          tableRow.appendChild(cardName);
          tableRow.appendChild(cardCost);
          tableRow.appendChild(cardObjId);
          tableRow.appendChild(cardType);
          cardName.innerHTML = parsedObj[0].name;
          if (parsedObj[0].cost === undefined) {
            cardCost.innerHTML = '0';
          }
          else {
            cardCost.innerHTML = parsedObj[0].cost;
          }
          cardCount.innerHTML = holdingArray.length + "/30 cards";
        }
        else {
          a.preventDefault();
          counterError.style.display = 'inline-block';
        }
      });
    }
  });
}

var cardId = document.getElementsByClassName('card-id');
var cardDiv = document.getElementsByClassName('card');
var cardDatabody = document.getElementById('card-data');
var cardCount = document.getElementById('card-counter');
var counterError = document.getElementById('card-at-max');
var hiddenName = document.getElementsByClassName('hidden-name');
var holdingArray = [];
var objectArray = [];
for (var i = 0; i < cardDiv.length; i++) {
  cardId[i].addEventListener('click', function (a) {
    if (holdingArray.length < 30) {
      a.preventDefault();
      holdingArray.push(parsedObj);
      var singleCardId = this.href.split('/')[4];
      var xhr = new XMLHttpRequest();
      xhr.open( "GET", 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/' + singleCardId, false );
      xhr.setRequestHeader('X-Mashape-Key', 'TKfQ1tYF8ImshskebOBHNwVMxFUSp1ZTcGljsnp6Fw3pWtSFCs');
      xhr.send( null );
      var parsedObj = JSON.parse(xhr.responseText);
      objectArray.push(parsedObj);
      var tableRow = document.createElement('tr');
      tableRow.className = 'card-count'
      var cardName = document.createElement('td');
      var cardCost = document.createElement('td');
      var cardObjId = document.createElement('input');
      var cardType = document.createElement('input');
      cardType.type = 'hidden';
      cardType.className = 'class-id';
      cardType.value = parsedObj[0].playerClass;
      cardType.name = 'playerClass';
      cardObjId.type = 'hidden';
      cardObjId.className = 'class-id';
      cardObjId.value = parsedObj[0].cardId;
      cardObjId.name = 'cardId';
      cardDatabody.appendChild(tableRow);
      tableRow.appendChild(cardName);
      tableRow.appendChild(cardCost);
      tableRow.appendChild(cardObjId);
      tableRow.appendChild(cardType);
      cardName.innerHTML = parsedObj[0].name;
      if (parsedObj[0].cost === undefined) {
        cardCost.innerHTML = '0';
      }
      else {
        cardCost.innerHTML = parsedObj[0].cost;
      }
      cardCount.innerHTML = holdingArray.length + "/30 cards";
    }
    else {
      a.preventDefault();
      counterError.style.display = 'inline-block';
    }
  });
}

//for screencast demo
//no longer works with .env and session cookies
// var cookiesArray = document.cookie.split(';');
// var adminButton = document.getElementById('admin-button');
// if (cookiesArray[1]) {
//   adminButton.style.display = 'inline';
// }

//for redirect
var currentUrl = window.location.search;
if (currentUrl === "?error=notadmin") {
  var adminButton = document.getElementById('admin-button');
  var errorMessage = document.getElementById('error-fill');
  adminButton.style.display = 'none';
  errorMessage.innerHTML = "You are not an admin";
}
