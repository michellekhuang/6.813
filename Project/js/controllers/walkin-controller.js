const utils = require('../utils');
const form = require('../models/form');

const reservationsDB = require('../databases/reservations-db');
const walkinsDB = require('../databases/walkins-db');
const seatedDB = require('../databases/seated-db');

const Walkin = form.Walkin;

$(document).on('shown.bs.modal', '#walkin-div', function(evt) {
  $('.modal-dialog').velocity('transition.fadeIn', {duration: 500});
  utils.clearForm('walkin');
  $('#walkin-name').focus();
});

$(document).on('click', '#walkin-set-btn', function(evt) {
  const name = $('#walkin-name').val();
  const partySize = $('#walkin-party-size').val();
  const cell = $('#walkin-cell').val();
  const comments = $('#walkin-comments').val();

  $('#walkin-name').removeClass('invalid');
  $('#walkin-party-size').removeClass('invalid');
  $('#walkin-cell').removeClass('invalid');
  $('.error').html('');

  let inputsValid = true;

  // make sure the name is alphanumeric
  if (!/[a-zA-Z0-9\-]$/.test(name)) {
    $('#walkin-name-error').html('Name can only contain letters, numbers, and dashes.');
    $('#walkin-name').addClass('invalid');
    inputsValid = false;
  }

  // make sure cell is numeric only & valid US cell number
  if (!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/.test(cell)) {
    $('#walkin-cell-error').html('Cell can only contain numbers, must be valid US number');
    $('#walkin-cell').addClass('invalid');
    inputsValid = false;
  }

  if (!name || !partySize) {
    if (!name) {
      $('#walkin-name-error').html('Name required');
      $('#walkin-name').addClass('invalid');
    }
    if (!partySize) {
      $('#walkin-party-size-error').html('Party size required');
      $('#walkin-party-size').addClass('invalid');
    }
    inputsValid = false;
  }

  let walkin;
  if ($('#walkin-name-error').html() === '') {
    walkin = new Walkin(name, partySize, cell, comments);
    if (walkinsDB.isNameTaken(name) ||
        reservationsDB.isNameTaken(name) ||
        seatedDB.isNameTaken(name)) {
      $('#walkin-name-error').html('Name already taken');
      $('#walkin-name').addClass('invalid');
      inputsValid = false;
    } else if (!inputsValid) {
      return;
    } else {
      const result = walkinsDB.addWalkin(walkin);
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
  const nameElem = $('<div class="data" id="name"></div>');
  const sizeElem = $('<div class="data" id="size"></div>');
  const cellElem = $('<div class="data" id="cell"></div>');
  const commentsElem = $('<div class="data" id="comments"></div>');
  nameElem.html(walkin.name);
  sizeElem.html(walkin.partySize);
  cellElem.html(walkin.cell);
  commentsElem.html(walkin.comments);

  const parsedName = walkin.name.replace(' ', '_');
  const bubble = $('<div class="placeholder" id="' + parsedName + '"></div>');

  bubble.draggable(utils.draggableOptions);

  let bubbleHtml = '<button type="button" class="close close-walkin" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
  bubbleHtml += `<div class="inner-placeholder-name">${walkin.name} (${walkin.partySize})</div>`;
  bubbleHtml += '<button type="button" class="btn btn-secondary bubble-btn">Info</button>';
  bubble.html(bubbleHtml);

  $('#walkInContainer').append(bubble);

  $('#' + parsedName).append(nameElem);
  $('#' + parsedName).append(sizeElem);
  $('#' + parsedName).append(cellElem);
  $('#' + parsedName).append(commentsElem);

  utils.clearForm('walkin');
  $('#walkin-div').modal('toggle');
  $('.modal-backdrop').remove();

  // Show comments on hover
  document.getElementById(parsedName).title = walkin.comments;
});

$(document).on('click', '#walkin-cancel-btn', function(evt) {
  utils.clearForm('walkin');
  $('#walkin-div').modal('toggle');
  $('.modal-backdrop').remove();
});

$(document).on('click', '.close-walkin', function(evt) {
  let guestName;
  const entry = this.parentNode;

  for (let i = 0; i < entry.childNodes.length; i++) {
    if (entry.childNodes[i].classList && entry.childNodes[i].className.indexOf("inner-placeholder-name") >= 0 ){
      guestName = entry.childNodes[i].innerHTML;
      break;
    }
  }

  walkinsDB.removeWalkin(guestName);
  entry.parentNode.removeChild(this.parentNode);
});
