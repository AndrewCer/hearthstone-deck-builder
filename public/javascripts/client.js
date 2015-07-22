//count number of cards in staging area and limit same cards to 2
//change remove card to client side dom manipulation with ajax call to server
//possible strat: and have the  dom side hide selected cards and server remove the selected cards from db


// div.card
//   p.hidden-name= card.name
//   img(src=card.img)
//new code for displaying cards based off of what filter the user clicks 'i.e. shaman and such'
var classOptions = document.getElementsByClassName('class-options');
var currentUrl = document.URL;
currentUrl = currentUrl.split('/');
var usersName = currentUrl[4];
var cardDiv = document.getElementsByClassName('card');
var cardImgDiv = document.getElementsByClassName('card-img')[0];
var classFilterArray = []
console.log(cardDiv);
for (var i = 0; i < classOptions.length; i++) {
  classOptions[i].addEventListener('click', function (a) {
    a.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/class-deck/' + this.innerHTML + '/' + usersName , false);
    xhr.send(null);
    var parsedObj = JSON.parse(xhr.responseText);
    // console.log(parsedObj.usersCards);
    cardImgDiv.innerHTML = '';
    for (var i = 0; i < parsedObj.usersCards.length; i++) {
      console.log(parsedObj.usersCards[i]);
      xhr.open('GET', '/single-card/' + parsedObj.usersCards[i], false);
      xhr.send(null);
      var singleCardObj = JSON.parse(xhr.responseText);
      singleCardObj = singleCardObj.body;
      classFilterArray.push(singleCardObj);
    }
    console.log(classFilterArray);
  });
}

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

// var deleteName = document.getElementsByClassName('card-name');
// var deleteCost = document.getElementsByClassName('card-cost');
var deleteCard = document.getElementsByClassName('delete-card');
var deleteDataRow = document.getElementsByClassName('data-row');
for (var i = 0; i < deleteDataRow.length; i++) {
  deleteCard[i].addEventListener('click', function () {
    deleteDataRow[i].remove();
    // deleteName[i].parentNode.removeChild(deleteName[i]);
    // deleteCost[i].parentNode.removeChild(deleteCost[i]);
    // deleteCard[i].parentNode.removeChild(deleteCard[i]);
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
    xhr.open('GET', '/filter/' + className , false);
    xhr.send(null);
    var parsedObj = JSON.parse(xhr.responseText);
    var parsedObj = parsedObj.body;
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
    var countingCards = 0
    for (var i = 0; i < cardDiv.length; i++) {
      cardId[i].addEventListener('click', function (a) {
        if (holdingArray.length < 30) {
          a.preventDefault();
          holdingArray.push(this);
          for (var j = 0; j < holdingArray.length; j++) {
            if (holdingArray[j] === this) {
              countingCards ++
              break
            }
          }
          var singleCardId = this.href.split('/')[4];
          var xhr = new XMLHttpRequest();
          xhr.open('GET', '/single-card/' + singleCardId , false);
          xhr.send(null);
          var parsedObj = JSON.parse(xhr.responseText);
          var parsedObj = parsedObj.body;
          objectArray.push(parsedObj);
          var tableRow = document.createElement('tr');
          tableRow.className = 'card-count'
          var cardName = document.createElement('td');
          var cardCost = document.createElement('td');
          var cardCountTd = document.createElement('td');
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
          tableRow.appendChild(cardCountTd);
          cardName.innerHTML = parsedObj[0].name;
          cardCountTd.innerHTML = countingCards;
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
      xhr.open('GET', '/single-card/' + singleCardId , false);
      xhr.send(null);
      var parsedObj = JSON.parse(xhr.responseText);
      var parsedObj = parsedObj.body;
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

//for redirect
var currentUrl = window.location.search;
if (currentUrl === "?error=notadmin") {
  var adminButton = document.getElementById('admin-button');
  var errorMessage = document.getElementById('error-fill');
  adminButton.style.display = 'none';
  errorMessage.innerHTML = "You are not an admin";
}

//for future refac
// function apiCall() {
//   var currentUrl = document.URL;
//   currentUrl = currentUrl.split('/');
//   var className = currentUrl[4];
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', '/single-card/' + singleCardId , false);
//   xhr.send(null);
//   var parsedObj = JSON.parse(xhr.responseText);
// }
//
// apiCall();
