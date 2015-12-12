'use strict';

$(document).ready(init);

function init() {
  $('.cancel').on('click', cancel);
  $('#logout').on('click', logout);
}

function cancel() {
  $('input').val('');
  $('.message').hide();
  $('#editBio').hide();
  $('.modal').modal('hide');
}

function logout() {
  $.post('/logout')
  .done(function(data) {
    if(data.redirect){
      window.location = data.redirect
    }
  });
}
