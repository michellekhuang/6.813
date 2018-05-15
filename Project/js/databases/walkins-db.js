const _ = require('lodash');

const Walkin = require('../models/form').Walkin;

const walkins = [
  new Walkin('Eric Chen', 4, '(234) 567-8901', 'pusheen'),
  new Walkin('Jenny Liu', 6, '(345) 678-9012', 'She has pink hair.'),
];

function getWalkin(name) {
  return _.find(walkins, {name: name});
}

function addWalkin(walkin) {
  if (!walkin.name || !walkin.partySize || !walkin.cell || isNameTaken(walkin.name)) {
    return false;
  }
  walkins.push(walkin);
  return true;
}

function removeWalkin(name) {
  _.remove(walkins, {name: name});
}

function isNameTaken(name) {
  const index = _.findIndex(walkins, {name: name});
  return (index !== -1);
}

module.exports = {
  getWalkin: getWalkin,
  addWalkin: addWalkin,
  removeWalkin: removeWalkin,
  isNameTaken: isNameTaken,
};
