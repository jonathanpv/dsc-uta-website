/*
 * Used references: 
 * github.com/google/google-api-javascript-client/blob/master/docs/start.md
 * developers.google.com/calendar/v3/reference/events/list
 */
var apiResult;

var itemsObject;

// Loads the client for GAPI to use
function loadClient() {
  // 2. Initialize the Javascript client library. 

  // This key only works with IPs and websites I whitelisted.
  let apiKey = "AIzaSyB_Mpr5zmYlgd8lfOf923y9rT7iiVKvePY";

  gapi.client.setApiKey(apiKey);
  // URL that has the calendar API
  let rest =
    "https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  return gapi.client.load(rest)
    .then(function() {
        console.log("GAPI client loaded for API");
      },
      function(err) {
        console.error("Error loading GAPI client for API", err);
      });
}

// Gets google calendar events from a given calendarId
function execute() {
  // 3. Initialize and make the API request.
  return gapi.client.calendar.events.list({
      "calendarId": "orca959um7af74lt931bp5v1v0@group.calendar.google.com"
    })
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        // console.log("Response", response.result);
        apiResult = response.result;
        itemsObject = apiResult.items;
      },
      function(err) {
        console.error("Execute error", err);
      });
}

function populateHTML() {
  // console.log(eventItems);
  for (const i in itemsObject) {
    let eventObject = itemsObject[i];
    /*
      Google calendar API stores event start dates without 
      specific start times inside the "start" object with a "date" 
      key, the value being a string of format "YYYY-MM-DD", while events
      with specific start times are found with the "dateTime" key.

      Assume events without specific start times mean they start at 12:00AM 
      and end at 11:59PM.
    
      To specify a time use the string value from 
      the "date" key, and append to it the time of ISO format 'THH:MM:SS.000Z'.
      Input the new string as a parameter to the new Date() constructor. 

      The same thing happens with end times, except the object is "end".

      Format explanation: 'THH:MM:SS.000Z'
      whatever comes after the 'T' is the specific time.
      H is hours, M minutes, S seconds, after the '.' is milliseconds.

      Look at README for more information about specifiying a start/end time
    */

    // This is where the start object exists
    let startObject = eventObject.start;

    // ISO string for 12:00 AM in my time zone, change if not accurate to you
    let twelveAm = 'T06:00:00.000Z';

    // Specify a start time if it doesn't have one, if it does then use dateTime
    let startDate = (startObject.date) ? new Date(startObject.date
      .toLocaleString() + twelveAm) : new Date(startObject.dateTime
      .toLocaleString());

    // This is where the end object exists
    let endObject = eventObject.end;
    // ISO string for 11:59 PM in my time zone, change if not accurate to you
    let elevenPm = 'T05:59:00.000Z';
    // Specify an end time if it doesn't have one, if it does then use dateTime
    let endDate = (startObject.date) ? new Date(endObject.date
      .toLocaleString() + elevenPm) : new Date(endObject.dateTime
      .toLocaleString());

    let currentDate = new Date();
    // Only consider the events that are after or during today's date.
    if (startDate > currentDate || sameDay(startDate, currentDate) ||
      containDay(startDate, endDate, currentDate)) {
      // changes the color of dot, only if current date is in (start-end) date  
      let activeDot = (sameDay(startDate, currentDate) || containDay(
        startDate,
        endDate, currentDate)) ? 'ei_Dot dot_active' : 'ei_Dot';

      // isoString to populate our div with data, used to sort divs later
      let isoString = startDate.toISOString();

      let eventDiv = document.createElement('div');
      eventDiv.setAttribute('class', 'event_item');
      eventDiv.setAttribute('data-date', isoString);

      let dotDiv = document.createElement('div');
      dotDiv.setAttribute('class', activeDot);

      // Every event has a title, so no need for ternary if
      let title = eventObject.summary;

      let titleDiv = document.createElement('div');
      titleDiv.setAttribute('class', 'ei_Title');
      titleDiv.innerHTML = title;

      // Options to display time like this: HH:MM AM different than the default
      let options = {
        hour: '2-digit',
        minute: '2-digit'
      };

      // Extracts the time from a date with specified format 
      let startTimeString = startDate.toLocaleTimeString([], options);
      let endTimeString = endDate.toLocaleTimeString([], options);

      // Variables added for readability, let me know if it's unnecessary
      let descriptionKey = eventObject.description;
      let locationKey = eventObject.location;

      // Some events don't have locations or descriptions, so use ternary if
      let location = (locationKey) ? locationKey : "";
      let description = (descriptionKey) ? descriptionKey : "";

      let summaryDiv = document.createElement('div');
      summaryDiv.setAttribute('class', 'ei_Copy');
      summaryDiv.innerHTML = convertDateNoYear(startDate) + ' - ' +
        convertDateNoYear(endDate) + '<br>' +
        startTimeString + ' - ' + endTimeString + '<br>' +
        location + '<br>' +
        description;

      let calendar = document.getElementById('white_calendar');
      eventDiv.appendChild(dotDiv);
      eventDiv.appendChild(titleDiv);
      eventDiv.appendChild(summaryDiv);

      calendar.appendChild(eventDiv);
    }
  }

  // sort the divs after the for loop has populated the html with data
  let calendar = $("#white_calendar");
  let eventDiv = calendar.children('.event_item').detach().get();
  eventDiv.sort(function(a, b) {
    return new Date($(a).data("date")) - new Date($(b).data(
      "date"));
  });

  calendar.append(eventDiv);

}

function getCalendarList() {
  loadClient().then(execute).then(populateHTML);
}