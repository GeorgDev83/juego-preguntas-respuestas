"use strict";
let objectQuestions = null;
let anchors = null;

function initialize(data) {
  printQuestions(data);
  htmlRecovery();
  addEventListenerCustom();
}

const doFetch = async (initializeCb) => {
  const urlFetch =
    "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";
  await fetch(urlFetch)
    .then((res) => res.json())
    .then((questions) => initializeCb(questions))
    .catch((error) => console.error(error));
};

/* function getQuestions(data) {
  return data;
} */

const printQuestions = (questionsArray) => {
  objectQuestions = questionsArray[1];
  const questionH2 = document.querySelector(".questionContainer");
  questionH2.innerHTML = objectQuestions.question;
  const answersLi = createLiAnswers(objectQuestions.answers);
};

function createLiAnswers(answers) {
  const answersUl = document.querySelector(".answerContainer");
  for (let index = 0; index < answers.length; index++) {
    const elementLi = document.createElement('li');
    elementLi.className = 'style--li';/* ${index%2===0?'even':'odd'}`; */
    const anchor = createAnchorAnswer(index, answers[index]);
    elementLi.appendChild(anchor);
    answersUl.appendChild(elementLi);
  }
}

function createAnchorAnswer(index, answer) {
  const anchorAns = document.createElement('a');
  anchorAns.id = "anchor_"+index;
  anchorAns.className = "anchor__answer";
  anchorAns.innerText = answer;
  anchorAns.href = "#";
  return anchorAns;
}

function htmlRecovery() {
  anchors = document.querySelectorAll('.anchor__answer');
}

function checkAnswer(id) {
  const correctIndex = objectQuestions.answers.reduce(
    (acc, current, index, array) =>
      acc + current.includes(objectQuestions.correct) ? index : 0,
    0
  );
  return correctIndex == id;
}

function addEventListenerCustom() {
  //anchors.addEventListener("mouseover", function() {console.log('Hola!');});
  anchors.forEach((element) => {
    element.addEventListener("click", function (e) {
      checkAnswer(e.target.id);
    });
  });
}

document.addEventListener("DOMContentLoaded", doFetch(initialize));
