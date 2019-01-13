window.onload = function() {
  document.getElementById('prevButton').setAttribute('disabled', '');
  createPersons();
  createArrows();
  cheackLocalStorage(1);
}
// Create Markup
function createArrows() {
  for (let i = 1; i < 11; i++) {
    let parrent = document.getElementById('person' + i);
    let arrow = document.createElement('i');
    arrow.setAttribute('id', 'personImg' + i);
    arrow.setAttribute('class', 'fas fa-arrow-down imagePerson');
    parrent.appendChild(arrow);
  }
}
function createPersons() {
  let ulPersons = document.getElementById('persons');
  for (let i = 1; i < 11; i++) {
    let liPerson = document.createElement('li');
    liPerson.setAttribute('id', 'person' + i);
    liPerson.setAttribute('class', 'person');
    liPerson.setAttribute('onclick', 'personDescriptionUpDown(' + i + ')');
    let namePerson = document.createElement('p');
    namePerson.setAttribute('class', 'textPerson');
    liPerson.appendChild(namePerson);
    ulPersons.appendChild(liPerson);
  }
}
// Fill
function cheackLocalStorage(pageNumber) {
  hideAllPersons();
  if (localStorage.getItem('page' + pageNumber) != undefined) {
    fillCharacters(pageNumber);
  } else {
    renderDate(pageNumber);
    cheackerLocalStorage(pageNumber);
  };
}
function renderDate(pageNumber) {
  let request = new  XMLHttpRequest();
  request.open('GET', 'https://swapi.co/api/people/?page=' + pageNumber);
  request.send(null);
  request.onreadystatechange = function() {
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
  let checkerTroughInterval = setInterval( 
    function() {
      if (localStorage.getItem('page' + pageNumber) == undefined) {
        return;
      }
      clearInterval(checkerTroughInterval);  
      cheackLocalStorage(pageNumber);
      return; 
    }, 200)
}
function fillCharacters(pageNumber) {
  let page = JSON.parse(localStorage.getItem('page' + pageNumber));
  if (pageNumber == 9) {
      for (let i = 1; i < 8; i++) {
      document.getElementById('person' + i).firstChild.innerHTML = page.results[i - 1].name;
    }
    showAllPersons(8);
  } else {
    for (let i = 1; i < 11; i++) {
      document.getElementById('person' + i).firstChild.innerHTML = page.results[i - 1].name;
    }
  showAllPersons(11);
  }
}
// Description
function personDescriptionUpDown(number) {
  if (document.getElementById('description' + number) != undefined) { //up
    let arrow = document.getElementById('personImg' + number);
    arrow.setAttribute('class', 'fas fa-arrow-down imagePerson');
    removeDescription(number);
  } else { // down
    let arrow = document.getElementById('personImg' + number);
    arrow.setAttribute('class', 'fas fa-arrow-left imagePerson');

    let person = document.getElementById('person' + number);
    let description = document.createElement('ul');
    person.appendChild(description);
    description.setAttribute('id', 'description' + number);
    description.setAttribute('class', 'list-group');
    createDescription(number);
  }
}
function createDescription(number) {
  let character  = seekCurrentCharacter(number);
  for (let i = 1; i < 6; i++) {
    let descriptionP = document.createElement('li');
    let description = document.getElementById('description' + number);
    description.appendChild(descriptionP);
    descriptionP.setAttribute('id', 'person' + number + 'description' + i);
    descriptionP.setAttribute('class', 'list-group-item');
    switch(i) {
      case 1:
      descriptionP.innerHTML = 'Рост: ' + character.height;
      break;
      case 2:
      descriptionP.innerHTML = 'Вес: ' + character.mass;
      break;
      case 3:
      descriptionP.innerHTML = 'Цвет волос: ' + character.hair_color;
      break;
      case 4:
      descriptionP.innerHTML = 'Цвет глаз: ' + character.eye_color;
      break;
      case 5:
      descriptionP.innerHTML = 'Дата рождения: ' + character.birth_year;
      descriptionP.style.margin = '0 0 20px 0';
      break;
    }
  }
}
function seekCurrentCharacter(indexPerson) {
  let nameCharacter = document.getElementById('person' + indexPerson).firstChild.innerHTML;
  for (let i = 1; i < 10; i++) {
    let page = JSON.parse(localStorage.getItem('page' + i));
    for (let j = 1; j < 11; j++) {
      if (page.results[j - 1].name == nameCharacter) {
        return page.results[j - 1];
      }
    }
  }
}
function removeDescription(number) {
  let person = document.getElementById('person' + number)
  let description = document.getElementById('description' + number);
  for (let i = 1; i < 6; i++) {
    let descriptionP = document.getElementById('person' + number + 'description' + i);
    description.removeChild(descriptionP);
  }
  person.removeChild(description);
}
// Pagination
function prevPage() {
  let numberCurrentPage = document.getElementById('currentPage').firstChild.innerHTML;
  if (numberCurrentPage == 9) {
    document.getElementById('nextButton').removeAttribute('disabled');
  } 
  if (numberCurrentPage == 2) {
    document.getElementById('prevButton').setAttribute('disabled', ''); 
  }
  document.getElementById('currentPage').firstChild.innerHTML = numberCurrentPage - 1;
  numberCurrentPage -= 1;
  cheackLocalStorage(numberCurrentPage);
}
function nextPage() {
  let numberCurrentPage = document.getElementById('currentPage').firstChild.innerHTML;
  if (numberCurrentPage == 1) {
    document.getElementById('prevButton').removeAttribute('disabled');
  } 
  if (numberCurrentPage > 7) {
    document.getElementById('nextButton').setAttribute('disabled', ''); 
  }
  numberCurrentPage = +document.getElementById('currentPage').firstChild.innerHTML;
  document.getElementById('currentPage').firstChild.innerHTML = numberCurrentPage + 1;
  numberCurrentPage += 1;
  cheackLocalStorage(numberCurrentPage);
}
// Search
function search() {
  document.getElementById('currentPage').firstChild.innerHTML = 1;
  let searchedCharacters = [];
  if (document.getElementById('searchInput').value == '') { 
    finalSearch(searchedCharacters);
    return;
  }
  let searchingName = document.getElementById('searchInput').value;
  document.getElementById('searchInput').value = '';
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
          searchedCharacters.push(page.results[j - 1].name);
        }
        if (j == 7) { // lastCharacter
          finalSearch(searchedCharacters);
          return;
        }
      }

    } else { // notLastPage
      for (let j = 1; j < 11; j++) {
        let nameCharacter = page.results[j - 1].name.toLowerCase();
        if (nameCharacter.includes(searchingName)) {
          searchedCharacters.push(page.results[j - 1].name);
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
    document.getElementById('person' + i).firstChild.innerHTML = searchedCharacters[i - 1];
  }
  showAllPersons(quantityPersons);
}
function createButtonShow() {
  let parent = document.getElementById('mainContent');
  let but = document.createElement('button');
  parent.appendChild(but);
  but.setAttribute('onclick', 'cheackLocalStorage(1)');
  but.setAttribute('id', 'buttonShow');
  but.innerHTML = 'На главную';
}
// hide/show persons
function hideAllPersons() {
  for (let i = 1; i < 11; i++) {
    document.getElementById('person' + i).style.display = 'none';
  }
  document.getElementById('load').style.visibility="visible";
}
function showAllPersons(quantity) {
  if (quantity > 11 || quantity < 1) {
    alert('Ошибка кол-ва показываемых персонажей');
    quantity = 10;
  }
  if (document.getElementById('buttonShow')) {
    document.getElementById('mainContent').removeChild( document.getElementById('buttonShow') );
  }
  for (let i = 1; i < quantity; i++) {
    document.getElementById('person' + i).style.display = 'block';
  }
  document.getElementById('load').style.visibility="hidden";
}