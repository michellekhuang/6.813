$(document).on('click', '#table-walkin-back-btn', function(event) {
  $('#table-modal').modal('toggle');
  $('.modal-backdrop').remove();
});

$(document).on('click', '#walkin-info-back-btn', function(event) {
  $('#walkin-info-modal').modal('toggle');
  $('.modal-backdrop').remove();
});

$(document).on('click', '#reservation-info-back-btn', function(event) {
  $('#reservation-info-modal').modal('toggle');
  $('.modal-backdrop').remove();
});
