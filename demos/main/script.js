(function () {

  'use strict';

  var formatter = timeDelta.create();

  document.getElementById('dates-form').addEventListener('submit', function (event) {
    event.preventDefault();
    format();
  });

  function getDateFromInput (id) {
    var dateString = document.getElementById(id).value;
    return new Date(dateString);
  }

  function format () {
    var date1 = getDateFromInput('date-1');
    var date2 = getDateFromInput('date-2');
    document.getElementById('date-difference').innerText = formatter.format(date1, date2);
  }

})();
