// returns the day appended with the proper suffix. eg suffixOf(10) returns 10th
function suffixOf(day) {
  let j = day % 10,
    k = day % 100;
  if (j == 1 && k != 11) {
    return day + "st";
  }
  if (j == 2 && k != 12) {
    return day + "nd";
  }
  if (j == 3 && k != 13) {
    return day + "rd";
  }
  return day + "th";
}

// return true if date1 is the same day as date2. 
// eg sameDay(12/23/18, 12/23/18) returns true
function sameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth();
}

// returns true if look is within start and end dates
// eg containDay(12/1/19, 12/3/19, 12/5/19) returns false
function containDay(start, end, look) {
  return start.getFullYear() <= look.getFullYear() && look.getFullYear() <= end
    .getFullYear() &&
    start.getDate() <= look.getDate() && look.getDate() <= end.getDate() &&
    start.getMonth() <= look.getMonth() && look.getMonth() <= end.getMonth();
}

// return string version of date
function convertDate(n) {
  let monthString = monthNames[n.getMonth()];
  let dateString = suffixOf(n.getDate());
  return dateString + ' ' + monthString + ' ' + n.getFullYear();
}

// return string version of date without year
function convertDateNoYear(n) {
  let monthString = monthNames[n.getMonth()];
  let dateString = suffixOf(n.getDate());
  return monthString + ' ' + dateString + ' ';
}

// return string version of date without year or month
function convertDateNoYearNoMonth(n) {
  let monthString = monthNames[n.getMonth()];
  let dateString = suffixOf(n.getDate());
  return dateString + ' ';
}

// prints the dates of an event object from Google calendar API
function printDates(n) {
  for (const it in n) {
    console.log(n[it].start);
  }
}

// toISOstring shim, support other browsers if they don't have it 
// if (!Date.prototype.toISOString) {
//     (function() {

//       function pad(number) {
//         if (number < 10) {
//           return '0' + number;
//         }
//         return number;
//       }

//       Date.prototype.toISOString = function() {
//         return this.getUTCFullYear() +
//           '-' + pad(this.getUTCMonth() + 1) +
//           '-' + pad(this.getUTCDate()) +
//           'T' + pad(this.getUTCHours()) +
//           ':' + pad(this.getUTCMinutes()) +
//           ':' + pad(this.getUTCSeconds()) +
//           '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
//           'Z';
//       };

//     }());
//   }