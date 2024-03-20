"use strict";

const apiKeyTmdb = "d41eaf7497a56914ed95533075105d3a";
const urlAPIImages = "https://image.tmdb.org/t/p/w500";
let urlImagesArray = [];

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

async function setImage() {
  const imgPoster = document.querySelector(".answerContainer");
  const url = urlImagesArray[indexPregunta - 1];
  imgPoster.style.background = `url(${url}) no-repeat center center /cover fixed`;
}

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
