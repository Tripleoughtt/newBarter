'use strict';

$(document).ready(init);

function init() {
  $('#register').on('click', register) 
  $('#registerNewUser').on('click', registerNewUser)
  $('#login').on('click', login) 
  $('#loginUser').on('click', loginUser)
  $('.cancel').on('click', cancel);
}

var loggedInUser;

// register new user
function register() {
  $('.message').hide();
  $('#registration').modal('show');
}
function registerNewUser() {
  var user = {};
  user.username = $('#username').val();
  user.email = $('#email').val();
  user.password = $('#password').val();
  var confirmPassword = $('#confirmPassword').val();

  if (user.username === '' || user.password === '') {
    $('.message').hide();
    $('input').val('');
    $('#registerEmptyFormWarn').show();
  } else if (user.password !== confirmPassword) {
    $('.message').hide();
    $('input').val('');
    $('#passwordMatchWarn').show();
  } else {
    $('.message').hide();
    $.post('/register', user)
    .done(function(registeredUser) {
      $('#success').show();
      setTimeout(function() {
        $('#registration').modal('hide')
      }, 1500)
      $('input').val('');
    })
    .fail(function(err) {
      console.error(err);
      $('#tryAgain').show();
    });
  }
}

// login user
function login() {
  $('.message').hide();
  $('#loginUser').modal('show');
}

function loginUser() {
  var user = {};
  user.username = $('#loginUsername').val();
  user.password = $('#loginPassword').val();
  if (user.username === '' || user.password === '') {
    $('#loginEmptyFormWarn').show();
  } else {
    $.post('/login', user)
    .done(function(data) {
      if (data.redirect) {
        window.location = data.redirect
      }
      $('#loginUser').modal('hide');
      $('input').val('');
    })
    .fail(function(err) {
      $('#username').val('');
      $('#password').val('');
      console.error(err);
      $('#tryAgain').show();
    });
  }
}

function cancel() {
  $('input').val('');
  $('.message').hide();
  $('#editBio').hide();
  $('.modal').modal('hide');
}