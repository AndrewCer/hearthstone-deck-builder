var submit = document.getElementById('filterSubmit');
submit.addEventListener('click', function () {
  var cardImgDiv = document.getElementsByClassName('card-img')[0];
  var attack = document.getElementsByClassName('attack');
  var cost = document.getElementsByClassName('cost');
  var currentUrl = document.URL;
  currentUrl = currentUrl.split('/');
  var className = currentUrl[4];
  var cardArray = [];
  var costArray = [];
  var attackArray = [];
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
    for (var i = 0; i < parsedObj.length; i++) {
      if (parsedObj[i].img) {
        if (costArray.length > 0) {
          for (var j = 0; j < costArray.length; j++) {
            if (parsedObj[i].cost === parseInt(costArray[j])) {
              cardArray.push(parsedObj[i]);
            }
          }
        }
        if (attackArray.length > 0) {
          for (var j = 0; j < attackArray.length; j++) {
            if (parsedObj[i].attack === parseInt(attackArray[j])) {
              cardArray.push(parsedObj[i]);
            }
          }
        }
      }
    }
    console.log(attackArray);
    console.log(cardArray);
    cardImgDiv.innerHTML = '';
    for (var i = 0; i < cardArray.length; i++) {
      var img = document.createElement('img');
      cardImgDiv.appendChild(img);
      img.src = cardArray[i].img
    }

});
