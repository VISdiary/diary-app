(function($){
  function EventHandler(cal) {
    this.Cal = cal; // Calendar object
  }

  function SchoolMonth(){
    this.weeks = [];
  }

  SchoolMonth.prototype.getOffset = function(){
    if (this.weeks[0] && this.weeks[0].days[0]) {
      var day = this.weeks[0].days[0].date.getUTCDay();
      if (day === 0) {
        day = 7;
      }
      return day;
    }
    return null;
  }

  SchoolMonth.prototype.getNumber = function(){
    if (this.weeks[0] && this.weeks[0].days[0]) {
      return this.weeks[0].days[0].date.getUTCMonth();
    }
    console.log(this)
    return null;
  }

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




  function SchoolDay(date){
    this.date = date;
    this.holiday = false;
    this.information = [];
  }

  SchoolDay.prototype.isHoliday = function(){
    return this.holiday;
  }

  function Calendar(year, calendar){
    this.startYear = parseInt(year);
    this.calendar = calendar;
    this.months = [];
  }


  Calendar.prototype.populate = function(){
    var start = new Date(this.startYear, 7, 1);
    var now = start;
    var stop = new Date(this.startYear+1, 6, 31);
    // Loop months
    while (now <= stop){
      var month = new SchoolMonth(now);
      var monthNum = now.getUTCMonth();
      // Loop days in month
      while (monthNum == now.getUTCMonth()) {
        var week = new SchoolWeek()
        while (true) {
          console.log(now.getUTCDay())
          if (now.getUTCDay() == 0) {
            now = this.addDay(now);
            continue;
          }
          if (now.getUTCMonth() != monthNum) {
            break;
          }
          if (now.getUTCDay() <= 5) {
            var day = new SchoolDay(now);
            week.days.push(day);
            now = this.addDay(now)
          } else {
            break;
          }
        }
        month.weeks.push(week);
        now = this.addDay(now, 2);
      }
      this.months.push(month);
      console.log(now)
    }

  }

  Calendar.prototype.addDay = function(date, num){
    num = num || 1
    return new Date(date - (-1000*60*60*24 * num)); // Add 1 day
  }

  Calendar.prototype.render = function(){
    var tbodyStr = "";
    for (var i in this.months) {
      var month = this.months[i];
      var monthOffset = month.getOffset();
      tbodyStr += "<tr><th>"+ month.getNumber() +"</th></tr>"
      for (var j in month.weeks) {
        var week = month.weeks[j];
        var weekRow = "<tr><td>" + ((j%2 == 0)?("A"):("B")) + "</td>";
        if (monthOffset) {
          for (var i = 1; i < monthOffset; i++) {
            weekRow += "<td></td>";
          }
          monthOffset = 0;
        }
        for (var k in week.days) {
          var day = week.days[k];
          weekRow += ("<td><div>" + day.date + "</div></td>");
        }
        weekRow += "</tr>";
        tbodyStr += weekRow;
      }
    }
    $(this.calendar).html(tbodyStr);
  }



  $(document).ready(function(){
    window.Cal = new Calendar("2014", ".calendar");
    window.Cal.populate()
    window.Cal.render();

    $(".yearSelect").on("change", function(){
      console.log($(this).val());
    });






  });

})($);
