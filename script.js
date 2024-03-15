'use strict';

function initialize() {
    getQuestions();
  
  
}

//! Revisar/ cambiar por version nueva ECMA es6
const getQuestions = async () => {
  try {
    const res = await fetch("https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json");
    let data = await res.json();
    printQuestions(data);
  } catch (error) {
      console.log(error);
  }
}


//
function printQuestions(questions) {
  const answerContainer = document.getElementsByClassName("answerContainer");
  
  
    const objectQuestions = questions[0];
    const questionH2 = document.querySelector(".question")
    questionH2.innerHTML = objectQuestions.question
    const answersUl = document.querySelector(".answerContainer")
    console.log(objectQuestions);
    for (let answer of objectQuestions.answers) {
        let stringLi = `<li>${answer}</li>`
        const answerlis = document.createElement("li");
        answersUl.innerHTML += stringLi
    } 
    
}

document.addEventListener("DOMContentLoaded", initialize());