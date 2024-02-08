'use strict mode';
const input = document.querySelector('#inputText');
const button = document.querySelector('#btnAdd');
const list = document.querySelector('#list');
const removeItem = document.querySelector('#removeItem');
const editItem = document.querySelector('#editItem');
const overlay = document.querySelector('#overlay');
const btnYes = document.querySelector('#btnYes');
const btnAccept = document.querySelector('#btnAccept');
const btnReject = document.querySelector('#btnReject');
const btnNo = document.querySelector('#btnNo');
const cal = document.querySelector('#calendar');
const inputToDoChange = document.querySelector('#inputToDoChange');
let toDoArray = [];
let toDoDone = [];

input.focus();

// sprawdzanie czy znajduje się dane w localStorage i zaczytywanie ich do aplikacji
// z 2 tablic: jedna to wszyskie wpisy, 2 to wpisy już wykonane zaznaczone na czerwono

if (localStorage.getItem('toDoList') || localStorage.getItem('toDoListDone')) {
	toDoArray = JSON.parse(window.localStorage.getItem('toDoList'));
	toDoDone = JSON.parse(window.localStorage.getItem('toDoListDone'));
	toDoArray.forEach(toDoText => createLi(toDoText));
}

checkInput(); //sprawdzenie czy coś jest wpisane w inpucie jeśli nie to jest blokowany button

function checkInput() {
	if (input.value === '') blockedButton(true);
	else addToDo();
}

// funkcja blokująca klawisz
function blockedButton(onOff) {
	if (onOff === true) {
		button.classList.add('empty');
		button.disabled = true;
	} else {
		button.classList.remove('empty');
		button.disabled = false;
	}
}

//  funkcja generująca wpis - notatkę

function createLi(toDoText) {
	const li = document.createElement('li');
	li.textContent = toDoText;
	list.appendChild(li);

	// tu filtruje tablice z notatami zaznaczonym na czerowono i po wczytaniu są one zaznaczone jako wykonane
	if ((toDoDone = [])) return;
	let filterArray = toDoDone.filter(el => el === li.textContent);
	filterArray.map(() => li.classList.add('done'));
}

// funkcja kasująca dany wpis - notatkę, filtujemy jaki wpis został usunięty i uaktualniamy 2 tablice
function deleteItem(item) {
	item.remove(item);
	let arr = toDoArray.filter(el => el !== item.textContent);
	let arrDone = toDoDone.filter(el => el !== item.textContent);
	toDoArray = arr;
	toDoDone = arrDone;
	window.localStorage.setItem('toDoList', JSON.stringify(toDoArray));
	window.localStorage.setItem('toDoListDone', JSON.stringify(toDoDone));
}

// funkcja zawierdzająca wpis notatki klawiszem Enter i sprawdzająca czy coś jest wpisane w inpucie
input.addEventListener('keyup', e => {
	if (e.target.value === '') {
		blockedButton(true);
		return;
	} else {
		blockedButton(false);
	}
});

// funkcja dodająca notatkę z inpucie i wysyłająca ją do funkcji tworzącej wpis na liście i zapisująca w tablicy i localStorage
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

// funkcja sprawdzajaca notatkę zaznaczoną na czerwono i zapisująca ją w tablicy i localStorage
function checkDone(item) {
	if (item.classList.contains('done')) {
		toDoDone.push(item.textContent);
	} else {
		let arr = toDoDone.filter(el => el !== item.textContent);
		toDoDone = arr;
	}
	window.localStorage.setItem('toDoListDone', JSON.stringify(toDoDone));
}

// funkcja tworząca notatkę - wykonano (czerwoną)
function doneToDo(e) {
	let item = e.target.closest('li');
	item.classList.toggle('done');
	checkDone(item);
	// jeśli klikniemy dwukrotnie na notatce zielonej to wyskakuj modal z możliwością edycji a jeśli na czerwonej to modal do usunięcia
	item.addEventListener('dblclick', () => {
		if (item.classList.contains('done')) {
			addRemoveModalActive(); //przeniesienie do funkcji włączjącej modal do usuwania notatki
		} else {
			addEditModalActive(); //przeniesienie do funkcji włączjącej modal do edycji notatki
			editToDoBox(item); //funkcja gdzie edytuje się notatkę
		}
	});

	btnYes.addEventListener('click', () => {
		item.className !== 'done' ? null : deleteItem(item); //funkcja usuwająca notatkę
		removeModalNoActive(); //gdy klikniemy na przycisk TAk to usuwamy notatkę i modal znika
	});

	btnNo.addEventListener('click', () => {
		removeModalNoActive(); //gdy klikniemy na przycisk Nie modal znika
	});
}

// funkcja uaktywniająca modal do usuwania notatki
function addRemoveModalActive() {
	overlay.classList.add('active');
	removeItem.classList.add('active');
}

// funkcja do chowania modalu usuwającego notatkę
function removeModalNoActive() {
	overlay.classList.remove('active');
	removeItem.classList.remove('active');
}

// funkcja uaktywniająca modal do edycji notatki
function addEditModalActive() {
	editItem.classList.add('active');
	overlay.classList.add('active');
}

// funkcja do chowania modalu edytującego notatkę
function editModalNoActive() {
	editItem.classList.remove('active');
	overlay.classList.remove('active');
}

list.addEventListener('click', doneToDo); //delegacja zdarzeń clik przypisany na element ul

button.addEventListener('click', addToDo); //button zatwierdzjący to co zostało wpisane w inpucie

//zatwierdzenie tego co wpisaliśmy do input poprzez klawisz Enter
input.addEventListener('keypress', e => {
	if (input.value === '') return;
	if (e.key === 'Enter') {
		addToDo();
	}
});

//funkcja wywołująca kalkulator i wstawiająca date w pole input
cal.addEventListener('change', () => {
	let dataText = cal.value;
	let dataSplit = dataText.split('-');
	let dataLocal = dataSplit[2] + '-' + dataSplit[1] + '-' + dataSplit[0];
	input.value = dataLocal + ': ';
	blockedButton(false);
});

// funkcja do edytowania notatki i jej zmiany
function editToDoBox(item) {
	let oldToDoText = item.textContent;
	inputToDoChange.value = oldToDoText;
	inputToDoChange.addEventListener('keypress', e => {
		if (e.key === 'Enter') {
			acceptChanges(item, oldToDoText);
		}
	});

	btnAccept.addEventListener('click', () => {
		acceptChanges(item, oldToDoText);
	});

	btnReject.addEventListener('click', () => {
		editModalNoActive();
	});
}

// funkcja wprowadzająca dane do inputu uaktualniającego notkę
function acceptChanges(item, oldToDoText) {
	let newToDoText = inputToDoChange.value;
	if (newToDoText === '' || toDoArray.includes(newToDoText)) return;
	item.textContent = newToDoText;
	console.log(oldToDoText, newToDoText);
	editModalNoActive();
	actualisationArrays(oldToDoText, newToDoText);
}

// funkcja akualizująca notkę i zmieniająca stary wpis na nowy i zapisująca w localStorage i renderująca widok
function actualisationArrays(oldToDoText, newToDoText) {
	let oldIndex = toDoArray.findIndex(el => el == oldToDoText);
	toDoArray.splice(oldIndex, 1, newToDoText);
	console.log(oldToDoText, newToDoText, oldIndex, toDoArray);
	window.localStorage.setItem('toDoList', JSON.stringify(toDoArray));
	location.reload();
}

// sposób na wymianę 2 liczb w tablicy
// var ele = Array(10, 20, 300, 40, 50);
// ele[ele.map((x, i) => [i, x]).filter(
// x => x[1] == 300)[0][0]] = 30
// console.log(ele);
