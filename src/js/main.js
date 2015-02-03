(function($) {

  // Utils wrapper
  function Utils() {

  }

  // Pretty print month name
  Utils.printMonth = function(month) {
    var m_names = new Array("January", "February", "March",
      "April", "May", "June", "July", "August", "September",
      "October", "November", "December");
    return m_names[month];
  };

  Utils.addDay = function(date, num) {
    num = num || 1;
    return new Date(date - (-1000 * 60 * 60 * 24 * num)); // Add 1 day
  };

  // Dom events are handled here
  function EventHandler() {
    var self = this;

    this.progress = {
      element: $(".progress-top"),
      stage: 0
    };

    this.Cal = new Calendar(2013);

    this.setupProgress();
    this.setupDatePicker();
    this.setupCalendar();

  }

  EventHandler.prototype.setupProgress = function() {
    var self = this;
    // In case user clicks a stage to go back
    this.progress.element.children("ul").children("li").click(function() {
      var index = $(this).index();
      if (index <= self.progress.stage) {
        self.changeToStage(index);
      }
    });

    $(".stage .next").click(function() {
      var index = $(".stage .next").index(this);

      if (self.checkStage(index)) {
        self.changeToStage(++index);
      } else {

      }
    });
    $(".stage .back").click(function() {
      var index = $(".stage .back").index(this);
      self.changeToStage(index); // index is -1 based (first stage has no back button)
    });
  };

  EventHandler.prototype.checkStage = function(index) {
    switch (index) {
      case 0:
        this.Cal.setYear($(".yearSelect").val());
        this.refresh();
        return true;
      case 1:
        var start = new Date($("#dateStart").pickadate().pickadate("picker").get());
        var end = new Date($("#dateEnd").pickadate().pickadate("picker").get());


        var year = this.Cal.getYear();
        if (start < end &&
          start.getFullYear() === year &&
          end.getFullYear() == year + 1) {
          this.Cal.setStartEndDates({
            start: start,
            end: end
          });
          this.refresh();
          return true;
        }
        return false;
      case 2:
        return true;
      default:
        return false;
    }
  };

  EventHandler.prototype.changeToStage = function(i) {
    // There are only 3 stages plus end
    if (i < 0 || i > 3) {
      return null;
    }
    this.progress.stage = i;
    this.progress.element.removeClass("complete-0 complete-1 complete-2 complete-3");
    this.progress.element.addClass("complete-" + i);

    $("#main").children().removeClass("visible");
    $("#main").children("div:nth-child(" + (i + 1) + ")").addClass("visible");

  };

  EventHandler.prototype.setupDatePicker = function() {
    var self = this;
    var year = this.Cal.getYear();

    var opts = {
      firstDay: true,
      min: new Date(year, 7, 2), // includes 1
      max: new Date(year + 1, 5, 31), // includes 30
      disable: [6, 7]

    };
    var dateStart = $("#dateStart").pickadate(opts);
    var dateEnd = $("#dateEnd").pickadate(opts);

    //dateStart.pickadate("set", opts);
    dateStart.pickadate("picker").set("view", new Date(year, 7));
    //dateEnd.pickadate("set", opts);
    dateEnd.pickadate("picker").set("view", new Date(year + 1, 5));
  };
  EventHandler.prototype.setupCalendar = function() {

  };

  EventHandler.prototype.refresh = function() {
    this.setupDatePicker();
    this.setupCalendar();
  };

  // Holds school weeks
  function SchoolWeek(letter) {
    this.letter = letter || ""; // A|B
    this.days = [];
    this.quotes = [];
  }

  // Test if all days in that week are free
  SchoolWeek.prototype.isFree = function() {
    for (var i in this.days) {
      if (!this.days[i].isHoliday()) {
        return false;
      }
    }
    return true;
  };

  // Holds individual school days
  function SchoolDay(date) {
      this.date = date;
      this.holiday = false;
      this.disable = false;
      this.information = [];
    }
    // Is this day a holiday
  SchoolDay.prototype.isHoliday = function() {
    return this.holiday;
  };

  // get offset from Saturday; Mon -> 1 Tue -> 2 etc...
  SchoolDay.prototype.getOffset = function() {
    var day = this.date.getUTCDay();
    if (day === 0) {
      day = 7;
    }
    return day;
  };

  // Holds the calendar
  function Calendar(year) {
    this.startYear = parseInt(year);
    this.calendar = ".calendar";
    this.weeks = [];
    this.dates = {
      start: new Date(),
      end: new Date()
    };
  }

  // Populate calendar with dates
  Calendar.prototype.populate = function() {
    var start = new Date(this.startYear, 7, 1, 12);
    var now = start;
    var stop = new Date(this.startYear + 1, 5, 31, 12);
    this.weeks = [];
    // Loop months
    while (now <= stop) {
      var week = new SchoolWeek();
      while (true) {
        if (now.getUTCDay() === 0) {
          now = Utils.addDay(now);
        }
        if (now.getUTCDay() <= 5) {
          var day = new SchoolDay(now);
          if (now < this.dates.start || now > this.dates.end - (-24 * 60 * 60 * 1000)) {
            day.disable = true;
          }
          week.days.push(day);
          now = Utils.addDay(now);
        } else {
          break;
        }
      }

      // If the week is empthy discard it
      if (week.days.length > 0) {
        this.weeks.push(week);
      }
      now = Utils.addDay(now, 2);
    }
    return this;
  };

  Calendar.prototype.setYear = function(year) {
    this.startYear = parseInt(year);
    this.populate();
    return this;
  };

  Calendar.prototype.getYear = function(year) {
    return this.startYear;
  };

  Calendar.prototype.setStartEndDates = function(dates) {
    this.dates = dates;
    this.populate();
    this.render();
    return this;
  };

  // Render the calendar table
  Calendar.prototype.render = function() {
    var tbodyStr = "";
    var month = 6;
    $(this.calendar).html("");

    for (var j in this.weeks) {
      var week = this.weeks[j];
      var weekRow = "";
      if (week.days[0].date.getUTCMonth() === month) {
        weekRow = "<tr><td>" + ((j % 2 === 0) ? ("A") : ("B")) + "</td>";

      }


      for (var k in week.days) {
        var day = week.days[k];
        if (day.date.getUTCMonth() !== month) { // new month
          month = day.date.getUTCMonth();
          weekRow += "</tr><tr><th>" + Utils.printMonth(month) + "</th>";
          var offset = day.getOffset();
          for (var i = 1; i < offset; i++) {
            weekRow += "<td></td>";
          }
        }
        weekRow += ("<td><div class='" + ((day.holiday) ? ("holiday ") : (" ")) + ((day.disable) ? ("disable ") : (" ")) + "' week='" + j + "' day='" + k + "'' >" + day.date.getDate() + "</div></td>");
      }
      weekRow += "</tr>";
      tbodyStr += weekRow;
    }

    $(this.calendar).html(tbodyStr);
    return this;
  };

  Calendar.prototype.toggleHoliday = function(week, day, element) {
    this.weeks[week].days[day].holiday = !this.weeks[week].days[day].holiday;
    $(element).toggleClass("holiday");
    return this;
  };



  $(document).ready(function() {
    window.eh = new EventHandler();
  });

})($);