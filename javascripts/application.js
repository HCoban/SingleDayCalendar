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

function CalendarEvent (id, start, end) {
  this.id = id;
  this.start = start;
  this.end = end;
  this.adjacent = [];
}

function layOutDay (events) {
  var calendar = new Calendar;
  for (var i = 0; i < events.length; i++) {
    var currentEvent = new CalendarEvent(i, events[i].start, events[i].end);
    calendar.addEvent(currentEvent);
  }

  calendar.addAdjacentEvents();

}
