let subPlayer = document.querySelector('#subPlayer');
let donePlayers = document.querySelector('#donePlayers');
let instructions = document.querySelector('#instructions');
let table = document.querySelector('#playerGrid');
let players = [];
let me;

subPlayer.addEventListener('click', addPlayer);
donePlayers.addEventListener('click', initPlayers);

function addPlayer() {
	let playerName = document.querySelector('#newPlayer');

	//error handling
	if (players.length == 6) {
		alert("That's too many players!");
		return;
	}
	if (playerName.value == "") {
		alert("You didn't enter a name!");
		return;
	}
	
	let newRow = document.createElement('div');
	let cardSpaces = document.createElement('div');
	let playerInfo = [playerName.value];
	let cardSpaceId = playerName.value + 'CardSpace';
	
	players.push(playerInfo);
	
	newRow.classList.add('playerName');
	newRow.setAttribute('id', playerName.value);
	newRow.textContent = playerName.value;
	cardSpaces.classList.add('playerCards');
	cardSpaces.setAttribute('id', cardSpaceId);
	
	table.appendChild(newRow);
	table.appendChild(cardSpaces);
	
	playerName.value = "";
	playerName.focus();
}

function initPlayers() {
	if (players.length < 3) {
		alert('That\'s not enough people to play a legal game!');
		return;
	}

	//determining the # of cards each player gets
	let extraCards = 21 % players.length;
	let cardsPerPerson = Math.floor(21 / players.length);
	if (extraCards == 0) {
		for (let i = 0; i < players.length; i++) {
			let handSize = [];
			handSize.length = cardsPerPerson;
			players[i].push(handSize.length);
			players[i].push(handSize);
		}
	} else {
		let i = 0
		for (; i < extraCards; i++) {
			let handSize = [];
			handSize.length = cardsPerPerson + 1;
			players[i].push(handSize.length);
			players[i].push(handSize);
		}
		while(i < players.length) {
			let handSize = [];
			handSize.length = cardsPerPerson;
			players[i].push(handSize.length);
			players[i].push(handSize);
			i++;
		}
	}
	
	//add the card spaces
	for (let i = 0; i < players.length; i++) {
		let cardSpaceId = "#" + players[i][0] + 'CardSpace';
		let cardSpace = document.querySelector(cardSpaceId);
		for (let x = 1; x <= players[i][1]; x++) {
			let card = document.createElement('div');
			card.classList.add('card');
			cardSpace.appendChild(card);
		}
	}
	
	document.querySelector('#addPlayerFields').classList.toggle('disappear');
	document.querySelector('#enterHand').classList.toggle('disappear');
	instructions.textContent = 'Please select which player you are by clicking on your name.';
	
	let names = document.querySelectorAll('.playerName');
	names.forEach((name) => {
		name.addEventListener('click', () => {selectSelf(name)});
	});
	
	//add event listeners for all the cards to be clicked. 
}

function selectSelf(name) {
	me = name.id;
	alert(me);
	let names = document.querySelectorAll('.playerName');
	names.forEach((name) => {
		name.removeEventListener('click', () => {selectSelf(name)});
	});
}