var reviews_container = document.querySelector('.reviews-list');
var template = document.getElementById('review-template');
var reviewsBlock = document.querySelector('.reviews');
var reviews;
var filters = document.querySelector('.reviews-filter');
var activeFilter = document.querySelector('.reviews-filter-item');

if ('content' in template){
  template_review = template.content.querySelector('.review');
} else{
  template_review = template.querySelector('.review');
}


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

var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://o0.github.io/assets/json/reviews.json');
reviewsBlock.classList.add('reviews-list-loading');
xhr.onload = function(e){
  reviewsBlock.classList.remove('reviews-list-loading');
  reviews = JSON.parse(this.response);
  console.log(reviews);
  reviews.forEach(function(review){
    createReview(review);
  });
}
xhr.timeout = 10000;
xhr.onerror = xhr.ontimeout = function() {
  reviewsBlock.classList.remove('reviews-list-loading');
  reviewsBlock.classList.add('reviews-load-failure');
};
xhr.send();



filters.onclick = function(e){
  if (e.target.classList.contains('reviews-filter-item')){
    var label = e.target;
    if (label !== activeFilter){
      activeFilter = label;
      var filter = label.getAttribute('for');
      reviews_container.innerHTML = '';
      var reviewsToShow = sortReviews(reviews, filter);
      reviewsToShow.forEach(function(review){
        createReview(review);
      });
    }
  }
}