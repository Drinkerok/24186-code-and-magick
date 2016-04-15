var REVIEWS_PER_PAGE = 3;
var reviews_container = document.querySelector('.reviews-list');
var template = document.getElementById('review-template');
var reviewsBlock = document.querySelector('.reviews');
var reviews;
var reviewsSorted;
var filters = document.querySelector('.reviews-filter');
var activeFilter = document.querySelector('.reviews-filter-item');
var reviewsPage = 0;
var reviewsMaxPage = 0;
var moreReviews = document.querySelector('.reviews-controls-more');

if ('content' in template){
  template_review = template.content.querySelector('.review');
} else{
  template_review = template.querySelector('.review');
}

// Выбор фильтра и фильтрация
function sortReviews(reviewsToSort, sorting) {
  var sortedReviews = reviewsToSort.slice();
  switch (sorting){
    case 'reviews-all':
      break;
    case 'reviews-recent':
      sortedReviews.sort(function(a, b){
        return (b.date > a.date) ? 1 : -1;
      });
      break;
    case 'reviews-good':
      sortedReviews = sortedReviews.filter(function(review){
        return review.rating > 2;
      });
      sortedReviews.sort(function(a, b){
        return (b.rating > a.rating) ? 1 : -1;
      });
      break;
    case 'reviews-bad':
      sortedReviews = sortedReviews.filter(function(review){
        return review.rating < 3;
      });
      sortedReviews.sort(function(a, b){
        return (a.rating > b.rating) ? 1 : -1;
      });
      break;
    case 'reviews-popular':
      sortedReviews.sort(function(a, b){
        return (b.review_usefulness > a.review_usefulness) ? 1 : -1;
      });
      break;
  }
  return sortedReviews;
}
// Вывод по REVIEWS_PER_PAGE отзывов
function createReviewsPage(reviewsToCreate){
  var from = reviewsPage * REVIEWS_PER_PAGE;
  var to = from + REVIEWS_PER_PAGE;
  reviewsToCreate.slice(from, to).forEach(function(review){
    createReview(review);
  });
  haveMoreReviews();
  reviewsPage++;
}
// Создание отзыва по шаблону и добавление в список
function createReview(data){
  var review = template_review.cloneNode(true);
  review.querySelector('.review-rating').textContent = data.rating;
  review.querySelector('.review-text').textContent = data.description;

  var review_img = review.querySelector('.review-author');
  review_img.alt = data.author.name;

  var img = new Image();

  img.onload = function(){
    review_img.src = img.src;
    clearTimeout(pictureLoadTimeout);
  }
  img.error = function(){
    review.classList.add('review-load-failure');
  }
  img.src = data.author.picture;

  var pictureLoadTimeout = setTimeout(function() {
    review.classList.add('review-load-failure');
  }, 10000);

  reviews_container.appendChild(review);
}
// Показываем кнопку, если есть еще отзывы. Если нет, то скрываем
function haveMoreReviews(){
  if (reviewsPage < reviewsMaxPage) {
    moreReviews.classList.remove('invisible');
  } else {
    moreReviews.classList.add('invisible');
  }
}

// Получение отзывов
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://o0.github.io/assets/json/reviews.json');
reviewsBlock.classList.add('reviews-list-loading');
xhr.onload = function(e){
  reviewsBlock.classList.remove('reviews-list-loading');
  reviews = reviewsSorted = JSON.parse(this.response);
  reviewsMaxPage = Math.ceil(reviews.length / REVIEWS_PER_PAGE) - 1;
  createReviewsPage(reviews);
}
xhr.timeout = 10000;
xhr.onerror = xhr.ontimeout = function() {
  reviewsBlock.classList.remove('reviews-list-loading');
  reviewsBlock.classList.add('reviews-load-failure');
};
xhr.send();

// По клику на кнопку, добавляем еще отзывы
moreReviews.onclick = function(e){
  e.preventDefault();
  createReviewsPage(reviewsSorted);
}
// Выбор фильтра отзывов
filters.onclick = function(e){
  if (e.target.classList.contains('reviews-filter-item')){
    var label = e.target;
    if (label !== activeFilter){
      activeFilter = label;
      reviewsPage = 0;
      var filter = label.getAttribute('for');
      reviews_container.innerHTML = '';
      reviewsSorted = sortReviews(reviews, filter);
      reviewsMaxPage = Math.ceil(reviewsSorted.length / REVIEWS_PER_PAGE) - 1;
      createReviewsPage(reviewsSorted);
    }
  }
}