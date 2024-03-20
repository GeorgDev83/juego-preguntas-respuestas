"use strict";

const objectFilmsQuest = {
  currentQuestion: null,
  questionsArray: [],
  indexPregunta: 0,
  counter: 0,
};

function initialize(questions) {
  objectFilmsQuest.questionsArray = questions;
  setRandomArray(objectFilmsQuest.questionsArray);
  updateUI();
}

function updateUI() {
  printCurrentQuestion();
  addEventListenerCustom(htmlRecovery());
}

function setRandomArray(array) {
  array.sort(() => Math.random() - 0.5);
}

const doFetch = async (initializeCb) => {
  const urlFetch =
    "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";
  await fetch(urlFetch)
    .then((res) => res.json())
    .then((questions) => initializeCb(questions))
    .catch((error) => console.error(error));
};

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function removeChildsCustom(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function createHTMLQuestionH2() {
  const questionH2 = document.createElement("div");
  questionH2.className = ".questionContainer";
  questionH2.innerHTML = objectFilmsQuest.currentQuestion.question;
  questionH2.style.fontSize = "2rem";
  return questionH2;
}

function getCurrentObjectQuestionFromArray() {
  return objectFilmsQuest.questionsArray[objectFilmsQuest.indexPregunta];
}

const printCurrentQuestion = () => {
  objectFilmsQuest.currentQuestion = getCurrentObjectQuestionFromArray();
  const questionH2 = createHTMLQuestionH2();
  const generalContainer = document.querySelector("#generalContainer");
  removeChildsCustom(generalContainer);
  generalContainer.appendChild(questionH2);
  createAnchorsAnswers(objectFilmsQuest.currentQuestion.answers);
};

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

function createAnchorAnswers(index) {
  const elementAnchor = document.createElement("a");
  elementAnchor.id = "a_" + index;
  elementAnchor.className = "style--a";
  return elementAnchor;
}

function createLiAnswer(index, answer) {
  const liAns = document.createElement("li");
  liAns.id = "li_" + index;
  liAns.className = "li__answer";
  liAns.innerText = answer;
  liAns.href = "#";

  return liAns;
}

function htmlRecovery() {
  return document.querySelectorAll(".li__answer");
}

function checkAnswer(evento) {
  evento.preventDefault();
  if (
    extractNumericIdFromStringId(evento.target.id) ==
    findCorrectIndexOfAnswers()
  ) {
    incrementCounter();
    printHTMLCounter();
  }
  objectFilmsQuest.indexPregunta++;
  updateUI();
}

function findCorrectIndexOfAnswers() {
  return objectFilmsQuest.currentQuestion.answers.findIndex((answer) =>
    answer.includes(objectFilmsQuest.currentQuestion.correct)
  );
}

function extractNumericIdFromStringId(idString) {
  let identificador = idString;
  identificador = identificador.replace("li_", "");
  return parseInt(identificador, 10);
}

function incrementCounter() {
  objectFilmsQuest.counter++;
}

function printHTMLCounter() {
  let h3 = document.querySelector("#counter");
  h3.innerHTML = "hits: " + objectFilmsQuest.counter;
  h3.style.fontSize = "2rem";
  h3.style.color = "white";
}

function addEventListenerCustom(lis) {
  lis.forEach((element) => {
    element.addEventListener("click", function (e) {
      checkAnswer(e);
    });
  });
}

document.addEventListener("DOMContentLoaded", doFetch(initialize));
