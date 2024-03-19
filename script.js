"use strict";

const apiKeyTmdb = "d41eaf7497a56914ed95533075105d3a";
const urlAPIImages = "https://image.tmdb.org/t/p/w500";
let objectQuestion = null;
let questionsArray = null;
let urlImagesArray = [];
let anchors = null;
let indexPregunta = 1;

function initialize(questions) {
  questionsArray = questions;
  printQuestions(indexPregunta);
  doFetchPosterImage(setImage, questions);
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

const doFetchPosterImage = async (setImageCb, questions) => {
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

function setImage(url, elemento) {
  if (!elemento) {
    //url == urlAPIImages) {
    doFetchPersonImage(setImage, elemento);
  } else {
    /* const imgPoster = document.getElementById("generalContainer");
    imgPoster.style.background = `url(${url}) no-repeat center center /cover`; */
  }
}

const printQuestions = (indexQuestion) => {
  objectQuestion = questionsArray[indexQuestion];
  const questionH2 = document.querySelector(".questionContainer");
  questionH2.innerHTML = objectQuestion.question;
  const answersLi = createLiAnswers(objectQuestion.answers);
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

function createLiAnswers(answers) {
  const answersUl = document.querySelector(".answerContainer");
  for (let index = 0; index < answers.length; index++) {
    const elementLi = document.createElement("li");
    elementLi.className = "style--li";
    const anchor = createAnchorAnswer(index, answers[index]);
    elementLi.appendChild(anchor);
    answersUl.appendChild(elementLi);
  }
}

function createAnchorAnswer(index, answer) {
  const anchorAns = document.createElement("a");
  anchorAns.id = "anchor_" + index;
  anchorAns.className = "anchor__answer";
  anchorAns.innerText = answer;
  anchorAns.href = "#";
  return anchorAns;
}

function htmlRecovery() {
  anchors = document.querySelectorAll(".anchor__answer");
}

function checkAnswer(id) {
  id = id.replace("anchor_", "");
  const correctIndex = objectQuestion.answers.reduce(
    (acc, current, index, array) =>
      acc + current.includes(objectQuestion.correct) ? index : 0,
    0
  );
  return correctIndex == id;
}

function addEventListenerCustom() {
  anchors.forEach((element) => {
    element.addEventListener("click", function (e) {
      checkAnswer(e.target.id);
    });
  });
}

document.addEventListener("DOMContentLoaded", doFetch(initialize));
