const _ = require('lodash');

const utils = require('../utils');

const walkinsDB = require('../databases/walkins-db');
const reservationsDB = require('../databases/reservations-db');
const seatedDB = require('../databases/seated-db');
const sidebarView = require('../views/sidebar-view');

const Walkin = require('../models/form').Walkin;
const Reservation = require('../models/form').Reservation;

const TABLES = [];
let nextTableId = 0;

let MAP_EDIT = true;

function placeTable(numSeats, x, y, waiterId) {
  const tableInfo = {
    'id': nextTableId.toString(),
    'seats': numSeats,
    'waiter': waiterId,
    'customerName': null,
  };
  ++nextTableId;
  TABLES.push(tableInfo);

  const tableSeats = [2, 4, 6, 8];
  if ($.inArray(numSeats, tableSeats) != -1) {
    const tableHtml = `<div class="tables table${numSeats} waiter${waiterId}" ` +
                            `id="${tableInfo.id}">` +
                      '<br><p class="app-text">seats</p>' +
                      `<h3 class="app-text">${numSeats}</h3>` +
                    '</div>';
    const tableId = '#' + tableInfo.id;

    $('#map').append(tableHtml);
    $(tableId).css({top: y * 100, left: x * 100, position: 'absolute'});
  }
}

function removeTable(tableId) {
  _.remove(TABLES, {'id': tableId});
  $('#' + tableId).remove();
}

$(document).ready(function() {
  placeTable(4, 2, 1, 1);
  placeTable(4, 4.5, 1, 1);
  placeTable(4, 7, 1, 3);

  placeTable(8, 2, 3.5, 2);
  placeTable(8, 5.5, 3.5, 2);

  placeTable(2, 9.5, 1, 3);
  placeTable(2, 9.5, 3.5, 3);

  $('.tables').hover(function() {
    if (!MAP_EDIT) {
      $(this).css('cursor', 'pointer');
      $(this).children().css('cursor', 'pointer');
    }
  });

  $('.tables').droppable({
    over: function(event, ui) {
      $(this).removeClass('scale-down-center');
      $(this).addClass('scale-up-center');
    },
    out: function(event, ui) {
      $(this).removeClass('scale-up-center');
      $(this).addClass('scale-down-center');
    },
    drop: function(event, ui) {
      $(this).removeClass('scale-up-center');
      $(this).addClass('scale-down-center');
      $(this).droppable('disable');

      const draggable = $(ui.draggable);
      const droppable = $(this);

      if ($(this).attr('class').includes('full')) {
        draggable.css('display', 'block');
        return;
      }

      $(this).addClass('full');
      $(this).empty();

      const nameWithUnderscore = draggable[0].id;
      const originalName = nameWithUnderscore.replace('_', ' ');

      let name;
      let partySize;
      let cell;
      let comments;
      if (walkinsDB.isNameTaken(originalName)) {
        const walkin = walkinsDB.getWalkin(originalName);
        walkinsDB.removeWalkin(originalName);
        seatedDB.addWalkin(walkin);
        name = walkin.name;
        partySize = walkin.partySize;
        cell = walkin.cell;
        comments = walkin.comments;
      } else if (reservationsDB.isNameTaken(originalName)) {
        const reservation = reservationsDB.getReservation(originalName);
        reservationsDB.removeReservation(originalName);
        seatedDB.addReservation(reservation);
        name = reservation.name;
        partySize = reservation.partySize;
        cell = reservation.cell;
        comments = reservation.comments;
      } else {
        console.log('The name', originalName, 'is not found in the walkins or reservations db!');
        return;
      }
      $(this).html(name + '<br>' + partySize + ' people');

      // keep track of which table id the customer is sitting at
      const id = $(this).attr('id');
      const index = _.findIndex(TABLES, {'id': id});
      TABLES[index].customerName = name;

      draggable.remove();
    },
  });

  $('.placeholder').draggable(utils.draggableOptions);
});

$(document).on('click', '.tables.full', function(event) {

  console.log("clicking table full!");

  const html = $(event.target).html();
  const name = html.split('<br>')[0];
  const seatedEntry = seatedDB.getEntry(name)[0];

  $('#table-walkin-name').html(seatedEntry.name);
  $('#table-walkin-party-size').html(seatedEntry.partySize);
  $('#table-walkin-cell').html(seatedEntry.cell);
  $('#table-walkin-comments').html(seatedEntry.comments);

  $('#table-modal').modal('toggle');
  $('.modal-dialog').velocity('transition.fadeIn', {duration: 500});
});

$(document).on('click', '#table-walkin-unseat-btn', function(event) {

  // get the corresponding values
  const name = $('#table-walkin-name').html();
  const size = $('#table-walkin-party-size').html();
  const cell = $('#table-walkin-cell').html();
  const comments = $('#table-walkin-comments').html();
  let entryType = seatedDB.getEntry(name)[1];

  // create entry element
  const nameElem = $('<div class="data" id="name"></div>');
  const sizeElem = $('<div class="data" id="size"></div>');
  const cellElem = $('<div class="data" id="cell"></div>');
  const commentsElem = $('<div class="data" id="comments"></div>');
  nameElem.html(name);
  sizeElem.html(size);
  cellElem.html(cell);
  commentsElem.html(comments);

  const parsedName = name.replace(' ', '_');
  const bubble = $('<div class="placeholder" id="' + parsedName + '"></div>');

  bubble.draggable(utils.draggableOptions);

  let bubbleHtml = '<button type="button" class="close close-walkin" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
  bubbleHtml += '<div class="inner-placeholder-name">' + name + ' (' + size + ')' + '</div>';
  bubbleHtml += '<button type="button" class="btn btn-secondary bubble-btn">Info</button>';
  bubble.html(bubbleHtml);

  // add element to sidebar
  if (entryType == "walkins"){
    $('#walkInContainer').append(bubble);
    seatedDB.deleteEntry(name);
    let walkin = new Walkin(name, size, cell, comments);
    walkinsDB.addWalkin(walkin);
  } else {
    let reservation = seatedDB.getEntry(name)[0];
    seatedDB.deleteEntry(name);
    reservationsDB.addReservation(reservation);
    sidebarView.renderReservations();
    $('.reservation-placeholder').draggable(utils.draggableOptions);
  }

  // reset the table in the map
  const index = _.findIndex(TABLES, {'customerName': name});
  TABLES[index].customerName = null;
  const id = TABLES[index].id;

  $('#' + id).html(
    '<br><p class="app-text">seats</p>' +
    `<h3 class="app-text">${TABLES[index].seats}</h3>`
  );


  $('#' + id).droppable('enable');
  $('#' + id).removeClass('full');
  $('#' + id).attr('opacity', '1');

  // clear the form and exit modal
  $('#table-walkin-name').html('');
  $('#table-walkin-party-size').html('');
  $('#table-walkin-cell').html('');
  $('#table-walkin-comments').html('');

  $('#table-modal').modal('toggle');
  $('.modal-backdrop').remove();
});

$(document).on('click', '#table-walkin-delete-btn', function(event) {
  // delete from database
  const name = $('#table-walkin-name').html();
  seatedDB.deleteEntry(name);

  // update the UI
  $('#table-walkin-name').html('');
  $('#table-walkin-party-size').html('');
  $('#table-walkin-cell').html('');
  $('#table-walkin-comments').html('');

  const index = _.findIndex(TABLES, {'customerName': name});
  TABLES[index].customerName = null;
  const id = TABLES[index].id;

  // reset the table in the map
  $('#' + id).html(
    '<br><p class="app-text">seats</p>' +
    `<h3 class="app-text">${TABLES[index].seats}</h3>`
  );
  $('#' + id).droppable('enable');
  $('#' + id).removeClass('full');
  $('#' + id).attr('opacity', '1');

  // close the modal
  $('#table-modal').modal('toggle');
  $('.modal-backdrop').remove();

});

// some nice animations for hovering
$(document).on('mouseenter', '.full', function(event) {
  $(event.target).removeClass('scale-up-center scale-down-center');
  $(event.target).addClass('scale-up-center');
});

$(document).on('mouseleave', '.full', function(event) {
  $(event.target).removeClass('scale-up-center scale-down-center');
  $(event.target).addClass('scale-down-center');
});

$(document).on('click', '#map-edit-button', function(evt) {
  if (MAP_EDIT) {
    moveTables();
    $('#map').css('background-color', '#FEFCE9');
    $('.placeholder').draggable('option', 'disabled', true);
    $('#walkInButton').prop('disabled', true);
    $('#reservationButton').prop('disabled', true);
    MAP_EDIT = false;
  } else {
    setTables();
    $('#map').css('background-color', 'white');
    $('.placeholder').draggable('option', 'disabled', false);
    $('#walkInButton').prop('disabled', false);
    $('#reservationButton').prop('disabled', false);
    MAP_EDIT = true;
  }
});

function moveTables() {
  console.log('tables move');
  $( ".tables" ).draggable( {
    grid: [ 20, 20 ],
    // obstacle: ".tables",
    // preventCollision: true,
    disabled: false,
    containment: "parent",
    revert: false
  });
  console.log('hello');
  $( ".tables" ).droppable( "option", "disabled", true );
}

function setTables() {
  $( ".tables" ).draggable( {
    grid: [ 20, 20 ],
    disabled: true,
    // obstacle: ".tables",
    // preventCollision: true,
  });

  $( ".tables" ).droppable( "option", "disabled", false );
}
