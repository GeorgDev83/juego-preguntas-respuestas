let dataGlobal;

function initialize() {
    
    getQuestions();
    console.log(dataGlobal);
    printQuestions(dataGlobal);
  
  
}

function getQuestions() {
  const url =
    "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";
    return 
  fetch(url)
    .then((response) => response.json())
    .then((data) => dataGlobal = data);
    
}

function printQuestions(questions) {
  const answerContainer = document.getElementsByClassName("answerContainer");
  
  for (question of questions) {
    
    const questionH2 = document.getElementsByClassName("question")
    questionH2.innerHTML = question.question
    for (answer of question.answer) {
        const answerlis = document.createElement("li");
    }
  }
}

document.addEventListener("DOMContentLoaded", initialize());
