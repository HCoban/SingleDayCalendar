document.addEventListener("DOMContentLoaded", function () {
  var events = [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 560, end: 620},
    {start: 610, end: 670}];
  layOutDay(events);
});

function Calendar () {
  this.events = [];
  this.addEvent = function (event) {
    this.events.push(event);
  };

  this.getEvent = function (id) {
    return this.events[id];
  };

  this.addAdjacentEvents = function () {
    for (var i = 0; i < this.events.length; i++) {
      for (var j = 0; j < this.events.length; j++) {
        if (!(i==j)) {
          var firstEvent = this.getEvent(i);
          var secondEvent = this.getEvent(j);

          if (firstEvent.start < secondEvent.end && firstEvent.end > secondEvent.start) {
            firstEvent.adjacent.push(secondEvent.id);
          }
        }
      }
    }
  };

}

function CalendarEvent (id, event) {
  this.id = id;
  this.start = event.start;
  this.end = event.end;
  this.duration = this.end - this.start;
  this.item = event.item || "Sample Item";
  this.location = event.location || "Sample Location";
  this.adjacent = [];
}

function layOutDay (events) {
  var calendar = new Calendar;
  for (var i = 0; i < events.length; i++) {
    var currentEvent = new CalendarEvent(i, events[i]);
    calendar.addEvent(currentEvent);
  }

  calendar.addAdjacentEvents();
  render(calendar);
}

function render (calendar) {
  var container = document.getElementsByClassName("events-container")[0];
  var eventsDiv = document.createElement("div");
  eventsDiv.className = "events";

  for (var i = 0; i < calendar.events.length; i++) {
    var currentEvent = calendar.getEvent(i);
    var eventDiv = document.createElement("div");
    eventDiv.className = "event";
    eventDiv.style.setProperty("top", `${currentEvent.start}px`);
    eventDiv.style.setProperty("height", `${currentEvent.duration}px`);

    var item = document.createElement("span");
    item.className = "item";
    item.textContent = currentEvent.item;
    eventDiv.appendChild(item);

    var location = document.createElement("span");
    location.className = "location";
    location.textContent = currentEvent.location;
    eventDiv.appendChild(location);

    eventsDiv.appendChild(eventDiv);

    container.appendChild(eventsDiv);
  }


}
