const _ = require('lodash');

const Reservation = require('../models/form').Reservation;
const DateTime = require('../models/date-time');

const reservations = [
  new Reservation('Jonatan Yucra', 3, new DateTime(2017, 4, 10, 20, 0), '(456) 789-0123', 'asdf'),
];

function getReservations() {
  return reservations;
}

function getReservation(name) {
  return _.find(reservations, {name: name});
}

function addReservation(reservation) {
  if (!reservation.name || !reservation.partySize || !reservation.date ||
      !reservation.cell || isNameTaken(reservation.name)) {
    return false;
  }
  reservations.push(reservation);
  reservations.sort((res1, res2) => res1.date.compare(res2.date));
  return true;
}

function removeReservation(name) {
  _.remove(reservations, {name: name});
}

function isTimeTaken(date) {
  const index = _.findIndex(reservations, {date: date});
  return (index !== -1);
}

function isNameTaken(name) {
  const index = _.findIndex(reservations, {name: name});
  return (index !== -1);
}

module.exports = {
  getReservations: getReservations,
  getReservation: getReservation,
  addReservation: addReservation,
  removeReservation: removeReservation,
  isTimeTaken: isTimeTaken,
  isNameTaken: isNameTaken,
};
