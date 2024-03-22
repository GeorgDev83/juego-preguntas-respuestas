'use strict';

let questionsArray = [];

/**
 * Objeto currentQuestion que guarda variables y funciones
 * en relación con el objeto pregunta actual
 *
 */
const currentQuestion = {
  question: {},
  isCorrect: function (id) {
    return id === this.correctId();
  },
  correctId: function () {
    return this.answersUnsortered.findIndex((answer) =>
      answer.includes(this.question.correct)
    );
  },
  answersUnsortered: [],
  indexCurrentQuestion: 0,
  incrementIndexCurrentQuestion: function () {
    this.indexCurrentQuestion++;
  },
  counter: 0,
  incrementCounter: function () {
    this.counter++;
  },
  passed: 20,
};

/**
 * Inicializa el funcionamiento de la web app.
 *
 * @param {array} questions Array de preguntas del fichero JSON.
 */
function initialize(questions) {
  questionsArray = getRandomArray(questions);
  updateUI();
}

/**
 * Actualiza la interfaz de usuario y añade escuchadores de eventos
 *
 */
function updateUI() {
  printCurrentQuestion(getCurrentObjectQuestionFromArray());
  printHTMLCounter();
  addEventListenerCustom(htmlRecovery());
}

/**
 * Devuelve una copia desordenada de un array
 *
 * @param {array} array Array a desordenar
 *
 * @returns {array} array desordenado
 */
function getRandomArray(array) {
  let arrayCopy = [].concat(array);
  return arrayCopy.sort(() => Math.random() - 0.5);
}

/**
 * Recupera JSON y se lo pasa a su callback
 *
 * @param {function} initializeCb Callback
 */
const doFetch = async (initializeCb) => {
  const urlFetch =
    'https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json';
  await fetch(urlFetch)
    .then((res) => res.json())
    .then((questions) => initializeCb(questions))
    .catch((error) => console.error(error));
  function getRandomArray(array) {
    let arrayCopy = [].concat(array);
    return arrayCopy.sort(() => Math.random() - 0.5);
  }
};

/**
 * Devuelve un entero aleatorio entre min max
 *
 * @param {number} min mínimo.
 * @param {number} max máximo.
 * @return {number} x entero aleatorio entre min max.
 */
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

/**
 * Elimina todos los hijos de un elemento HTML
 *
 * @param {Element} elem el elemento al cual eliminar los hijos.
 */
function removeChildsCustom(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

/**
 * Crea un div en al cual se le asigna el texto de la pregunta actual
 *
 * @param {Object} filmQuestion Pregunta con sus propiedades.
 *
 * @return {Element} elemento contenedor.
 */
function createHTMLQuestion(filmQuestion) {
  const elementQuestion = document.querySelector('.questionContainer');
  elementQuestion.innerHTML = filmQuestion.question;

  return elementQuestion;
}

/**
 * Obtiene el objeto de la pregunta actual
 *
 * @return {Object} objeto de la pregunta actual.
 */
function getCurrentObjectQuestionFromArray() {
  currentQuestion.question =
    questionsArray[currentQuestion.indexCurrentQuestion];
  return currentQuestion.question;
}

/**
 * Crea y muestra en el HTML la pregunta con sus respuestas
 *
 * @param {Object} filmQuestion Pregunta con sus propiedades.
 *
 */
const printCurrentQuestion = (filmQuestion) => {
  const elementQuestion = createHTMLQuestion(filmQuestion);
  const questionSection = document.querySelector('.question');
  removeChildsCustom(questionSection);
  questionSection.appendChild(elementQuestion);
  let lis;
  const answersUl = document.querySelector('.answersUl');
  removeChildsCustom(answersUl);
  currentQuestion.answersUnsortered = getRandomArray(filmQuestion.answers);
  for (
    let index = 0;
    index < currentQuestion.answersUnsortered.length;
    index++
  ) {
    lis = createLiAnswer(index, currentQuestion.answersUnsortered);
    answersUl.appendChild(lis);
  }
};

/**
 * Crea los li de las respuestas actuales
 *
 * @param {number} index indice del anchor
 * @param {array} answer indice del anchor
 *
 * @returns {array} contiene los li's creados.
 */
function createLiAnswer(index, answer) {
  const liAns = document.createElement('li');
  liAns.id = 'li_' + index;
  liAns.className = 'li__answer';
  liAns.innerText = answer[index];

  return liAns;
}

/**
 * Devuelve los elementos li del html que tengan la clase ".li__answer".
 *
 * @return {array} elementos li del html que tengan la clase ".li__answer".
 */ /**
 * Incrementa la variable counter del objeto objectFilmsQuest
 *
 */
function htmlRecovery() {
  return document.querySelectorAll('.li__answer');
}

/**
 * Verifica si la respuesta es correcta, en caso correcto incrementa el
 * contador de puntuación y lo muestra, además actualiza la interfaz.
 *
 * @param {any} ev escuchado en el click.
 */
function checkAnswer(ev) {
  ev.preventDefault();

  const idHTML = extractNumericIdFromStringId(ev.target.id);
  console.log(idHTML);
  if (currentQuestion.isCorrect(idHTML)) {
    currentQuestion.incrementCounter();
    printHTMLCounter();
  }
  if (currentQuestion.indexCurrentQuestion >= questionsArray.length - 1) {
    gameOver();
  } else {
    currentQuestion.incrementIndexCurrentQuestion();
    updateUI();
  }
}

/**
 * Encuentra el índice de la pregunta correcta en el array de respuestas.
 *
 * @param {array} answers Lista de preguntas.
 * @param {String} correctAnswer Respuesta correcta.
 * @return {number} Índice de la pregunta correcta.
 */
function findCorrectIndexOfAnswers(answers, correctAnswer) {
  return answers.findIndex((answer) => answer.includes(correctAnswer));
}

/**
 * Extrae de un string un indice numérico
 *
 * @param {string} idString indice en formato string
 *
 * @return {number} Índice en formato integer.
 */
function extractNumericIdFromStringId(idString) {
  let identifier = idString;
  identifier = identifier.replace('li_', '');
  return parseInt(identifier, 10);
}

/**
 * Muestra el HTML del contador
 *
 */
function printHTMLCounter() {
  let h3 = document.querySelector('#count');
  h3.innerHTML = 'Points: ' + currentQuestion.counter;
  h3.style.fontSize = '3rem';
  h3.style.color = 'white';
}

/**
 * Añade eventos click al array de elementos HTML pasado como parámetro
 *
 * @param {array} lis array de lementos HTML
 *
 */
function addEventListenerCustom(lis) {
  lis.forEach((element) => {
    element.addEventListener('click', function (e) {
      checkAnswer(e);
    });
  });
}

/**
 * Funcion game Over se llama cuando acaba el juego. Limpiamos lo que
 * nos interesa de la pantalla y mostramos la puntuación total.
 *
 */
function gameOver() {
  removeQuestionSection();
  removeChildrenAnswerContainer();
  createHTMLCounterH3();
  /* addGameOverAnswerContainer(); */
  createHTMLGameOverH2();
}
/**
 * Eliminamos del HTML el elemento con id "generalContainer".
 */
function removeQuestionSection() {
  const questionSection = document.querySelector('.question');
  questionSection.remove();
}
/**
 * Eliminamos del HTML los hijos del elemento con clase "answerContainer".
 */
function removeChildrenAnswerContainer() {
  const answersSection = document.querySelector('.answers');
  answersSection.remove();
}
/**
 * Modificamos del HTML el elemento con id "counter" y lo convertimos
 * a mayúsculas.
 */
function createHTMLCounterH3() {
  let counterH3 = document.querySelector('#count');
  counterH3.innerHTML = counterH3.textContent.toUpperCase();
}
/**
 * Selección de un elemento h2 HTML en el cual se le introduce
 * un texto.
 *
 * @returns {Element} Retorna el elemento h2.
 */
function createHTMLGameOverH2() {
  const gameOverH2 = document.querySelector('#gameOverId');
  console.log(gameOverH2);
  gameOverH2.className = 'gameOver';
  if (currentQuestion.counter <= currentQuestion.passed) {
    gameOverH2.style.color = 'red';
  } else if (currentQuestion.counter > currentQuestion.passed) {
    gameOverH2.style.color = 'green';
  }
  gameOverH2.style.visibility = 'visible';
  gameOverH2.innerHTML = 'Game Over';

  return gameOverH2;
}
/**
 *
 * Añade un hijo al contedor de las respuestas.
 *
 */
function addGameOverAnswerContainer() {
  const answersSection = document.querySelector('.answers');
  answersSection.appendChild(createHTMLGameOverH2());
}
/**
 * Añadimos al evento DOMContentLoaded la llamada a la función doFetch
 * pasándole como parámetro la funcion  initializa
 *
 */
document.addEventListener('DOMContentLoaded', doFetch(initialize));
