"use strict";

const apiKeyTmdb = "d41eaf7497a56914ed95533075105d3a";
const urlAPIImages = "https://image.tmdb.org/t/p/w500";
let objectQuestion = null;
let questionsArray = null;
let urlImagesArray = [];
let lis = [];
let indexPregunta = 0;
let counter = 0;

function initialize(questions) {
  questionsArray = questions;
  //doFetchPosterImage(questions);
  htmlRecovery();
  printQuestions(indexPregunta);
  //addEventListenerCustom();
}

const doFetch = async (initializeCb) => {
  const urlFetch =
    "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";
  await fetch(urlFetch)
    .then((res) => res.json())
    .then((questions) => initializeCb(questions))
    .catch((error) => console.error(error));
};

const doFetchPosterImage = async (questions) => {
  await questions.forEach((element) => {
    const title = extractTitleOrName(element);
    const urlTmdbMovies = `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTmdb}&query=${title}`;
    /* const urlTmdb = `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTmdb}&query=${key_title}&include_adult=false&language=en-US&page=1`; */
    fetch(urlTmdbMovies)
      .then((res) => res.json())
      .then((videosImages) => {
        let cadena = "";
        if (
          videosImages["results"] !== undefined &&
          videosImages.results.length > 0
        ) {
          if (videosImages.results[0].backdrop_path) {
            cadena += urlAPIImages + videosImages.results[0].backdrop_path;
            urlImagesArray.push(cadena);
          } else {
            doFetchPersonImage(element);
          }
        }
      })
      .catch((error) => console.error(error));
  });
};

const doFetchPersonImage = async (element) => {
  const title = extractTitleOrName(element);
  const urlTmdbActors = `https://api.themoviedb.org/3/search/person?api_key=${apiKeyTmdb}&query=${title}`;
  await fetch(urlTmdbActors)
    .then((res) => res.json())
    .then((videosImages) => {
      let cadena = "";
      if (videosImages["results"] && videosImages.results.length > 0) {
        if (videosImages.results[0].profile_path) {
          cadena += urlAPIImages + videosImages.results[0].profile_path;
          urlImagesArray.push(cadena);
        }
      }
    })
    .catch((error) => console.error(error));
};

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

async function setImage() {
  const imgPoster = document.querySelector(".answerContainer");
  const url = urlImagesArray[indexPregunta - 1];
  imgPoster.style.background = `url(${url}) no-repeat center center /cover fixed`;
  
}

const printQuestions = () => {
  objectQuestion = questionsArray[indexPregunta++];
  //const questionH2 = document.querySelector(".questionContainer");
  const questionH2 = document.createElement("div");
  questionH2.className = ".questionContainer";
  questionH2.innerHTML = objectQuestion.question;
  //questionH2.remove();
  const generalContainer = document.querySelector("#generalContainer");
  while (generalContainer.firstChild) {
    generalContainer.removeChild(generalContainer.firstChild);
  }
  generalContainer.appendChild(questionH2);
  const answersLi = createAnchorAnswers(objectQuestion.answers);
};

function extractTitleOrName(objQuestion) {
  if (objQuestion.question.includes('"')) {
    const title = objQuestion.question.split('"');
    return title[1];
  } else if (objQuestion.question.includes("'")) {
    const title = objQuestion.question.split("'");
    return title[1];
  } else if (objQuestion.question.includes("`")) {
    const title = objQuestion.question.split("`");
    return title[1];
  } else return objQuestion.correct;
}

function createAnchorAnswers(answers) {
  const answersUl = document.querySelector(".answerContainer");
  while (answersUl.firstChild) {
    answersUl.removeChild(answersUl.firstChild);
  }

  for (let index = 0; index < answers.length; index++) {
    const elementLi = document.createElement("a");
    elementLi.id = "a_" + index;
    elementLi.className = "style--a";
    const anchor = createLiAnswer(index, answers[index]);
    elementLi.appendChild(anchor);
    answersUl.appendChild(elementLi);
  }
  htmlRecovery();
  addEventListenerCustom();
  setImage();
}

function createLiAnswer(index, answer) {
  const anchorAns = document.createElement("li");
  anchorAns.id = "li_" + index;
  anchorAns.className = "li__answer";
  anchorAns.innerText = answer;
  anchorAns.href = "#";

  return anchorAns;
}

function htmlRecovery() {
  lis = document.querySelectorAll(".li__answer");
}

function checkAnswer(evento) {
  
  console.log(evento.target.id);
  let identificador = evento.target.id;
  identificador = identificador.replace("li_", "");
  console.log('id ='+ identificador);
  const correctIndex = objectQuestion.answers.findIndex(
    (answer) => answer.includes(objectQuestion.correct)
  );
    console.log(correctIndex);
  if (correctIndex == identificador) {
    counter++;
    let h3 = document.querySelector('#counter');
    h3.innerHTML = 'hits: '+ counter;
    h3.style.fontSize = '2rem';
    h3.style.color = 'white';
  }
  printQuestions();
}

function addEventListenerCustom() {
  lis.forEach((element) => {
    element.addEventListener("click", function (e) {
      //e.preventDefault();
      checkAnswer(e);
    });
  });
}


function removeEventListenerCustom() {
  lis.forEach((element) => {
  element.removeEventListener("click",() => console.log('funciono') , true);
  });
}

document.addEventListener("DOMContentLoaded", doFetch(initialize));
