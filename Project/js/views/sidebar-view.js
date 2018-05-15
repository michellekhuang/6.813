const utils = require('../utils');
const form = require('../models/form');
const calendar = require('../models/calendar');

const reservationsDB = require('../databases/reservations-db');
const walkinsDB = require('../databases/walkins-db');
const seatedDB = require('../databases/seated-db');

const Reservation = form.Reservation;

function getReservationView(reservation) {
  const parsedName = reservation.name.replace(' ', '_');
  const bubbleHtml = `<div class="placeholder reservation-placeholder" id="${parsedName}">` +
                       '<button type="button" class="close close-reservation" aria-label="Close">' +
                         '<span aria-hidden="true">&times;</span>' +
                       '</button>' +
                       `<div class="inner-placeholder-name">${reservation.name} (${reservation.partySize})</div>` +
                       `<span class="inner-placeholder-date">${reservation.date}</span>` +
                       '<button type="button" class="btn btn-secondary bubble-btn">Info</button>' +
                     '</div>';
  return bubbleHtml;
}

function renderReservations() {
  const reservations = reservationsDB.getReservations();
  const container = $('#reservationContainer');
  container.html('');
  for (let i = 0; i < reservations.length; ++i) {
    const view = getReservationView(reservations[i]);
    const bubble = $(view);
    bubble.draggable(utils.draggableOptions);
    container.append(view);
  }
}

module.exports = {
  renderReservations: renderReservations,
};
