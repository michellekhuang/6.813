const reservationsDB = require('../databases/reservations-db');
const walkinsDB = require('../databases/walkins-db');

$(document).on('click', '.bubble-btn', function(event) {
  const id = $(event.target).parent().attr('id');
  const name = id.replace('_', ' ');

  if (walkinsDB.isNameTaken(name)) {
    const walkin = walkinsDB.getWalkin(name);

    $('#walkin-info-modal').modal('toggle');
    $('.modal-dialog').velocity('transition.fadeIn', {duration: 500});

    $('#walkin-info-name').html(walkin.name);
    $('#walkin-info-party-size').html(walkin.partySize);
    $('#walkin-info-cell').html(walkin.cell);
    $('#walkin-info-comments').html(walkin.comments);
  } else if (reservationsDB.isNameTaken(name)) {
    const reservation = reservationsDB.getReservation(name);

    $('#reservation-info-modal').modal('toggle');
    $('.modal-dialog').velocity('transition.fadeIn', {duration: 500});

    $('#reservation-info-name').html(reservation.name);
    $('#reservation-info-party-size').html(reservation.partySize);
    $('#reservation-info-datetime').html(reservation.date.toString());
    $('#reservation-info-cell').html(reservation.cell);
    $('#reservation-info-comments').html(reservation.comments);
  } else {
    console.log('something went wrong...');
  }
});

