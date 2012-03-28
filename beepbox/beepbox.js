(function() {
  /**
   * Initialization code for Beepbox that sets handlers and default CSS.
   */
  $(document).ready(function() {
    // Hide the notification bar by default.
    $('#notificationBar').hide();
    
    // Resizes the beeper when the user presses Enter.
    checkBeeperLength();
    $("textarea[name=beep]").keyup(function() {
      setBeeperSize($(this));
      checkBeeperLength();
    });
    
    // Overrides the default form submission behavior when the user submits a
    // new beep in favor of our own handleBeepBoxFormSubmit.
    $("form[name=beepBoxForm]").submit(function(event) {
      event.preventDefault();
      handleBeepBoxFormSubmit($(this));
    });
    
    // Starts "long polling" for beeps.
    pollBeeper();
  });
  
  /**
   * Sends an AJAX POST request to the server with the beep data when the user
   * makes a beep. On success, it notifies the user. 
   *
   * Args:
   *  beepboxForm: The jQuery object for the beeper form.
   */
  function handleBeepBoxFormSubmit(beepboxForm) {
    $.post("beepbox.php", beepboxForm.serialize(), function() {
      var notificationBar = $('#notificationBar');
      notificationBar.html("Your beep was submitted successfully!");
      notificationBar.fadeIn();
      setTimeout(function() {
        notificationBar.slideUp();
      }, 2000);
    });
  }
  
  /**
   * Returns: the HTML for a single beep.
   *
   * Args:
   *  timeString: The date and time, given as a string.
   *  name: The name of the submitter.
   *  beep: The submitter's beep.
   */
  function generateBeepHtml(timeString, name, beep) {
    beep = beep.replace(/\n/g, "<br />");
  
    var html =
    '<div class="beep">\
      <strong>By:</strong> ' + name + '<br />\
      <strong>On:</strong> ' + timeString + '<br />\
      <p>' + beep + '</p>\
    </div>';
    return html;
  }

  /**
   * Updates the "Latest beeps" when the response comes back from the server
   * after calling pollBeeper().
   *
   * Args:
   *  response: An array of the last 100 beeps in the database. Each row is an
   *    associative array with "id," "timeString," "name," and "beep,"
   *    fields.
   */
  function onPollComplete(response) {
    var beepBox = $("#beepBox");
    
    if (response === null) {
      beepBox.html("No beeps yet :(");
    } else if (beepBox.data("latestBeepId") === undefined) {
      var beepHtml = "";
      for (rowNum in response) {
        var row = response[rowNum];
        var id = row["id"];
        var timeString = row["timeString"];
        var name = row["name"];
        var beep = row["beep"];
        
        if (rowNum === "0") {
          beepBox.data("latestBeepId", id);
        }
        
        beepHtml += generateBeepHtml(timeString, name, beep);
        
      }
      beepBox.html(beepHtml);
    } else {
      // TODO: Fix this so that instead of just getting the latest beep, we get
      // all the beeps that haven't been displayed yet.
      var latestBeep = response["0"];
      var id = latestBeep["id"];
      var timeString = latestBeep["timeString"];
      var beep = latestBeep["beep"];
      var name = latestBeep["name"];
      
      if (id > beepBox.data("latestBeepId")) {
        beepBox.html(generateBeepHtml(timeString, name, beep) + beepBox.html());
        $("#beepBox .beep:first-child").hide();
        $("#beepBox .beep:first-child").slideDown();
        beepBox.data("latestBeepId", id);
      }
    }
    setTimeout(pollBeeper, 200);
  }
  
  /**
   * Sends an AJAX GET request to the server to get the latest 100 beeps.
   */
  function pollBeeper() {
    $.getJSON('beepbox.php', {}, onPollComplete);
  }
  
  /**
   * Checks the beeper length and notifies the user if it's above 150
   * characters.
   */
  function checkBeeperLength() {
    var length = $("textarea[name=beep]").val().length;
    
    if (length > 150) {
      $("input[name=beeperSubmit]").attr("disabled", "disabled");
      $("#charNotice").html("Beep too long by " + (length - 150)
        + " characters.");
    } else {
      $("input[name=beeperSubmit]").removeAttr("disabled");
      $("#charNotice").html((150 - length) + " characters remaining.");
    }
  }
  
  /**
   * Adjusts the size of the beeper textarea according to the number of newlines
   * in it. This doesn't work when the user's input is just a very long line.
   */
  function setBeeperSize(textarea) {
    var numRows = textarea.val().split("\n").length + 1;
    textarea.attr("rows", numRows);
  }
})();
