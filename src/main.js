// axios Create
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: APIKEY,
  },
});

const filterMoviesByGenres = (sectionPage, movies) => {
  sectionPage.innerHTML = ""; // get the node.js, selesct is of section html, clear page
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );

    movieContainer.appendChild(movieImg);
    sectionPage.appendChild(movieContainer); // get the node.js, selesct is of section html
  });
};
const createCategories = (section, filterElements) => {
  section.innerHTML = "";

  filterElements.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const nameCategory = document.createElement("h3");
    nameCategory.classList.add("category-title");
    nameCategory.setAttribute("id", "id" + category.id);
    nameCategory.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const textNameCategory = document.createTextNode(category.name);

    nameCategory.appendChild(textNameCategory);
    categoryContainer.appendChild(nameCategory);
    section.appendChild(categoryContainer);
  });
};

// fetch get, movies trending consumo en API "THE MOVIES DATA BASE"

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  console.log(data);
  console.log(movies);

  filterMoviesByGenres(trendingMoviesPreviewList, movies);
}
// fetch get, categories movies alone name consumo en API "THE MOVIES DATA BASE"
async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");
  const categories = data.genres;
  console.log(data);
  console.log(categories);

  createCategories(categoriesPreviewList, categories);
}
// fetch get, filter the movies by genre consumo en API "THE MOVIES DATA BASE"
async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;

  filterMoviesByGenres(genericSection, movies);
}
async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query: query,
    },
  });
  const movies = data.results;

  filterMoviesByGenres(genericSection, movies);
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  console.log(data);
  console.log(movies);

  filterMoviesByGenres(genericSection, movies);
}
async function getMovieId(id) {
  const { data: movie } = await api("movie/" + id);
  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  headerSection.style.background = `
  linear-gradient(180deg,
     rgba(0, 0, 0, 0.35) 19.27%, 
     rgba(0, 0, 0, 0) 29.17%),
     url(${movieImgUrl})`;
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movieDetailCategoriesList, movie.genres);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/similar`);
  const relatedMovies = data.results;

  filterMoviesByGenres(relatedMoviesContainer,relatedMovies);
 

}
