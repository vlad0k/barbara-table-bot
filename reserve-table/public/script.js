var xhr = new XMLHttpRequest();


var state = getState(xhr);
createReserveInfo(state);
let guestsAreHereButton = document.getElementsByClassName('buttonsWrapper__button_guestsAreHere')[0];
guestsAreHereButton.onclick = guestsAreHereClick;
var styleState = {};

setInterval(
    () => {
      document.body.innerHTML = '';
      createReserveInfo(state);
      state = getState(xhr);
    }, 10000
  );

function getState(xhr){
  xhr.open('GET', '/reserve', false);
  xhr.send();
  return JSON.parse(xhr.responseText);
}

function createReserveInfo(state) {
  for ( i in state){
    let reserveInfo = document.createElement("ul");
    reserveInfo.className = 'reserveItem';
    for ( j in state[i]){
      let reserveElem = document.createElement('li');
      reserveElem.className = 'reserveItem__elem';
      reserveElem.innerHTML = `${j}: ${state[i][j]}`;
      reserveInfo.appendChild(reserveElem)
    }
    reserveInfo.appendChild(createButBlock());
    document.body.appendChild(reserveInfo);
  }
}

function createButBlock() {
  var buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'buttonsWrapper';
  var guestsAreHereButton = document.createElement('button');
  guestsAreHereButton.className = 'buttonsWrapper__button buttonsWrapper__button_guestsAreHere';
  guestsAreHereButton.innerHTML = '✓';
  var delReserveButton = document.createElement('button');
  delReserveButton.className = 'buttonsWrapper__button buttonsWrapper__button_delReserve';
  delReserveButton.innerHTML = '✖';
  buttonsWrapper.appendChild(guestsAreHereButton);
  buttonsWrapper.appendChild(delReserveButton);
  guestsAreHereButton.onclick = guestsAreHereClick;
  return buttonsWrapper
}

function guestsAreHereClick(elem) {
  console.log(event);
  reserveItem = event.currentTarget.parentNode.parentNode;
  console.log(reserveItem);
  reserveItem.className += ' reserveItem_guestsAreHere';
}


// function reserveItemFiller(reserveItem, state) {
//   var
// }
