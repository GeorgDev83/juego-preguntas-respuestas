"use strict";
let objectQuestions = null;
let anchors = null;

function initialize(data) {
  printQuestions(data);
  anchors = document.querySelectorAll(".anchor__answer");
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
  //const answerContainer = document.getElementsByClassName("answerContainer");

  objectQuestions = questionsArray[0];
  const questionH2 = document.querySelector(".question");
  questionH2.innerHTML = objectQuestions.question;
  const answersUl = document.querySelector(".answerContainer");
  for (let index = 0; index < objectQuestions.answers.length; index++) {
    const answer = objectQuestions.answers[index];
    let stringLi = document.createElement("li");
    stringLi.className = `style--${index % 2 === 0 ? "even" : "odd"}`;
    let anchorAns = document.createElement("a");
    anchorAns.id = index;
    anchorAns.className = "anchor__answer";
    anchorAns.innerText = answer;
    anchorAns.href = "";
    //`<li class="style--${index%2===0?"even":"odd"}" id="liAnswer__id-${index}"> <a class="anchor__answer" href='javascript:void(0);' >${answer}</a></li>`;
    stringLi.appendChild(anchorAns);
    answersUl.appendChild(stringLi); // .innerHTML += stringLi
  }
};

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
