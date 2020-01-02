// URL that has the Google API Javascript library.
let url = "https://apis.google.com/js/api.js";

// Use jQuery function to "include" the GAPI library
$.getScript(url, function() {
  // 1. Load the Javascript Client library.
  gapi.load('client', getCalendarList);
});

/* array of month abbreviations */
let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
  "Sept", "Oct", "Nov", "Dec"
];

/* gets the current date, parse the day, month, year */
n = new Date();

/* write out the string to the html with the id "current_date" */
document.getElementById("current_date").innerHTML = convertDate(n);