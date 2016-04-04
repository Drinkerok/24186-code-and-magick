var reviews_container = document.querySelector('.reviews-list');
var template = document.getElementById('review-template');
if ('content' in template){
  template_review = template.content.querySelector('.review');
} else{
  template_review = template.querySelector('.review');
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

window.reviews.forEach(function(review){
  createReview(review);
});