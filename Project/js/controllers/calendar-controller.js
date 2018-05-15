const calendar = require('../models/calendar');

$(document).on('click', '#cancel-btn', function(event) {
  $('.calendar-container').hide();
  calendar.clearSelection();
  $('#reservation-div').show();
});

$(document).on('click', '#save-btn', function(event) {
  const selection = calendar.getSelection();
  if (selection.year !== null &&
      selection.month !== null &&
      selection.day !== null &&
      selection.hour !== null &&
      selection.minute !== null) {
    $('.calendar-container').hide();
    $('#reservation-date').html(selection.toString());
    $('#reservation-div').show();
  }
});

$(document).on('click', '#next-month', function(event) {
  calendar.renderNextMonth();
});

$(document).on('click', '#prev-month', function(event) {
  calendar.renderPrevMonth();
});
