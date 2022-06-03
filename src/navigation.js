// variables for paginated or infinite scroll
let maxPage;
let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener("click", () => {
  spanErrorSearch.innerHTML = "";
  if (searchFormInput.value.length >= 1) {
    location.hash = "#search=" + searchFormInput.value;
  } else {
    spanErrorSearch.innerHTML = "Por favor seleccione que desea buscar";
  }
});

arrowBtn.addEventListener("click", () => {
  location.hash = window.history.back();
});

trendingBtn.addEventListener("click", () => {
  location.hash = "#trends";
});

//addEventListener
window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);
window.addEventListener("scroll", infiniteScroll, { passive: false });

function navigator() {
  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  location.hash.startsWith("#trends")
    ? trendsPage()
    : location.hash.startsWith("#search=")
    ? searchPage()
    : location.hash.startsWith("#movie=")
    ? moviePage()
    : location.hash.startsWith("#category=")
    ? categoriesPage()
    : homePage();

  window.scrollTo(0, 0);

  if (infiniteScroll) {
    window.addEventListener("scroll", infiniteScroll, { passive: false });
  }
}

function homePage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.add("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.remove("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");
  searchFormBtn.classList.remove("inactive");
  trendingPreviewSection.classList.remove("inactive");
  categoriesPreviewSection.classList.remove("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.add("inactive");
  spanErrorSearch.classList.remove("inactive");
  likedMovieSection.classList.remove("inactive");

  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
}
function categoriesPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");
  searchFormBtn.classList.add("inactive");
  spanErrorSearch.classList.add("inactive");
  // ['#category', 'id-name']
  const [_, categoryData] = location.hash.split("=");
  const [categoryId, categoryName] = categoryData.split("-");

  headerCategoryTitle.innerHTML = categoryName;

  getMoviesByCategory(categoryId);
  infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}
function moviePage() {
  headerSection.classList.add("header-container--long");
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");
  searchFormBtn.classList.add("inactive");
  spanErrorSearch.classList.add("inactive");
  likedMovieSection.classList.add("inactive");

  const [_, movieId] = location.hash.split("=");
  getMovieId(movieId);
}
function searchPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");
  likedMovieSection.classList.add("inactive");

  // ['#category', 'id-name']
  const [_, query] = location.hash.split("=");
  getMoviesBySearch(query);

  infiniteScroll = getPaginatedMoviesBySearch(query);
}
function trendsPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");
  searchFormBtn.classList.add("inactive");
  spanErrorSearch.classList.add("inactive");
  likedMovieSection.classList.add("inactive");
  headerCategoryTitle.innerHTML = "Tendencias";

  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies;
}
