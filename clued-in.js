let subPlayer = document.querySelector('#subPlayer');
let subHand = document.querySelector('#submitHand');
let donePlayers = document.querySelector('#donePlayers');
let instructions = document.querySelector('#instructions');
let table = document.querySelector('#playerGrid');
let playerSelectSpace = document.querySelector('#playerSelect');
let handSpace = document.querySelector('#enterHand');
let remainingCards = document.querySelector('#remainingCardsGrid');
let suggestWindow = document.querySelector('#suggestWindow');
let suggested = document.querySelector('#suggested');
let addHandCounter = [];
let players = [];
let me;
const handlers = [];
const cardInfo = [];
let counter = 0;
let suggestion = [];
let turnCounter;
suggestion.length = 4;
let solution = [];
let rooms = ['hall', 'billiards', 'dining', 
			'lounge', 'study', 'library', 
			'kitchen', 'conservatory', 'ballroom'];
let weapons = ['revolver', 'knife', 'rope', 'candlestick', 'leadPipe', 'wrench'];
let people = ['mustard', 'scarlet', 'plum', 'green', 'peacock', 'white'];
let showedMe = false;

document.querySelector('#newPlayer').focus();
subPlayer.addEventListener('click', addPlayer);
donePlayers.addEventListener('click', initPlayers);
subHand.addEventListener('click', submitHand);

let allCards = document.querySelectorAll('.imgCard');
allCards.forEach((card) => {
	cardInfo[counter++] = card.id;
	cardInfo[counter++] = card.data;
	cardInfo[counter++] = 'unassigned';
	cardInfo[counter++] = card.querySelector('param').value;
});

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
	
	//creating new content
	let newRow = document.createElement('div');
	let cardSpaces = document.createElement('div');
	let playerSelect = document.createElement('button');
	let playerInfo = [playerName.value];
	let cardSpaceId = playerName.value + 'CardSpace';
	
	newRow.classList.add('playerName');
	newRow.textContent = playerName.value;
	cardSpaces.classList.add('playerCards');
	cardSpaces.setAttribute('id', cardSpaceId);
	playerSelect.classList.add('selectMe');
	playerSelect.id = playerName.value;
	playerSelect.textContent = playerName.value;

	//Adding new content
	players.push(playerInfo);
	playerSelect.value = players.length - 1;
	table.appendChild(newRow);
	table.appendChild(cardSpaces);
	playerSelectSpace.appendChild(playerSelect);
	
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
			let mightHaves = [];
			let cantHaves = [];
			handSize.length = cardsPerPerson;
			players[i].push(handSize.length);
			players[i].push(handSize);
			players[i].push(mightHaves);
			players[i].push(cantHaves);
			addHandCounter[i] = 0;
		}
	} else {
		let i = 0
		for (; i < extraCards; i++) {
			let handSize = [];
			let mightHaves = [];
			let cantHaves = [];
			handSize.length = cardsPerPerson + 1;
			players[i].push(handSize.length);
			players[i].push(handSize);
			players[i].push(mightHaves);
			players[i].push(cantHaves);
			addHandCounter[i] = 0;
		}
		while(i < players.length) {
			let handSize = [];
			let mightHaves = [];
			let cantHaves = [];
			handSize.length = cardsPerPerson;
			players[i].push(handSize.length);
			players[i].push(handSize);
			players[i].push(mightHaves);
			players[i].push(cantHaves);
			addHandCounter[i] = 0;
			i++;
		}
	}
	
	//add the card spaces to each row
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
	playerSelectSpace.classList.toggle('disappear');
	document.querySelector('#subPlayer').classList.toggle('.selectMe');
	document.querySelector('#donePlayers').classList.toggle('.selectMe');
	instructions.textContent = 'Please select which player you are by clicking on your name.';
	addEvents('click', '.selectMe', selectSelf);
}

function selectSelf(name) {
	me = name.textContent;
	me = findPerson(me);
	playerSelectSpace.classList.toggle('disappear');
	dropEvents('.selectMe');
	document.getElementById('submitHand').className = 'selectMe';
	allotHand();
}

function allotHand() {
	instructions.textContent = 'Click on the cards that you have been dealt. If you make a mistake, just click on the card in your hand to put it back. Once it is all set, click Confirm.';
	handSpace.classList.toggle('disappear');
	for (let i = 1; i <= players[me][1]; i++) {
		let card = document.createElement('img');
		card.classList.add('card');
		handSpace.insertBefore(card, document.querySelector('#submitHand'));
	}
	handSpace.insertBefore(document.createElement('br'), document.querySelector('#submitHand'));
	addEvents('click', '.imgCard', addMyHand);
}

function addMyHand(card) {
	if (addHandCounter[me] < players[me][1]) {
		addHandCounter[me]++;
		let handCard = document.querySelector('.card');
		handCard.src = card.data;
		handCard.alt = card.id;
		handCard.className = 'holder';
		card.data = '';
		card.className = 'card';
		dropEvent(card);
		handCard.addEventListener('click', function(){putBack(handCard, card)});
	}
}

function putBack(card, oldCard) {
	oldCard.data = card.src;
	handSpace.removeChild(card);
	oldCard.className = 'imgCard';
	oldCard.addEventListener('click', handlers[oldCard.id]);
	let reAddCard = document.createElement('img');
	reAddCard.className = 'card';
	handSpace.insertBefore(reAddCard, document.querySelector('#enterHand > br'));
	addHandCounter[me]--;
}

function submitHand() {
	if (addHandCounter[me] < players[me][1]) {
		alert('You need to add more cards.');
		return;
	}
	dropEvents('.imgCard')
	let cards = document.querySelectorAll('.holder');
	cards.forEach((card) => {
			assignCard(card, me);
	});
	hide(handSpace);
	hide(suggestWindow);
	suggestWindow.classList.toggle('suggestWindow');
	instructions.textContent = 'And now we begin! You must enter in a suggestion!';
	document.querySelector('#submitSuggestion').className = 'selectMe';
	playerSelectSpace.classList.toggle('disappear');
	addEvents('click', '#playerSelect > .selectMe', selectSuggester);
	addEvents('change', '#suggestWindow > select', suggestThing);
	document.querySelector('#submitSuggestion').addEventListener('click', submitSuggestion);
}

function selectSuggester(name) {
	if (suggestion[0]) {
		let playerOptions = playerSelectSpace.querySelectorAll('.selectMe');
		playerOptions.forEach((player) => {
			if (player.style = 'background-color: red') player.style = '';
		});
	}
	suggestion[0] = name.value;
	name.style = 'background-color: red';
}

function suggestThing(thing) {
	let suggestImgs = suggestWindow.querySelectorAll('img')
	suggestImgs.forEach((suggestImg) => {
		if (suggestImg.id == thing.id) {
			for (let i = 0; i < cardInfo.length; i++) {
				if (thing.value == cardInfo[i]) {
					suggestImg.src = cardInfo[i + 1];
					suggestImg.alt = thing.value;
					switch(thing.id) {
						case 'personSuggestion':
							suggestion[1] = suggestImg;
							break;
						case 'weaponSuggestion':
							suggestion[2] = suggestImg;
							break;
						case 'roomSuggestion':
							suggestion[3] = suggestImg;
							break;
					}
				}

			}
		}
	});
}

function submitSuggestion() {
	//first things first, get rid of suggestion items if they have already been assigned
	for (let x = 1; x <= 3; x++) {
		for (let i = 0; i < cardInfo.length; i++){
			if (suggestion[x].alt == cardInfo[i] && cardInfo[i + 2] == 'assigned') {
				suggestion[x] = null;
				//suggestion needs to be struck out 
				break;
			}
		}
	}

	initSuggestion();
	let show = document.querySelector('#show');
	let pass = document.querySelector('#pass');
	show.classList.toggle('selectMe');
	pass.classList.toggle('selectMe');
	show.addEventListener('click', showed);
	pass.addEventListener('click', passed);

	if (suggestion[0] == players.length - 1) turnCounter = 0;
	else turnCounter = Number(suggestion[0]) + 1;
	if (turnCounter == me) {
		instructions.textContent = `What did ${players[turnCounter][0]} end up doing?`;
	}

	instructions.textContent = `What did ${players[turnCounter][0]} end up doing?`;
}

function showed() {
	if (suggestion[0] == me) {
		instructions.textContent = `Which card did ${players[turnCounter][0]} show you?`;
		addEvents('click', '#suggestWindow > .card', assignCard);
		showedMe = true;
	} else {
		//check the shower's cantHaves array.
		let cardsLeft = 0;
		for (let x = 1; x <= 3; x++) {
			for (let i = 0; i < players[turnCounter][4].length; i++) {
				if(suggestion[x] != null && suggestion[x].alt == players[turnCounter][4][i]) { 
					suggestion[x] = null;
				}
			}

			if (suggestion[x] != null) cardsLeft++;
			if (cardsLeft == 1 && x == 3) {
				assignCard(suggestion[x], turnCounter);
				return;
			}

		}
		//at this point, whatever is left in the suggestion can go in the mightHaves
		let mightHave = [];
		for (let i = 1; i <= 3; i++) {
			if (suggestion[i]) mightHave.push(suggestion[i].alt);
		}
		players[turnCounter][3].push(mightHave);
		initSuggestion();
	}
}

function passed() {
	for (let i = 1; i <= 3; i++) {
		if (suggestion[i]) players[turnCounter][4].push(suggestion[i]);
	}
	if (turnCounter == players.length - 1) turnCounter = 0;
	else turnCounter++;
	instructions.textContent = `What did ${players[turnCounter][0]} end up doing?`;
	if (turnCounter == suggestion[0]) {
		initSuggestion();
		instructions.textContent = 'On to another suggestion.';
	}
}

function hide(child, parent) {
	if (!(parent)) {
		if (typeof child == 'object') {
			child.classList.toggle('disappear');
		} else {
			document.querySelector(child).classList.toggle('disappear');
		}
	} else {
		let kids = parent.querySelectorAll(child);
			kids.forEach((kid) => {kid.classList.toggle('disappear');});
	}
}

function addEvents(action, things, theFunction) {
	let names = document.querySelectorAll(things);
	names.forEach((name) => {
		handlers[name.id] = () => theFunction(name);
		name.addEventListener(action, handlers[name.id]);
	});
}

function findPerson(person) {
	for (let i = 0; i < players.length; i++) {
		if (person == players[i][0]) {
			return i;
		}
	}
}

function dropEvent(item) {
	item.removeEventListener('click', handlers[item.id]);
}

function dropEvents(things) {
	let drops = document.querySelectorAll(things);
	drops.forEach((drop) => {
		drop.removeEventListener('click', handlers[drop.id]);
	});
}

function isEmpty(array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] != null) return false;
		if (i == array.length - 1 && array[i] == null) return true;
	}
}

function assignCard(card, user) {
	if (!(user)) {
		user = turnCounter;
	}

	let myId = '#' + players[user][0] + 'CardSpace';
	let cardTarget = document.querySelector(myId);
	cardTarget.removeChild(cardTarget.querySelector('div'));
	let newImg = document.createElement('img');
	newImg.className = 'card';
	newImg.src = card.src;
	cardTarget.insertBefore(newImg, cardTarget.querySelector('div'));

	let oldCard = remainingCards.querySelector('#' + card.alt);
	oldCard.className = 'card';
	oldCard.data = '';

	for (let i = 0; i < cardInfo.length; i++) {
		if (card.alt == cardInfo[i]) {
			cardInfo[i + 2] = 'assigned';
			switch(cardInfo[i + 3]) {
				case 'room':
					removeFromCat(card, rooms);
					break;
				case 'person':
					removeFromCat(card, people);
					break;
				case 'weapon':
					removeFromCat(card, weapons);
					break;
			}
		}
	}

	//go through the mightHaves and eliminate each instance of the assigned card appearing.

	for (let x = 0; x < players.length; x++) {
		for (let y = 0; y < players[x][3].length; y++) {
			for (let i = 0; i < players[x][3][y].length; i++) {
				if (card.alt == players[x][3][y][i]) {
					players[x][3][y].splice(i, 1);
				}
				if (players[x][3][y].length == 1) {
					assignCard(players[x][3][y][0], players[x][0])
				}
			}
		}
	}

	players[user][2].push(card.alt);

	if (showedMe) {
		initSuggestion();
		showedMe = false;
	}
}

function removeFromCat (card, cat, x) {
	for (let i = 0; i < cat.length; i++) {
		if (cat[i] == card.alt) cat.splice(i, 1);
	}
	if (cat.length == 1) {
		solution.push(cat[0]);
		for (let i = 0; i < cardInfo.length; i++) {
			if (cardInfo[i] == cat[0]) cardInfo[i + 2] = 'assigned';
		}
	}
	if (solution.length == 3) {
		alert('I got the winner!');
	}
}

function initSuggestion() {
	hide(playerSelectSpace);
	hide('select', suggestWindow);
	hide('#submitSuggestion');
	hide('#showPass');
	let playerOptions = playerSelectSpace.querySelectorAll('.selectMe');
	playerOptions.forEach((player) => {
		if (player.style = 'background-color: red') player.style = '';
	});
	
	let selects = suggestWindow.querySelectorAll('select');
	let idCounter = 0;
	let suggestIds = ['personSuggestion', 'weaponSuggestion', 'roomSuggestion'];
	selects.forEach((select) => {select.value = 'select'});
	let suggestCards = suggestWindow.querySelectorAll('img');
	if (instructions.textContent != 'And now we begin! You must enter in a suggestion!'
			&& instructions.textContent != 'On to another suggestion.') {
		suggestCards.forEach((card) => {
			suggestWindow.removeChild(card);
			let reAddCard = document.createElement('img');
			reAddCard.className = 'card';
			reAddCard.id = suggestIds[idCounter++];
			suggestWindow.insertBefore(reAddCard, suggestWindow.querySelector('select'));
		});
	}
}