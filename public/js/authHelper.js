$(document).ready(function() {
  $("a.popup").fancybox({
    'hideOnOverlayClick': true,
    'showCloseButton' : true
  });
});
$("#register_form").bind("submit", function() {

  if ($("#email_input").val().length < 1 || $("#password_input").val().length < 1) {
    $("#errors_div").show();
    $.fancybox.resize();
    return false;
  }

  if ($("#password_input").val() !== $("#confirm_password_input").val()) {
    $("#errors_div").show();
    $("#errors_div").html('password confirmation failed');
    $.fancybox.resize();
    return false;
  }

  $.fancybox.showActivity();

  $.ajax({
    type    : "POST",
    cache   : false,
    url     : "/register",
    data    : $(this).serializeArray(),
    statusCode: {
      200: function(data) {
        $.fancybox(data);
        $.fancybox.hideActivity();
      },
      303: function(data) {
        window.location = data.responseText;
      },
      500: function(data) {
        var errors = JSON.parse(data.responseText);
        i = errors.length - 1;
        do {
          $("#register-errors ul").append('<li>' + errors[i] + '</li>');
        } while (i--);
        $.fancybox.resize();
        $.fancybox.hideActivity();
      }
    }
  });
  return false;
});
$("#login_form").bind("submit", function() {

  if ($("#login_mail_input").val().length < 1 || $("#login_pass_input").val().length < 1) {
    $("#login_err_div").show();
    $.fancybox.resize();
    return false;
  }

  $.fancybox.showActivity();

  $.ajax({
    type    : "POST",
    cache   : false,
    url     : "/login",
    data    : $(this).serializeArray(),
    statusCode: {
      200: function(data) {
        $.fancybox(data);
        $.fancybox.hideActivity();
      },
      303: function(data) {
        window.location = data.responseText;
      },
      500: function(data) {
        var errors = JSON.parse(data.responseText);
        i = errors.length - 1;
        do {
          $("#login-errors").append('<li>' + errors[i] + '</li>');
        } while (i--);
        $.fancybox.resize();
        $.fancybox.hideActivity();
      }
    }
  });
  return false;
});