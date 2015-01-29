(function($){
  function Calendar(year){
    this.startYear = year;
  }

  Calendar.prototype.populate = function(){

  }


  $(document).ready(function(){
    $(".yearSelect").on("change", function(){
      console.log($(this).val());
    });

    var calendar = $(".calendar");




  });

})($);
