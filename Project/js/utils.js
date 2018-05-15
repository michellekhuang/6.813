const $ = require('jquery');

function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; ++i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function clearForm(formType) {
  // clear error messages
  $('.error').html('');

  // clear all inputs
  $(`#${formType}-name`).val('');
  $(`#${formType}-party-size`).val('');
  $(`#${formType}-cell`).val('');
  $(`#${formType}-comments`).val('');
  if (formType === 'reservation') {
    $('#reservation-date').html('');
  }

  // clear invalid classes
  $(`#${formType}-name`).removeClass('invalid');
  $(`#${formType}-party-size`).removeClass('invalid');
  $(`#${formType}-cell`).removeClass('invalid');
  if (formType === 'reservation') {
    $('#reservation-datetime-btn').removeClass('invalid');
  }
}

let bubbleButton;
const draggableOptions = {
  appendTo: 'body',
  containment: 'window',
  scroll: false,
  helper: 'clone',
  revert: false,
  start: function(event, ui) {
    $(this).css('visibility', 'hidden');
    $(ui.helper).addClass('ui-draggable-helper');
    bubbleButton = $(this).children('.bubble-btn').remove();
  },
  stop: function(event, ui) {
    $(this).css('visibility', 'visible');
    $(this).append(bubbleButton);
  },
};

module.exports = {
  clearForm: clearForm,
  draggableOptions: draggableOptions,
  randomString: randomString,
};
