const $ = require('jquery');
const PolyCal = require('../vendor/polycal/polycal');
const DateTime = require('./date-time');

const reservationsDB = require('../databases/reservations-db');

const monthsByIndex = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

const indicesByMonth = {
  'January': 0,
  'February': 1,
  'March': 2,
  'April': 3,
  'May': 4,
  'June': 5,
  'July': 6,
  'August': 7,
  'September': 8,
  'October': 9,
  'November': 10,
  'December': 11,
};

function parseDate(dateTime) {
  return {
    month: dateTime.month,
    date: dateTime.day,
    time: dateTime.getHourMinuteString(),
  };
}

const daysMap = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const SELECTION = new DateTime(null, null, null, null, null);

const possibleReservations = [
  '4:00 pm', '4:30 pm',
  '5:00 pm', '5:30 pm',
  '6:00 pm', '6:30 pm',
  '7:00 pm', '7:30 pm',
  '8:00 pm', '8:30 pm',
];

const calendar = new PolyCal({months: 12});
const today = calendar.today();

const thisMonth = calendar.find(today.year, today.month);
let renderedMonth = calendar.find(today.year, today.month);
SELECTION.setYear(renderedMonth.year);

function getDaysArray(month) {
  const days = month.days;
  const firstDay = days[0];
  const lastDay = days[month.days.length - 1];

  const daysArray = [];

  let week = 0;
  daysArray.push([]);
  for (let i = 0; i < firstDay.day; ++i) {
    daysArray[week].push(-1);
  }

  for (let i = 0; i < days.length; ++i) {
    if (daysArray[week].length === 7) {
      daysArray.push([]);
      week += 1;
    }
    daysArray[week].push(days[i].date);
  }

  while (daysArray[week].length < 7) {
    daysArray[week].push(-1);
  }

  return daysArray;
}

function populateHeader(month) {
  const monthString = monthsByIndex[month.month];
  $('#month-label').html(monthString);
  $('#year-label').html(month.year);
}

function populateBody(month) {
  const daysArray = getDaysArray(month);
  let html = '';
  for (let i = 0; i < daysArray.length; ++i) {
    for (let j = 0; j < daysArray[i].length; ++j) {
      html += '<div class="cal-box">';
      if (daysArray[i][j] > -1) {
        if (month.year === today.year &&
            month.month === today.month &&
            daysArray[i][j] === today.date) {
          html += `<div class="day today clickable">${daysArray[i][j]}</div>`;
        } else if (month.year < today.year) {
          html += `<div class="day nonclickable" id="day-${daysArray[i][j]}">${daysArray[i][j]}</div>`;
        } else if (month.year > today.year) {
          html += `<div class="day clickable" id="day-${daysArray[i][j]}">${daysArray[i][j]}</div>`;
        } else if ((month.month == today.month && daysArray[i][j] > today.date) ||
                   month.month > today.month) {
          html += `<div class="day clickable" id="day-${daysArray[i][j]}">${daysArray[i][j]}</div>`;
        } else {
          html += `<div class="day nonclickable" id="day-${daysArray[i][j]}">${daysArray[i][j]}</div>`;
        }
      } else {
        html += '<div class="noday">0</div>';
      }
      html += '</div>';
    }
  }
  $('#days').html(html);
}

function getTimeSlotIdFromTime(time) {
  return time.split(/:| /).join('');
}

function timeSlotView(time) {
  const id = getTimeSlotIdFromTime(time);
  return `<div class="btn time-slot" id="${id}">${time}</div>`;
}

function renderCalendar(month) {
  clearSelection();
  populateHeader(month);
  populateBody(month);

  $('#save-btn').addClass('disabled');

  $('.day.clickable').click(function(event) {
    $('.day.clickable').removeClass('selected');

    const dayElem = $(event.target);
    dayElem.addClass('selected');
    const clickedDate = parseInt(dayElem.html());

    SELECTION.setMonth(month.month);
    SELECTION.setDay(clickedDate);
    SELECTION.setHourMinute(null);

    $('#save-btn').removeClass('disabled');
    $('#save-btn').addClass('disabled');

    const lastDay = month.days[month.days.length - 1];
    if (clickedDate < 1 || clickedDate > lastDay.date) {
      return false;
    }
    $('.open-times-container').html('');

    let openTimes = possibleReservations.slice();

    const reservations = _.map(reservationsDB.getReservations(), (reservation) => {
      return parseDate(reservation.date);
    });
    for (let i = 0; i < reservations.length; ++i) {
      if (reservations[i].month === month.month &&
          reservations[i].date === clickedDate) {
        const index = openTimes.indexOf(reservations[i].time);
        if (index > -1) {
          openTimes.splice(index, 1);
        }
      }
    }
    for (let i = 0; i < openTimes.length; ++i) {
      $('.open-times-container').append(timeSlotView(openTimes[i]));
    }

    $('.time-slot').click(function(event) {
      const time = $(event.target).html();
      SELECTION.setHourMinute(time);
      $('#save-btn').removeClass('disabled');

      const timeSlotElems = $('.time-slot');
      const selectedTimeSlot = $(`#${getTimeSlotIdFromTime(time)}`);
      timeSlotElems.removeClass('selected');
      selectedTimeSlot.addClass('selected');
    });
  });
}

function renderDefaultCalendar() {
  renderCalendar(thisMonth);
}

function renderNextMonth() {
  let newMonth;
  if (renderedMonth.month < 11) {
    newMonth = calendar.find(renderedMonth.year, renderedMonth.month + 1);
  } else {
    newMonth = calendar.find(renderedMonth.year + 1, 0);
  }
  if (newMonth) {
    renderedMonth = newMonth;
    SELECTION.setYear(newMonth.year);
    renderCalendar(renderedMonth);
  } else {
    console.log('going too far forward in time!');
  }
}

function renderPrevMonth() {
  let newMonth;
  if (renderedMonth.month > 0) {
    newMonth = calendar.find(renderedMonth.year, renderedMonth.month - 1);
  } else {
    newMonth = calendar.find(renderedMonth.year - 1, 11);
  }
  if (newMonth) {
    renderedMonth = newMonth;
    renderCalendar(renderedMonth);
  } else {
    console.log('going too far back in time!');
  }
}

function getSelection() {
  return new DateTime(
    SELECTION.year,
    SELECTION.month,
    SELECTION.day,
    SELECTION.hour,
    SELECTION.minute
  );
}

function clearSelection() {
  if (SELECTION.hour) {
    const timeId = getTimeSlotIdFromTime(SELECTION.getHourMinuteString());
    const selectedTimeSlot = $(`#${timeId}`);
    selectedTimeSlot.removeClass('selected');
  }
  if (SELECTION.day) {
    const selectedDay = $(`day-${SELECTION.date}`);
    selectedDay.css('background-color', '#50B734');
  }
  SELECTION.setHourMinute(null);
  SELECTION.setDay(null);
  SELECTION.setMonth(null);
  $('.open-times-container').html('');
}

module.exports = {
  renderDefaultCalendar: renderDefaultCalendar,
  renderNextMonth: renderNextMonth,
  renderPrevMonth: renderPrevMonth,
  getSelection: getSelection,
  clearSelection: clearSelection,
};
