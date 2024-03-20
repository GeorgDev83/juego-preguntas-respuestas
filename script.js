"use strict";

let questionsArray = [];
let currentQuestion = {};
let indexPregunta = 0;
let counter = 0;

/**
 * Inicializa el funcionamiento de la web app.
 *
 * @param {array} questions Array de preguntas del fichero JSON.
 */
function initialize(questions) {
  questionsArray = questions;
  setRandomArray(questionsArray);
  updateUI();
}

/**
 * Actualiza la interfaz de usuario y añade escuchadores de eventos
 *
 */
function updateUI() {
  printCurrentQuestion(getCurrentObjectQuestionFromArray());
  addEventListenerCustom(htmlRecovery());
}

/**
 * Desordena de forma aleatoria una array
 *
 * @param {array} array Array a desordenar
 */
function setRandomArray(array) {
  array.sort(() => Math.random() - 0.5);
}

/**
 * Recupera JSON y se lo pasa a su callback
 *
 * @param {function} initializeCb Callback
 */
const doFetch = async (initializeCb) => {
  const urlFetch =
    "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";
  await fetch(urlFetch)
    .then((res) => res.json())
    .then((questions) => initializeCb(questions))
    .catch((error) => console.error(error));
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
 * @param {Element} elemento el elemento al cual eliminar los hijos.
 */
function removeChildsCustom(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

/**
 * Crea un div en al cual se le asigna el texto de la pregunta actual
 *
 * @return {Element} elemento contenedor.
 */
function createHTMLQuestion(filmQuestion) {
  const elementQuestion = document.createElement("div");
  elementQuestion.className = ".questionContainer";
  elementQuestion.innerHTML = filmQuestion.question;
  elementQuestion.style.fontSize = "2rem";
  return elementQuestion;
}

/**
 * Obtiene el objeto de la pregunta actual
 *
 * @return {Object} objeto de la pregunta actual.
 */
function getCurrentObjectQuestionFromArray() {
  console.log("ASD: " + currentQuestion);
  currentQuestion = questionsArray[indexPregunta];
  return currentQuestion;
}

/**
 * Crea y muestra en el HTML la pregunta con sus respuestas
 *
 */
const printCurrentQuestion = (filmQuestion) => {
  console.log(filmQuestion);
  const elementQuestion = createHTMLQuestion(filmQuestion);
  const generalContainer = document.querySelector("#generalContainer");
  removeChildsCustom(generalContainer);
  generalContainer.appendChild(elementQuestion);
  createAnchorsAnswers(filmQuestion.answers);
};

/**
 * Crea los anchor y li de las respuestas actuales
 *
 * @param {array} answers Preguntas
 */
function createAnchorsAnswers(answers) {
  const answersUl = document.querySelector(".answerContainer");
  removeChildsCustom(answersUl);

  setRandomArray(answers);
  for (let index = 0; index < answers.length; index++) {
    const elementsLi = createLiAnswer(index, answers[index]);
    const elementAnchor = createAnchorAnswers(index);
    elementAnchor.appendChild(elementsLi);
    answersUl.appendChild(elementAnchor);
  }
}

/**
 * Crea los anchor de las respuestas actuales
 *
 * @param {number} index indice del anchor
 */
function createAnchorAnswers(index) {
  const elementAnchor = document.createElement("a");
  elementAnchor.id = "a_" + index;
  elementAnchor.className = "style--a";
  return elementAnchor;
}

/**
 * Crea los li de las respuestas actuales
 *
 * @param {number} index indice del anchor
 * @param {array} answer indice del anchor
 */
function createLiAnswer(index, answer) {
  const liAns = document.createElement("li");
  liAns.id = "li_" + index;
  liAns.className = "li__answer";
  liAns.innerText = answer;
  liAns.href = "#";

  return liAns;
}

/**
 * Devuelve los elementos li del html que tengan la clase ".li__answer".
 *
 * @return {array} elementos li del html que tengan la clase ".li__answer".
 */
function htmlRecovery() {
  return document.querySelectorAll(".li__answer");
}

/**
 * Verifica si la respuesta es correcta, en caso correcto incrementa el
 * contador de puntuación y lo muestra, además actualiza la interfaz.
 *
 * @param {any} Evento escuchado en el click.
 */
function checkAnswer(evento) {
  evento.preventDefault();
  if (
    extractNumericIdFromStringId(evento.target.id) ==
    findCorrectIndexOfAnswers(currentQuestion.answers, currentQuestion.correct)
  ) {
    incrementCounter();
    printHTMLCounter();
  }
  indexPregunta++;
  updateUI();
}

/**
 * Encuentra el índice de la pregunta correcta en el array de respuestas.
 *
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
  let identificador = idString;
  identificador = identificador.replace("li_", "");
  return parseInt(identificador, 10);
}

/**
 * Incrementa la variable counter del objeto objectFilmsQuest
 *
 */
function incrementCounter() {
  counter++;
}

/**
 * Muestra el HTML del contador
 *
 */
function printHTMLCounter() {
  let h3 = document.querySelector("#counter");
  h3.innerHTML = "hits: " + counter;
  h3.style.fontSize = "2rem";
  h3.style.color = "white";
}

/**
 * Añade eventos click al array de elementos HTML pasado como parámetro
 *
 * @param {array} lis array de lementos HTML
 *
 */
function addEventListenerCustom(lis) {
  lis.forEach((element) => {
    element.addEventListener("click", function (e) {
      checkAnswer(e);
    });
  });
}

/**
 * Añadimos al evento DOMContentLoaded la llamada a la función doFetch
 * pasándole como parámetro la funcion  initializa
 *
 */
document.addEventListener("DOMContentLoaded", doFetch(initialize));
