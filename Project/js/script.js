require('./controllers/calendar-controller');
require('./controllers/walkin-controller');
require('./controllers/reservation-controller');
require('./controllers/map-controller');
require('./controllers/sidebar-controller');
require('./controllers/info-controller');

const MAX_PARTY_SIZE = 11;

// Populate walkin and reservation form with max party size options
$(document).ready(function() {
  for (var size = 1; size <= MAX_PARTY_SIZE; ++size) {
    $("#walkin-party-size").append("<option value=" + size + ">" + size + "</option>");
    $("#reservation-party-size").append("<option value=" + size + ">" + size + "</option>");
  }
  $("#walkin-party-size").append("<option value=12+>" + "12+" + "</option>");
  $("#reservation-party-size").append("<option value=12+>" + "12+" + "</option>");

  $('.phone').mask('(999) 999-9999');
});

// Needed to make the modal backdrop not mess up.
$(document).on('shown.bs.modal', function() {
  if ($('.modal-backdrop').length > 1) {
    $('.modal-backdrop').not(':first').remove();
  }
});

// Disallow cursor when the textarea is readonly.
$(document).on('focus', 'textarea[readonly]', function() {
  this.blur();
});

// Handle login button click.
$(document).on('click', '#login-button', function() {
  $('.homepage-container').css('display', 'block');
  $('.login-page').addClass('puff-out-center');
  $('#login-button').prop('disabled', true);
  setTimeout(function() {
    $('.login-page').css('display', 'none');
  }, 350);
});
