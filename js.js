"use strict";

const SIMPLE_ARRAY = [,'','','','','','','','','',''];
const FIRST_PAGE = 1;

window.onload = function() {
  getId('prevButton').setAttribute('disabled', '');
  getId('prevButton').setAttribute('class', 'MyPaginationDisabled')
  createPersons();
  createArrows();
  cheackLocalStorage(FIRST_PAGE);
}

function getId(id) {
  return document.getElementById(id);
}

function createElem(name) {
  return document.createElement(name);
}

// Create Markup
function createArrows() {
  for (let i in SIMPLE_ARRAY) {
    let parrent = getId(`person${i}`);
    let arrow = createElem('i');

    arrow.setAttribute('id', `personImg${i}`);
    arrow.setAttribute('class', 'fas fa-arrow-down imagePerson');
    parrent.appendChild(arrow);
  }
}

function createPersons() {
  let ulPersons = getId('persons');
  for (let i in SIMPLE_ARRAY) {
    let liPerson = createElem('li');
    let namePerson = createElem('p');

    liPerson.setAttribute('id', `person${i}`);
    liPerson.setAttribute('class', 'person');
    liPerson.setAttribute('onclick', `personDescriptionUpDown(${i})`);
    
    namePerson.setAttribute('class', 'textPerson');
    liPerson.appendChild(namePerson);
    ulPersons.appendChild(liPerson);
  }
}

// Fill fields
function cheackLocalStorage(pageNumber) {
  hideAllPersons();
  if (localStorage.getItem(`page${pageNumber}`)) {
    fillCharacters(pageNumber);
  } else {
    fetch(`https://swapi.co/api/people/?page=${pageNumber}`)
      .then( response => {
        if (response.status !== 200) {
          console.log(`Error: ${response.status}`);
        } else {
          return response.json();
        }
      })
      .then( response => {
        localStorage.setItem( `page${pageNumber}`, JSON.stringify(response) );
        fillCharacters(pageNumber);
      })
      .catch( error => console.log(error));
  };
}

function fillCharacters(pageNumber) {
  let page = JSON.parse( localStorage.getItem( `page${pageNumber}` ) );

  page.results.forEach( (item, i) => {
    let numberPerson = +i + 1;
    getId( `person${numberPerson}` ).firstChild.innerHTML = item.name;
  } );

  showAllPersons(page.results.length + 1);
}

// Description
function personDescriptionUpDown(numberPerson) {
  if ( getId( `description${numberPerson}` ) ) { //up

    let arrow = getId( `personImg${numberPerson}` );
    arrow.setAttribute('class', 'fas fa-arrow-down imagePerson');
    getId( `description${numberPerson}` ).remove();

  } else { // down

    let arrow = getId( `personImg${numberPerson}` );
    arrow.setAttribute('class', 'fas fa-arrow-left imagePerson');

    let person = getId( `person${numberPerson}` );
    let description = createElem('ul');

    person.appendChild(description);
    description.setAttribute('id', `description${numberPerson}`);
    description.setAttribute('class', 'list-group');
    createDescription(numberPerson);

  }
}

function createDescription(numberPerson) {
  let character  = seekCurrentCharacter(numberPerson);
  let description = getId(`description${numberPerson}`);
  for (let i = 1; i < 6; i++) {
    let descriptionLi = createElem('li');
    description.appendChild(descriptionLi);
    descriptionLi.setAttribute('class', 'list-group-item');

    switch(i) {
      case 1:
      descriptionLi.innerHTML = `Рост: ${character.height}`;
      break;
      case 2:
      descriptionLi.innerHTML = `Вес: ${character.mass}`;
      break;
      case 3:
      descriptionLi.innerHTML = `Цвет волос: ${character.hair_color}`;
      break;
      case 4:
      descriptionLi.innerHTML = `Цвет глаз: ${character.eye_color}`;
      break;
      case 5:
      descriptionLi.innerHTML = `Дата рождения: ${character.birth_year}`;
      descriptionLi.style.margin = '0 0 20px 0';
      break;
    }
  }
}

function seekCurrentCharacter(numberPerson) {
  let nameCharacter = getId( `person${numberPerson}` ).firstChild.innerHTML;

  for (let i in SIMPLE_ARRAY) {
    let page = JSON.parse( localStorage.getItem( `page${i}` ) );
    let character = characterFromPage(page, nameCharacter);
    if ( character ) {
      return character;
    }
  }
}

function characterFromPage (page, nameCharacter) {
  let character = 0;
  page.results.forEach( (item) => {
    if (item.name == nameCharacter) {
      character = item;
    }
  } );
  return character;
}

// Pagination
function prevPage() {
  let currentPage = getId('currentPage').firstChild.innerHTML;
  if (currentPage == 9) {
    getId('nextButton').removeAttribute('disabled');
    getId('nextButton').setAttribute('class', 'MyPagination')
  } 
  if (currentPage == 2) {
    getId('prevButton').setAttribute('disabled', ''); 
    getId('prevButton').setAttribute('class', 'MyPaginationDisabled')
  }

  getId('currentPage').firstChild.innerHTML = currentPage - 1;
  cheackLocalStorage(currentPage - 1);
}

function nextPage() {
  let currentPage = +getId('currentPage').firstChild.innerHTML;
  if (currentPage == 1) {
    getId('prevButton').removeAttribute('disabled');
    getId('prevButton').setAttribute('class', 'MyPagination')
  } 
  if (currentPage > 7) {
    getId('nextButton').setAttribute('disabled', ''); 
    getId('nextButton').setAttribute('class', 'MyPaginationDisabled')
  }

  getId('currentPage').firstChild.innerHTML = currentPage + 1;
  cheackLocalStorage(currentPage + 1);
}

// Search
function search() {
  let searchedCharacters = [];
  let searchingName = getId('searchInput').value.toLowerCase();

  if ( !getId('searchInput').value ) { 
    finalSearch(searchedCharacters);
    return;
  }

  for (let i in SIMPLE_ARRAY) {
    let page = JSON.parse(localStorage.getItem( `page${i}` ));

    if ( !localStorage.getItem( `page${i}` ) ) { // Page not exist in Local Storage
      finalSearch(searchedCharacters);
      return;
    }

    page.results.forEach( (item) => {
      let nameCharacter = item.name.toLowerCase();
      if (nameCharacter.includes(searchingName)) { 
        searchedCharacters.push( item.name );
      }
    })
  }
}

function finalSearch(searchedCharacters) {
  getId('searchInput').value = '';
  hideAllPersons();

  if (!searchedCharacters.length) {
    setCurrentPage1()
    cheackLocalStorage(FIRST_PAGE);
    return;
  } else {
    fillSearchingPersons(searchedCharacters);
  }

  setCurrentPage1()
  createButtonShow();
  return;
}

function fillSearchingPersons(searchedCharacters) {
  let quantityPersons = searchedCharacters.length + 1;

  if (searchedCharacters.length > 10) {
    quantityPersons = 11;
  }

  for (let i = 1; i < quantityPersons; i++) {
    getId( `person${i}` ).firstChild.innerHTML = searchedCharacters[i - 1];
  }

  showAllPersons(quantityPersons);
}

function createButtonShow() {
  let buttonShow = createElem('button');
  getId('mainContent').appendChild(buttonShow);

  buttonShow.setAttribute('onclick', `cheackLocalStorage(${FIRST_PAGE})`);
  buttonShow.setAttribute('id', 'buttonShow');
  buttonShow.innerHTML = 'На главную';
}

function setCurrentPage1() {
  getId('currentPage').firstChild.innerHTML = 1;
  getId('prevButton').setAttribute('disabled', ''); 
  getId('prevButton').setAttribute('class', 'MyPaginationDisabled')
  getId('nextButton').removeAttribute('disabled');
}

// hide/show persons
function hideAllPersons() {
  for (let i in SIMPLE_ARRAY) {
    getId( `person${i}` ).style.display = 'none';
  }
  getId('load').style.visibility = "visible";
}

function showAllPersons(quantity) {
  if (quantity > 11 || quantity < 1) {
    quantity = 11;
  }

  if (getId('buttonShow')) {
    getId('buttonShow').remove();
  }

  for (let i = 1; i < quantity; i++) {
    getId( `person${i}` ).style.display = 'block';
  }
  getId('load').style.visibility = "hidden";
}