const APIKEYS = "40bcc9a229f90ce118d626e55c8b8cf0";
// axios Create
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: APIKEYS,
  },
});

//Local Storage for liked movies
function likedMovieList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;
  if (item) {
    movies = item;
  } else {
    movies = {};
  }
  return movies;
}
function likeMovie(movie) {
  const likedMovies = likedMovieList();
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }
  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
  if (location.hash == "") {
    homePage();
  }
}
//create movies and categories
const filterMoviesByGenres = (
  sectionPage,
  movies,
  { lazyLoad = false, clean = true } = {}
) => {
  if (clean) {
    sectionPage.innerHTML = ""; // get the node.js, selesct is of section html, clear page
  }
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );
    movieImg.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNo9crNcpLOXIo5qu8qH4lpDloOgOQTRGtj-B4dJGrRozRJAvpewTh6T0PryZYQIyrbB0&usqp=CAU"
      );
    });
    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");
    likedMovieList()[movie.id] && movieBtn.classList.add("movie-btn--liked");
    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn--liked");
      likeMovie(movie);
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
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
//lazyLoader
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

// REQUESTS THE MOVIES DATA BASE"
// fetch get, movies trending consumo en API "THE MOVIES DATA BASE"
async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  filterMoviesByGenres(trendingMoviesPreviewList, movies, { lazyLoad: true });
}
// fetch get, name of categories  consumo en API "THE MOVIES DATA BASE"
async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");
  const categories = data.genres;
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
  maxPage = data.total_pages;
  filterMoviesByGenres(genericSection, movies, { lazyLoad: true });
}
function getPaginatedMoviesByCategory(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsButton = scrollTop + clientHeight >= scrollHeight - 30;

    const pageIsNotMax = page <= maxPage;

    if (scrollIsButton && pageIsNotMax) {
      page++;
      const { data } = await api("discover/movie", {
        params: {
          with_genres: id,
          page: page,
        },
      });
      const movies = data.results;
      filterMoviesByGenres(genericSection, movies, {
        lazyLoad: true,
        clean: false,
      });
    }
  };
}
//MOVIESBYSEARCH
// fetch get, filter the movies by genre by search user  consumo en API "THE MOVIES DATA BASE"
async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query: query,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;
  filterMoviesByGenres(genericSection, movies, { lazyLoad: true });
}
//the movies by genre by search user, paginated: infinity scroll **PAGINATED
function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsButton = scrollTop + clientHeight >= scrollHeight - 30;
    const pageIsNotMax = page <= maxPage;
    if (scrollIsButton && pageIsNotMax) {
      page++;
      const { data } = await api("search/movie", {
        params: {
          query,
          page: page,
        },
      });
      const movies = data.results;
      filterMoviesByGenres(genericSection, movies, {
        lazyLoad: true,
        clean: false,
      });
    }
  };
}
//TRENDING MOVIES
// fetch get, filter the movies by trending movies  consumo en API "THE MOVIES DATA BASE"
async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  maxPage = data.total_pages;
  filterMoviesByGenres(genericSection, movies, {
    lazyLoad: true,
  });
}
//the movies by trending movies , paginated: infinity scroll **PAGINATED
async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollIsButton = scrollTop + clientHeight >= scrollHeight - 30;
  const pageIsNotMax = page <= maxPage;
  if (scrollIsButton && pageIsNotMax) {
    page++;
    const { data } = await api("trending/movie/day", {
      params: {
        page: page,
      },
    });
    const movies = data.results;
    filterMoviesByGenres(genericSection, movies, {
      lazyLoad: true,
      clean: false,
    });
  }
}
// fetch get, movie description, title, description, detailScore  consumo en API "THE MOVIES DATA BASE"
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
// fetch get, related movies  consumo en API "THE MOVIES DATA BASE"
async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/similar`);
  const relatedMovies = data.results;
  filterMoviesByGenres(relatedMoviesContainer, relatedMovies, true);
}
//END OF REQUESTS THE MOVIES DATA BASE"
//liked movies
function getLikedMovies() {
  const likedMovies = likedMovieList();
  // liked movies is object
  const favoritesArray = Object.values(likedMovies);
  //convert array
  filterMoviesByGenres(likedMoviesListArticle, favoritesArray, {
    lazyLoad: true,
    clean: true,
  });
}
