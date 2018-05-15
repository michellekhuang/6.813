const utils = require('../utils');
const form = require('../models/form');
const calendar = require('../models/calendar');

const reservationsDB = require('../databases/reservations-db');
const walkinsDB = require('../databases/walkins-db');
const seatedDB = require('../databases/seated-db');

const sidebarView = require('../views/sidebar-view');

const Reservation = form.Reservation;

// // hack to make reservation modal appear again after clicking on the backdrop
// // of the calendar modal
// $(document).on('click', 'body', function(event) {
//   if ($('#reservation-div').is(':hidden') &&
//       $('#walkin-div').is(':hidden') &&
//       $('#table-modal').is(':hidden') &&
//       $('#walkin-info-modal').is(':hidden') &&
//       $('#reservation-info-modal').is(':hidden') &&
//       $('.modal-backdrop').length > 0) {
//     $('#reservation-div').show();
//   }
// });

$(document).on('shown.bs.modal', '#reservation-div', function(event) {
  $('.modal-dialog').velocity('transition.fadeIn', {duration: 500});
  utils.clearForm('reservation');
  $('#reservation-name').removeClass('invalid');
  $('#reservation-party-size').removeClass('invalid');
  $('#reservation-datetime-btn').removeClass('invalid');
  $('#reservation-name').focus();
});

$(document).on('click', '#reservation-datetime-btn', function(event) {
  $('#reservation-div').hide();

  $('#reservation-date').html('');

  $('.calendar-container').show();
  calendar.renderDefaultCalendar();
});

$(document).on('click', '#reservation-set-btn', function(event) {
  const name = $('#reservation-name').val();
  const partySize = $('#reservation-party-size').val();
  const date = calendar.getSelection();
  const cell = $('#reservation-cell').val();
  const comments = $('#reservation-comments').val();

  $('#reservation-name').removeClass('invalid');
  $('#reservation-party-size').removeClass('invalid');
  $('#reservation-datetime-btn').removeClass('invalid');
  $('#reservation-cell').removeClass('invalid');
  $('.error').html('');

  let inputsValid = true;

  // make sure the name is alphanumeric
  if (!/[a-zA-Z0-9\-]$/.test(name)) {
    $('#reservation-name-error').html('Name can only contain letters, numbers, and dashes.');
    $('#reservation-name').addClass('invalid');
    inputsValid = false;
  }

  // make sure cell is numeric and valid US number
  if (!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/.test(cell)) {
    $('#reservation-cell-error').html('Cell can only contain numbers, must be valid US number');
    $('#reservation-cell').addClass('invalid');
    inputsValid = false;
  }

  if (!name || !partySize || !date.isReady()) {
    if (!name) {
      $('#reservation-name-error').html('Name required');
      $('#reservation-name').addClass('invalid');
    }
    if (!partySize) {
      $('#reservation-party-size-error').html('Party size required');
      $('#reservation-party-size').addClass('invalid');
    }
    if (!date.isReady()) {
      $('#reservation-datetime-error').html('Date/time required');
      $('#reservation-datetime').addClass('invalid');
    }
    inputsValid = false;
  }

  let reservation = new Reservation(name, partySize, date, cell, comments);
  if ($('#reservation-name-error').html() === '') {
    if (walkinsDB.isNameTaken(name) ||
        reservationsDB.isNameTaken(name) ||
        seatedDB.isNameTaken(name)) {
      $('#reservation-name-error').html('Name already taken');
      $('#reservation-name').addClass('invalid');
      inputsValid = false;
    } else if (!inputsValid) {
      return;
    } else {
      const result = reservationsDB.addReservation(reservation);
      if (result === false) {
        console.log('an unknown error has occurred');
        inputsValid = false;
      }
    }
  }

  if (!inputsValid) {
    return;
  }

  // Populate sidebar
  sidebarView.renderReservations();
  $('.reservation-placeholder').draggable(utils.draggableOptions);
  const nameElem = $('<div class="data" id="name"></div>');
  const sizeElem = $('<div class="data" id="size"></div>');
  const dateElem = $('<div class="data" id="date"></div>');
  const cellElem = $('<div class="data" id="cell"></div>');
  const commentsElem = $('<div class="data" id="comments"></div>');
  nameElem.html(reservation.name);
  sizeElem.html(reservation.partySize);
  dateElem.html(reservation.date);
  cellElem.html(reservation.cell);
  commentsElem.html(reservation.comments);

  const parsedName = reservation.name.replace(' ', '_');
  var bubble = $('<div class="placeholder reservation-placeholder" id="' + parsedName + '"></div>');

  bubble.draggable(utils.draggableOptions);
  bubble.append($('<button type="button" class="close close-reservation" aria-label="Close"><span aria-hidden="true">&times;</span></button>'));
  bubble.append($('<div class="inner-placeholder-name">' + reservation.name + '</div>'));
  var container = $('<div id="date-size-container"></div>');
  container.append($('<div class="inner-placeholder-date">' + reservation.date + '</div>'));
  container.append($('<div class="inner-placeholder-size">' + reservation.partySize + '</div>'));
  bubble.append(container);
  //$('#reservationContainer').append(bubble);

  $('#' + parsedName).append(nameElem);
  $('#' + parsedName).append(sizeElem);
  $('#' + parsedName).append(dateElem);
  $('#' + parsedName).append(cellElem);
  $('#' + parsedName).append(commentsElem);

  // Clear and hide reservation form
  utils.clearForm('reservation');
  $('#reservation-div').modal('toggle');
  $('.modal-backdrop').remove();
});

$(document).on('click', '#reservation-cancel-btn', function(event) {
  utils.clearForm('reservation');
  $('#reservation-div').modal('toggle');
  $('.modal-backdrop').remove();
});

$(document).on('click', '.close-reservation', function(evt) {
  let guestName;
  const entry = this.parentNode;

  for (let i = 0; i < entry.childNodes.length; i++) {
    if (entry.childNodes[i].classList && entry.childNodes[i].className.indexOf("inner-placeholder-name") >= 0 ){
      guestName = entry.childNodes[i].innerHTML;
      break;
    }
  }

  reservationsDB.removeReservation(guestName);
  entry.parentNode.removeChild(this.parentNode);
});
