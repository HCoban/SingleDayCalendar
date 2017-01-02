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
  this.minutes = {};
  this.eventGroups = {};
  this.addEvent = function (event) {
    this.events.push(event);
  };

  this.getEvent = function (id) {
    return this.events[id];
  };

  this.addAdjacentEvents = function () {
    for (var i = 0; i < this.events.length; i++) {
      for (var j = 0; j < this.events.length; j++) {
        if (i!==j) {
          var firstEvent = this.getEvent(i);
          var secondEvent = this.getEvent(j);

          if (firstEvent.start < secondEvent.end && firstEvent.end > secondEvent.start) {
            firstEvent.adjacent.push(secondEvent.id);
          }
        }
      }
    }
  };

  this.generateMinutes = function () {
    for (var i = 0; i < 720; i++) {
      this.minutes[i] = [];
    }

    for (var j = 0; j < this.events.length; j++) {
      var currentEvent = this.getEvent(j);
      for (var minute = currentEvent.start; minute < currentEvent.end; minute++) {
        this.minutes[minute].push(currentEvent.id);
      }
    }
  };

  this.generateEventGroups = function () {
    var groupKey = 0;
    for (var minute = 0; minute < 720; minute++) {
      if (this.minutes[minute].length > 0) {
        var group = group || [];
        var events = this.minutes[minute];
        for (var i = 0; i < events.length; i++) {
          var id = events[i];
          if(!(group.includes(id))) {
            group.push(id);
            var currentEvent = this.getEvent(id);
            currentEvent.groupKey = groupKey;
          }
        }
      } else {
        if (group) {
          this.eventGroups[groupKey] = {events: group};
          groupKey++;
        }

        group = null;
      }

      if (group) {
        this.eventGroups[groupKey] = {events: group};
      }
    }

  };

  this.adjustWidth = function () {
    for (var i = 0; i < 720; i++) {
      var minute = this.minutes[i];
      for (var j = 0; j < minute.length; j++) {
        var currentEvent = this.getEvent(minute[j]);
        var widthFactor = Math.max(minute.length, currentEvent.widthFactor);
        currentEvent.widthFactor = widthFactor;
      }
    }

    var that = this;
    var groupKeys = Object.keys(this.eventGroups);
    for (var groupId = 0; groupId < groupKeys.length; groupId++) {
      var group = this.eventGroups[groupId];
      var groupWidthFactor = 0;
      group.events.forEach(function (eventId) {
        var event = that.getEvent(eventId);
        if (event.widthFactor > groupWidthFactor) {
          groupWidthFactor = event.widthFactor;
        }
      });

      group.groupWidthFactor = groupWidthFactor;
    }
  };

  this.calculateXCoordinate = function () {
    var calendar = this;
    var groupKeys = Object.keys(calendar.eventGroups);
    for (var i = 0; i < groupKeys.length; i++) {
      var group = calendar.eventGroups[groupKeys[i]];

      for (var j = 0; j < group.events.length; j++) {
        var currentEvent = calendar.getEvent(group.events[j]);

        var spaces = new Array(group.groupWidthFactor);
        currentEvent.adjacent.forEach(function (adjacentId) {
          var adjacent = calendar.getEvent(adjacentId);
          if (adjacent.xCoordinate !== undefined) {
            spaces[adjacent.xCoordinate] = "filled";
          }
        });


        for (var k = 0; k < spaces.length; k++) {
          if (spaces[k] !== "filled") {
            currentEvent.xCoordinate = k;
            break;
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
  this.widthFactor = 1;
}

function layOutDay (events) {
  clearCalendar();
  var calendar = new Calendar;
  for (var i = 0; i < events.length; i++) {
    var currentEvent = new CalendarEvent(i, events[i]);
    calendar.addEvent(currentEvent);
  }

  calendar.addAdjacentEvents();
  calendar.generateMinutes();
  calendar.generateEventGroups();
  calendar.adjustWidth();
  calendar.calculateXCoordinate();
  render(calendar);
}

function clearCalendar () {
  var previousEvents = document.getElementsByClassName("events");
  if (previousEvents.length > 0) {
    previousEvents[0].remove();
  }
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

    var group = calendar.eventGroups[currentEvent.groupKey];
    var groupWidth = 600 / group.groupWidthFactor;
    eventDiv.style.setProperty("width", `${groupWidth}px`);
    eventDiv.style.setProperty("left", `${currentEvent.xCoordinate * groupWidth}px`);

    var eventContent = document.createElement("div");
    eventContent.className = "event-content";

    var item = document.createElement("span");
    item.className = "item";
    item.textContent = currentEvent.item;
    eventContent.appendChild(item);

    var location = document.createElement("span");
    location.className = "location";
    location.textContent = currentEvent.location;
    eventContent.appendChild(location);

    eventDiv.appendChild(eventContent);
    eventsDiv.appendChild(eventDiv);

    container.appendChild(eventsDiv);
  }


}
