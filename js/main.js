(function($){

  function printMonth(month) {
    var m_names = new Array("January", "February", "March",
"April", "May", "June", "July", "August", "September",
"October", "November", "December");
    return m_names[month]
  }


  function EventHandler(cal) {
    this.Cal = cal; // Calendar object
  }

  function SchoolMonth(){
    this.weeks = [];
  }

  SchoolMonth.prototype.getOffset = function(){
    for (var i in this.weeks) {
      for (var j in this.weeks[i].days){
        var day = this.weeks[i].days[j].date.getUTCDay();
        if (day === 0) {
          day = 7;
        }
        return day;
      }
    }
    return null;
  }

  SchoolMonth.prototype.getNumber = function(){
    for (var i in this.weeks) {
      for (var j in this.weeks[i].days){
        return this.weeks[i].days[j].date.getUTCMonth();
      }
    }
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
    var start = new Date(this.startYear, 7, 1, 12);
    var now = start;
    var stop = new Date(this.startYear+1, 6, 31, 12);
    // Loop months
    while (now <= stop){
      var month = new SchoolMonth();
      var monthNum = now.getUTCMonth();
      // Loop weeks in month
      while (monthNum == now.getUTCMonth()) {
        var week = new SchoolWeek()
        while (true) {
          if (now.getUTCDay() == 0) {
            now = this.addDay(now);
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
        if (now.getUTCMonth() != monthNum) {
          break;
        }
        month.weeks.push(week);
        now = this.addDay(now, 2);
      }
      this.months.push(month);
      console.log(now)
    }

  }

  Calendar.prototype.addDay = function(date, num){
    num = num || 1;
    return new Date(date - (-1000*60*60*24 * num)); // Add 1 day
  }

  Calendar.prototype.render = function(){
    var tbodyStr = "";
    for (var i in this.months) {
      var month = this.months[i];
      var monthOffset = month.getOffset();
      tbodyStr += "<tr><th>"+ printMonth(month.getNumber()) +"</th></tr>"
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
          weekRow += ("<td><div>" + day.date.getDate() + "</div></td>");
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
