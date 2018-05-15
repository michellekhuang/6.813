class DateTime {
  constructor(year, month, day, hour, minute) {
    this.representation = [year, month, day, hour, minute];
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
  }

  isReady() {
    return (
      this.year !== null &&
      this.month !== null &&
      this.day !== null &&
      this.hour !== null &&
      this.minute !== null
    );
  }

  setYear(year) {
    this.year = year;
    this.representation[0] = year;
  }

  setMonth(month) {
    this.month = month;
    this.representation[1] = month;
  }

  setDay(day) {
    this.day = day;
    this.representation[2] = day;
  }

  setHourMinute(time) {
    if (time === null) {
      this.hour = null;
      this.minute = null;
      this.representation[3] = null;
      this.representation[4] = null;
    } else {
      const parsed = time.split(/:| /);
      let hour = parseInt(parsed[0]);
      const minute = parseInt(parsed[1]);
      const suffix = parsed[2];
      if (suffix === 'am' && hour === 12) {
        hour -= 12;
      } else if (suffix === 'pm' && hour < 12) {
        hour += 12;
      }

      this.hour = hour;
      this.minute = minute;
      this.representation[3] = hour;
      this.representation[4] = minute;
    }
  }

  getHourMinuteString() {
    let suffix = 'am';
    let hour = this.hour;
    let minute = this.minute;

    if (hour > 12) {
      hour -= 12;
      suffix = 'pm';
    } else if (hour === 0) {
      hour = 12;
    }

    if (minute < 10) {
      minute = '0' + minute.toString();
    }

    return hour + ':' + minute + ' ' + suffix;
  }

  toString() {
    const year = this.year.toString().substring(2, 4);

    return (this.month + 1) + '/' + this.day + '/' + year + ' ' + this.getHourMinuteString();
  }

  compare(other) {
    for (let i = 0; i < this.representation.length; ++i) {
      if (this.representation[i] < other.representation[i]) {
        return -1;
      } else if (this.representation[i] > other.representation[i]) {
        return 1;
      }
    }
    return 0;
  }
}

module.exports = DateTime;
