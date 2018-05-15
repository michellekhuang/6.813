/**
 * Reservation Form contains:
 * name - string
 * partySize - string
 * date - string
 * cell - string
 * comments - string
 */
class Reservation {
  constructor(name, partySize, date, cell, comments) {
    this.name = name;
    this.partySize = partySize;
    this.date = date;
    this.cell = cell;
    this.comments = comments;
  }
}

/**
 * Walk-in Form contains:
 * name - string
 * partySize - string
 * cell - string
 * comments - string
 */
class Walkin {
  constructor(name, partySize, cell, comments) {
    this.name = name;
    this.partySize = partySize;
    this.cell = cell;
    this.comments = comments;
  }
}

module.exports = {
  Reservation: Reservation,
  Walkin: Walkin,
};
