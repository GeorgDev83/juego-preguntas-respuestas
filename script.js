'use strict';
let objectQuestions = null;
let anchors;

function initialize(data) {
  anchors = document.querySelectorAll('.anchor__answer');//document.getElementById("2");
  /* const questionsArray = getQuestions(data); */
  printQuestions(data);
  addEventListenerCustom();
  console.log(anchors);
}

const doFetch = async (initializeCb) => {
  const urlFetch = "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";
  await fetch(urlFetch)
  .then(res => res.json())
  .then(questions => initializeCb(questions))
  .catch((error) => console.error(error));
}

/* function getQuestions(data) {
  return data;
} */

const printQuestions = (questionsArray) => {
  const answerContainer = document.getElementsByClassName("answerContainer");
  
  
    objectQuestions = questionsArray[0];
    const questionH2 = document.querySelector(".question")
    questionH2.innerHTML = objectQuestions.question
    const answersUl = document.querySelector(".answerContainer")
     for (let index = 0; index < objectQuestions.answers.length; index++) {
      const answer = objectQuestions.answers[index];
      let stringLi = `<li class="style--${index%2===0?"even":"odd"}" id="liAnswer__id-${index}"> <a id="${index}" class="anchor__answer" href="" >${answer}</a></li>`
        const answerlis = document.createElement("li");
        answersUl.innerHTML += stringLi      
    }    
}

// Cambiar nombre función a inglés checkAnswer()
function comprobarRespuestaCorrecta(id) {
  alert(id.contains(indice));
  const indice = pregunta.answers.indexOf(pregunta.correct);
  return id.contains(indice);
}

function addEventListenerCustom() {
  //anchors.addEventListener("mouseover", function() {console.log('Hola!');});
   anchors.forEach(element => {
    element.addEventListener("click", function(e) {comprobarRespuestaCorrecta(e.id)});
  });
}

document.addEventListener("DOMContentLoaded", doFetch(initialize));