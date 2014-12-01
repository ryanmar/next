addSample(".toCalendar", {
  html : ['<div id="calendar-example"></div>'],
  javascript: function() {
    q("#calendar-example").toCalendar();
  },
  executable: true,
  showMarkup: true
});

addSample(".toCalendar", {
  javascript: function() {
    var calendar = new qx.ui.control.Calendar();
    q('body').append(calendar);
  },
  executable: true,
  showMarkup: true
});
