"use strict";

const simpleArray = [,'','','','','','','','','',''];

window.onload = function() {
  getId('prevButton').setAttribute('disabled', '');
  createPersons();
  createArrows();
  cheackLocalStorage(1);
}

function getId(id) {
  return document.getElementById(id);
}

function createElem(name) {
  return document.createElement(name);
}

// Create Markup
function createArrows() {
  for (let i in simpleArray) {
    let parrent = getId('person' + i);
    let arrow = createElem('i');

    arrow.setAttribute('id', 'personImg' + i);
    arrow.setAttribute('class', 'fas fa-arrow-down imagePerson');
    parrent.appendChild(arrow);
  }
}

function createPersons() {
  let ulPersons = getId('persons');
  for (let i in simpleArray) {
    let liPerson = createElem('li');
    let namePerson = createElem('p');

    liPerson.setAttribute('id', 'person' + i);
    liPerson.setAttribute('class', 'person');
    liPerson.setAttribute('onclick', 'personDescriptionUpDown(' + i + ')');
    
    namePerson.setAttribute('class', 'textPerson');
    liPerson.appendChild(namePerson);
    ulPersons.appendChild(liPerson);
  }
}

// Fill fields
function cheackLocalStorage(pageNumber) {
  hideAllPersons();
  if (localStorage.getItem('page' + pageNumber)) {
    fillCharacters(pageNumber);
  } else {
    renderData(pageNumber);
    cheackerLocalStorage(pageNumber);
  };
}

function renderData(pageNumber) {
  let request = new  XMLHttpRequest();
  request.open('GET', 'https://swapi.co/api/people/?page=' + pageNumber);
  request.send(null);
  request.onreadystatechange = () => {
    if (request.readyState !== 4) {
        return;
      }
    if (request.status === 200) {
      let prePage = request.responseText;
      localStorage.setItem('page' + pageNumber, prePage);
    }
  }
}

function cheackerLocalStorage(pageNumber) {
  let cheackerInterval = setInterval( () => {
    if ( !localStorage.getItem('page' + pageNumber) ) {
      return;
    }
    clearInterval(cheackerInterval);  
    return cheackLocalStorage(pageNumber); 
  }, 200);
}

function fillCharacters(pageNumber) {
  let page = JSON.parse( localStorage.getItem('page' + pageNumber) );
  page.results.forEach( (item, i) => {
    let numberPerson = +i + 1;
    getId('person' + numberPerson).firstChild.innerHTML = item.name;
  } );
  showAllPersons(page.results.length + 1);
}

// Description
function personDescriptionUpDown(numberPerson) {
  if ( getId('description' + numberPerson) ) { //up
    let arrow = getId('personImg' + numberPerson);
    arrow.setAttribute('class', 'fas fa-arrow-down imagePerson');
    removeDescription(numberPerson);
  } else { // down
    let arrow = getId('personImg' + numberPerson);
    arrow.setAttribute('class', 'fas fa-arrow-left imagePerson');

    let person = getId('person' + numberPerson);
    let description = createElem('ul');

    person.appendChild(description);
    description.setAttribute('id', 'description' + numberPerson);
    description.setAttribute('class', 'list-group');
    createDescription(numberPerson);
  }
}

function createDescription(numberPerson) {
  let character  = seekCurrentCharacter(numberPerson);
  let description = getId('description' + numberPerson);
  for (let i = 1; i < 6; i++) {
    let descriptionLi = createElem('li');
    description.appendChild(descriptionLi);
    descriptionLi.setAttribute('id', 'person' + numberPerson + 'description' + i);
    descriptionLi.setAttribute('class', 'list-group-item');

    switch(i) {
      case 1:
      descriptionLi.innerHTML = 'Рост: ' + character.height;
      break;
      case 2:
      descriptionLi.innerHTML = 'Вес: ' + character.mass;
      break;
      case 3:
      descriptionLi.innerHTML = 'Цвет волос: ' + character.hair_color;
      break;
      case 4:
      descriptionLi.innerHTML = 'Цвет глаз: ' + character.eye_color;
      break;
      case 5:
      descriptionLi.innerHTML = 'Дата рождения: ' + character.birth_year;
      descriptionLi.style.margin = '0 0 20px 0';
      break;
    }
  }
}

function seekCurrentCharacter(numberPerson) {
  let nameCharacter = getId('person' + numberPerson).firstChild.innerHTML;
  for (let i in simpleArray) {
    let page = JSON.parse(localStorage.getItem('page' + i));
    for (let j in simpleArray) {
      if (page.results[j - 1].name == nameCharacter) {
        return page.results[j - 1];
      }
    }
  }
}

function removeDescription(numberPerson) {
  let person = getId('person' + numberPerson)
  person.removeChild(getId('description' + numberPerson));
}

// Pagination
function prevPage() {
  let currentPage = getId('currentPage').firstChild.innerHTML;
  if (currentPage == 9) {
    getId('nextButton').removeAttribute('disabled');
  } 
  if (currentPage == 2) {
    getId('prevButton').setAttribute('disabled', ''); 
  }

  getId('currentPage').firstChild.innerHTML = currentPage - 1;
  cheackLocalStorage(currentPage - 1);
}

function nextPage() {
  let currentPage = +getId('currentPage').firstChild.innerHTML;
  if (currentPage == 1) {
    getId('prevButton').removeAttribute('disabled');
  } 
  if (currentPage > 7) {
    getId('nextButton').setAttribute('disabled', ''); 
  }

  getId('currentPage').firstChild.innerHTML = currentPage + 1;
  cheackLocalStorage(currentPage + 1);
}

// Search
function search() {
  getId('currentPage').firstChild.innerHTML = 1;
  let searchedCharacters = [];

  if (getId('searchInput').value == '') { 
    finalSearch(searchedCharacters);
    return;
  }

  let searchingName = getId('searchInput').value;
  getId('searchInput').value = '';
  hideAllPersons();
  searchingName = searchingName.toLowerCase();
  
  for (let i = 1; i < 10; i++) {
    let page = JSON.parse(localStorage.getItem('page' + i));

    if (!localStorage.getItem('page' + i)) { // Page not exist in Local Storage
      finalSearch(searchedCharacters);
      return;
    }

    if (i == 9) { // lastPage
      for (let j = 1; j < 8; j++) {
        let nameCharacter = page.results[j - 1].name.toLowerCase();
        if (nameCharacter.includes(searchingName)) { 
          searchedCharacters.push( page.results[j - 1].name );
        }

        if (j == 7) { // lastCharacter
          finalSearch(searchedCharacters);
          return;
        }
      }
    } else { // notLastPage
      for (let j in simpleArray) {
        let nameCharacter = page.results[j - 1].name.toLowerCase();
        if (nameCharacter.includes(searchingName)) {
          searchedCharacters.push( page.results[j - 1].name );
        }
      }
    }

  }
}

function finalSearch(searchedCharacters) {
  if (searchedCharacters.length == 0) {
    alert('Ничего не найдено');
    showAllPersons();
    return;
  } else {
    showSearchingPersons(searchedCharacters);
  }

  createButtonShow();
  return;
}

function showSearchingPersons(searchedCharacters) {
  let quantityPersons = searchedCharacters.length + 1;

  if (searchedCharacters.length > 10) {
    quantityPersons = 11;
  }

  for (let i = 1; i < quantityPersons; i++) {
    getId('person' + i).firstChild.innerHTML = searchedCharacters[i - 1];
  }

  showAllPersons(quantityPersons);
}

function createButtonShow() {
  let parent = getId('mainContent');
  let buttonShow = createElem('button');

  parent.appendChild(buttonShow);
  buttonShow.setAttribute('onclick', 'cheackLocalStorage(1)');
  buttonShow.setAttribute('id', 'buttonShow');
  buttonShow.innerHTML = 'На главную';
}

// hide/show persons
function hideAllPersons() {
  for (let i = 1; i < 11; i++) {
    getId('person' + i).style.display = 'none';
  }
  getId('load').style.visibility="visible";
}

function showAllPersons(quantity) {
  if (quantity > 11 || quantity < 1) {
    alert('Ошибка кол-ва показываемых персонажей');
    quantity = 10;
  }

  if (getId('buttonShow')) {
    getId('mainContent').removeChild( getId('buttonShow') );
  }

  for (let i = 1; i < quantity; i++) {
    getId('person' + i).style.display = 'block';
  }
  getId('load').style.visibility = "hidden";
}