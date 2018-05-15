const utils = require('../utils');

class Table {
  constructor(numSeats, waiterId) {
    this.numSeats = numSeats;
    this.id = utils.randomString(16);
    this.waiterId = waiterId;
  }

  getId() {
    return this.id;
  }

  numSeats() {
    return this.numSeats;
  }

  getWaiterId() {
    return this.waiterId;
  }

  assignWaiter(waiterId) {
    this.waiterId = waiterId;
  }

  unassignWaiter() {
    this.waiterId = null;
  }

  isAssigned() {
    return this.waiterId !== null;
  }
}

module.exports = Table;
