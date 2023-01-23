const input = document.querySelector('#inputText');
const button = document.querySelector('#btnAdd');
const list = document.querySelector('#list');
const removeItem = document.querySelector('#removeItem');
const overlay = document.querySelector('#overlay');
const btnYes = document.querySelector('#btnYes');
const btnNo = document.querySelector('#btnNo');
const cal = document.querySelector('#calendar');
let toDoArray = [];
let toDoDone = [];

input.focus();

if (localStorage.getItem('toDoList')) {
	toDoArray = JSON.parse(window.localStorage.getItem('toDoList'));
	toDoDone = JSON.parse(window.localStorage.getItem('toDoListDone'));
	toDoArray.forEach(toDoText => createLi(toDoText));
}

checkInput();

function checkInput() {
	if (input.value === '') blockedButton(true);
	else addToDo();
}

function blockedButton(onOff) {
	if (onOff === true) {
		button.classList.add('empty');
		button.disabled = true;
	} else {
		button.classList.remove('empty');
		button.disabled = false;
	}
}

function createLi(toDoText) {
	const li = document.createElement('li');
	li.textContent = toDoText;
	list.appendChild(li);
	let item = document.querySelector('li');
	let filterArray = toDoDone.filter(el => el === li.textContent);
	filterArray.map(() => li.classList.add('done'));
	console.log(item);
	console.log(filterArray);
}

function deleteItem(item) {
	item.remove(item);
	let arr = toDoArray.filter(el => el !== item.textContent);
	let arrDone = toDoDone.filter(el => el !== item.textContent);
	toDoArray = arr;
	toDoDone = arrDone;
	window.localStorage.setItem('toDoList', JSON.stringify(toDoArray));
	window.localStorage.setItem('toDoListDone', JSON.stringify(toDoDone));
}

input.addEventListener('keyup', e => {
	if (e.target.value === '') {
		blockedButton(true);
		return;
	} else {
		blockedButton(false);
	}
});

function addToDo() {
	let newItem = input.value;
	if (toDoArray.includes(newItem)) return;
	createLi(newItem);
	toDoArray.push(newItem);
	input.value = '';
	cal.value = '';
	input.focus();
	window.localStorage.setItem('toDoList', JSON.stringify(toDoArray));
	checkInput();
}

function checkDone(item) {
	if (item.classList.contains('done')) {
		toDoDone.push(item.textContent);
	} else {
		let arr = toDoDone.filter(el => el !== item.textContent);
		toDoDone = arr;
	}
	window.localStorage.setItem('toDoListDone', JSON.stringify(toDoDone));
}

function doneToDo(e) {
	let item = e.target.closest('li');
	item.classList.toggle('done');
	checkDone(item);

	item.addEventListener('dblclick', () => {
		item.classList.add('done');
		addActive();
	});

	btnYes.addEventListener('click', () => {
		item.className !== 'done' ? null : deleteItem(item);
		noActive();
	});

	btnNo.addEventListener('click', () => {
		noActive();
	});
}

function addActive() {
	overlay.classList.add('active');
	removeItem.classList.add('active');
}

function noActive() {
	overlay.classList.remove('active');
	removeItem.classList.remove('active');
}

list.addEventListener('click', doneToDo);
button.addEventListener('click', addToDo);
input.addEventListener('keypress', e => {
	if (input.value === '') return;
	if (e.key === 'Enter') {
		e.preventDefault();
		addToDo();
	}
});

cal.addEventListener('change', () => {
	let dataText = cal.value;
	let dataSplit = dataText.split('-');
	let dataLocal = dataSplit[2] + '-' + dataSplit[1] + '-' + dataSplit[0];
	input.value = dataLocal + ': ';
	blockedButton(false);
});
