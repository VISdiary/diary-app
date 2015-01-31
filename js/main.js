(function($){

  // Pretty print month name
  function printMonth(month) {
    var m_names = new Array("January", "February", "March",
"April", "May", "June", "July", "August", "September",
"October", "November", "December");
    return m_names[month]
  }

  // Dom events are handled here
  function EventHandler() {
    var self = this;

    $( "#dateStart" ).pickadate().pickadate("on", {
      set: function(thing){
        self.setStartDate(new Date(thing.select))
      }
    }).set("disable", [{from: [2014,08,1], to: [2015, 07,30]}]);
    $( "#dateEnd" ).pickadate().pickadate("on", {
      set: function(thing){
        self.setEndDate(new Date(thing.select))
      }
    });

    this.Cal = new Calendar($(".yearSelect").val(), ".calendar"); // Calendar object
    this.Cal.populate();
    this.Cal.render();

    $(".yearSelect").on("change", function(){
      self.Cal.updateYear($(this).val());
      self.Cal.render();
      self.refresh();
    });

    this.refresh();
  }

  EventHandler.prototype.refresh = function(){
    var self = this;
    $(".calendar tr td div");
    $(".calendar tr td div").click(function(){
      self.Cal.toggleHoliday($(this).attr("week"), $(this).attr("day"), this);
    });
  }

  EventHandler.prototype.setStartDate = function(date){

  }

  EventHandler.prototype.setEndDate = function(date){

  }

  // Holds school weeks
  function SchoolWeek(letter) {
    this.letter = letter || ""; // A|B
    this.days = [];
    this.quotes = [];
  }

  // Test if all days in that week are free
  SchoolWeek.prototype.isFree = function(){
    for (var i in this.days) {
      if (!this.days[i].isHoliday()) {
        return false;
      }
    }
    return true;
  }

  // Holds individual school days
  function SchoolDay(date){
    this.date = date;
    this.holiday = false;
    this.information = [];
  }
  // Is this day a holiday
  SchoolDay.prototype.isHoliday = function(){
    return this.holiday;
  }

  // get offset from Saturday; Mon -> 1 Tue -> 2 etc...
  SchoolDay.prototype.getOffset = function(){
    var day = this.date.getUTCDay();
    if (day === 0) {
      day = 7;
    }
    return day;
  }

  // Holds the calendar
  function Calendar(year, calendar){
    this.startYear = parseInt(year);
    console.log(this.startYear)
    this.calendar = calendar;
    this.weeks = [];
  }

  // Populate calendar with dates
  Calendar.prototype.populate = function(){
    var start = new Date(this.startYear, 7, 1, 12);
    var now = start;
    var stop = new Date(this.startYear+1, 6, 31, 12);
    this.weeks = [];

    // Loop months
    while (now <= stop){
      var week = new SchoolWeek()
      while (true) {
        if (now.getUTCDay() == 0) {
          now = this.addDay(now);
        }
        if (now.getUTCDay() <= 5) {
          var day = new SchoolDay(now);
          week.days.push(day);
          now = this.addDay(now)
        } else {
          break;
        }
      }
      this.weeks.push(week);
      now = this.addDay(now, 2);
    }

  }

  Calendar.prototype.updateYear = function(year){
    this.startYear = year;
    this.populate();
  }

  // TODO this should go into a date prototype
  Calendar.prototype.addDay = function(date, num){
    num = num || 1;
    return new Date(date - (-1000*60*60*24 * num)); // Add 1 day
  }

  // Render the calendar table
  Calendar.prototype.render = function(){
    var tbodyStr = "";
    var month = 6;

    for (var j in this.weeks) {
      var week = this.weeks[j];
      var weekRow = "";
      if (week.days[0].date.getUTCMonth() === month) {
        weekRow = "<tr><td>" + ((j%2 == 0)?("A"):("B")) + "</td>";

      }


      for (var k in week.days) {
        var day = week.days[k];
        if (day.date.getUTCMonth() !== month) { // new month
          month = day.date.getUTCMonth();
          weekRow += "</tr><tr><th>" + printMonth(month) + "</th>"
          var offset = day.getOffset();
          for (var i=1; i< offset; i++){
            weekRow += "<td></td>";
          }
        }
        weekRow += ("<td><div class='" + ((day.holiday)?("holiday "):(" ")) + "' week='" + j + "' day='" + k + "'' >" + day.date.getDate() + "</div></td>");
      }
      weekRow += "</tr>";
      tbodyStr += weekRow;
    }

    $(this.calendar).html(tbodyStr);
  }

  Calendar.prototype.toggleHoliday = function(week, day, element){
    console.log(week, day)
    this.weeks[week].days[day].holiday = ! this.weeks[week].days[day].holiday;
    $(element).toggleClass("holiday")
  }



  $(document).ready(function(){
    window.Ev = new EventHandler()








  });

})($);
