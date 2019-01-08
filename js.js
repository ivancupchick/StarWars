function loadApp() {
  document.getElementById('previoslyPage').style.display = 'none';
  document.getElementById('mainPage').style.display = 'block';
  cheackLocalStorage(1);
}
function cheackerLocalStorage(firstCharacter) {
  let boolean = false;
  var checkerTroughIntercal = setInterval( function() {
    for (let i = firstCharacter; i < firstCharacter + 10; i++) {
      if (localStorage.getItem('person'+i) == null) {
        boolean = true;
      }
      if ((i == firstCharacter + 9) && (boolean == true)) {
        boolean = false;
      } else {
        cheackLocalStorage(firstCharacter);
        //Add missimg character to LocalStroage 
        addMissimgCharacters();
        clearInterval(checkerTroughIntercal); 
      }
    }
  }, 2000)
}
function cheackLocalStorage(startNumber) {
  if (localStorage.getItem('person'+startNumber)!=undefined) {
    fillCharacters(startNumber);
  } else {
    renderDate(startNumber);
    cheackerLocalStorage(startNumber);
  };
}
function renderDate(firstCharacter) {
  for (let i = firstCharacter; i < firstCharacter+10; i++) {
    let numberPerson = i;
    let request = new  XMLHttpRequest();
    request.open('GET', 'https://swapi.co/api/people/'+numberPerson+'/')
    request.send(null);
    request.onreadystatechange = function() {
      if (request.readyState !== 4) {
          return;
        }
      if (request.status === 200) {
        let text = request.responseText;
        localStorage.setItem('person'+numberPerson, text);
      }
    }
  }
}
function fillCharacters(firstCharacter) {
  indexLabel = 1;
  for (let i = firstCharacter; i < firstCharacter+10; i++) {
    let character = JSON.parse(localStorage.getItem('person'+i));
    fillCharacter(character, indexLabel);
    indexLabel++;
  }
}
function fillCharacter(character, indexCharacter) {
  document.getElementById('person'+indexCharacter).firstChild.innerHTML = character.name;
}
function personDescriptionDown(number) {
  if (document.getElementById('description' + number) != undefined) {
    document.getElementById('personImg' + number).setAttribute('src', 'images/arrow.png');
    let person = document.getElementById('person' + number)
    let description = document.getElementById('description' + number);
      for (let i = 1; i < 6; i++) {
      let descriptionP = document.getElementById('person' + number + 'description' + i);
      description.removeChild(descriptionP);
    }
    person.removeChild(description);
  } else {
    let globalIndexForBigCycle = 0;
    document.getElementById('personImg' + number).setAttribute('src', 'images/arrow2.png');
    let person = document.getElementById('person'+number);
    let description = document.createElement('div');
    person.appendChild(description);
    description.setAttribute('id', 'description' + number);
    for (let j = 1; j < 300; j++) {
      let character = JSON.parse(localStorage.getItem('person' + j));
      if (character.name == document.getElementById('person' + number).firstChild.innerHTML) {
        globalIndexForBigCycle = j;
        break;
      } else if (j==299) {
        alert('не удалось')
      }
    }
    let character = JSON.parse(localStorage.getItem('person' + globalIndexForBigCycle));
    for (let i = 1; i < 6; i++) {
      let descriptionP = document.createElement('p');
      description.appendChild(descriptionP);
      descriptionP.setAttribute('id', 'person' + number + 'description' + i);
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
}
function prevPage() {
  let numberCurrentPage = document.getElementById('currentPage').firstChild.innerHTML;
  if (numberCurrentPage <= 1) {
    alert('Нельзя');
    return;
  } else {
    document.getElementById('currentPage').firstChild.innerHTML = numberCurrentPage - 1;
    numberCurrentPage -= 1;
    let numberFirstPerson = numberCurrentPage * 10 - 9;
    fillCharacters(numberFirstPerson);
  }
}
function nextPage() {
  let numberCurrentPage = document.getElementById('currentPage').firstChild.innerHTML;
  if (numberCurrentPage > 8) {
    alert('Нельзя');
    return;
  } else {
    let numberCurrentPage = +document.getElementById('currentPage').firstChild.innerHTML;
    document.getElementById('currentPage').firstChild.innerHTML = numberCurrentPage + 1;
    numberCurrentPage += 1;
    let numberFirstPerson = numberCurrentPage * 10 - 9;
    cheackLocalStorage(numberFirstPerson);
}
}
function addMissimgCharacters() {
  let character = localStorage.getItem('person' + 1);
  localStorage.setItem('person' + 17, character);
  localStorage.setItem('person' + 89, character);
  localStorage.setItem('person' + 90, character);
}
