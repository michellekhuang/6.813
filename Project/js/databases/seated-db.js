const _ = require('lodash');

const reservations = [];
const walkins = [];

function addWalkin(walkin) {
  if (!walkin.name || !walkin.partySize || !walkin.cell || isNameTaken(walkin.name)) {
    return false;
  }
  walkins.push(walkin);
  return true;
}

function deleteEntry(name) {
  _.remove(walkins, {name: name});
  _.remove(reservations, {name: name});
}

function removeWalkin(walkin) {
  _.remove(walkins, {
    name: walkin.name,
    partySize: walkin.partySize,
    cell: walkin.cell,
  });
}

function addReservation(reservation) {
  if (!reservation.name || !reservation.partySize || !reservation.date || !reservation.cell || isNameTaken(reservation.name)) {
    return false;
  }
  reservations.push(reservation);
  return true;
}

function removeReservation(reservation) {
  _.remove(reservations, {
    name: reservation.name,
    partySize: reservation.partySize,
    cell: reservation.cell,
    date: reservation.date,
  });
}

function getEntry(name) {
  let dbUsed;
  let entry = _.find(walkins, {name: name});
  dbUsed = "walkins";
  if (!entry) {
    entry = _.find(reservations, {name: name});
    dbUsed = "reservations";
  }
  return [entry,dbUsed];
}

function isNameTaken(name) {
  const index1 = _.findIndex(walkins, {name: name});
  const index2 = _.findIndex(reservations, {name: name});
  return (index1 !== -1 || index2 !== -1);
}

module.exports = {
  addWalkin: addWalkin,
  removeWalkin: removeWalkin,
  addReservation: addReservation,
  removeReservation: removeReservation,
  getEntry: getEntry,
  deleteEntry: deleteEntry,
  isNameTaken: isNameTaken,
};
