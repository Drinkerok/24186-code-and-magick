'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var form_review = document.querySelector('.review-form');
  var form_name_input = document.getElementById('review-name');
  var form_comment_input = document.getElementById('review-text');
  var form_name_label = document.querySelector('.review-fields-name');
  var form_comment_label = document.querySelector('.review-fields-text');
  var form_control = document.querySelector('.review-fields');
  var form_labels = document.querySelectorAll('.review-fields-label');
  var form_submit = document.querySelector('.review-submit');

  var browserCookies = require('browser-cookies');
  if (browserCookies.get('name')) form_name_input.value = browserCookies.get('name');
  if (browserCookies.get('mark')) document.getElementById('review-mark-' + browserCookies.get('mark')).checked = 'checked';

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  var marks = document.getElementsByClassName('review-mark-label');
  var active_mark = browserCookies.get('mark') || 3;
  isRequired(active_mark < 3, form_comment_label);
  isRequired(form_name_input.value == '', form_name_label);

  // При смене оценки, меняем переменную active_mark
  for (var i=0; i<marks.length; i++){
    marks[i].onclick = function(){
      active_mark = +this.innerHTML;
      isRequired( (active_mark < 3) && (form_comment_input.value == ''), form_comment_label);
    }
  }

  // При изменении поля имени
  form_name_input.oninput = function(){
    isRequired(this.value == '', form_name_label);
  }
  // При изменении поля комментария
  form_comment_input.oninput = function(){
    if (active_mark < 3) isRequired(this.value == '', form_comment_label);
  }
  // Необходимо ли заполнить поле
  function isRequired(condishion, label){
    if (condishion){
      label.style.display = 'inline';
      form_control.style.display = 'inline-block';
    } else{
      label.style.display = 'none';
    }
    checkFormControl();
  }
  // Все ли поля правильно заполнены
  function checkFormControl(){
    for (var i=0; i<form_labels.length; i++){
      if (form_labels[i].style.display != 'none') {
        form_submit.disabled = 'disabled';
        return false;
      }
    }
    form_control.style.display = 'none';
    form_submit.disabled = '';
    return true;
  }

  // Отправка формы
  form_review.onsubmit = function(e){
    e.preventDefault();
    if (checkFormControl()) {
      // Сохраняем в куки
      // Сколько прошло дней с моего др
      var now = new Date();
      var my_birthsday = new Date(0, 8, 6);
      if (now.getMonth() > my_birthsday.getMonth() && now.getDate() > my_birthsday.getDate()){
        my_birthsday.setFullYear(now.getFullYear());
      } else {
        my_birthsday.setFullYear(now.getFullYear() - 1);
      }
      var days_passed = Math.floor (Math.abs(now - my_birthsday) / 1000 / 60 / 60 / 24);

      browserCookies.set('name', form_name_input.value, {
        expires: Date.now() + days_passed
      });
      browserCookies.set('mark', active_mark + '', {
        expires: Date.now() + days_passed
      });
      this.submit;
    }
  }
})();
