<!doctype html>
<html>
  <head>
    <title>Beepbox: beep it and box it</title>
    <link rel="stylesheet" href="beepbox.css" type="text/css" />
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="beepbox.js"></script>
  </head>
  <body>
    <div id="container">
      <div id="notificationBar"></div>
      <h1>Welcome to Beepbox</h1>
      <p>Beepbox is a new site that lets YOU drop short text messages ("beeps")
      online for everyone to see.</p>
      <div class="box">
        <h2>Drop a beep</h2>
        <form name="beepBoxForm">
          <input type="hidden" name="action" value="beep" />
          Your name:<br /><input type="text" name="name" /><br />
          Your beep: <span id="charNotice"></span> <br />
          <textarea rows="1" name="beep"></textarea><br />
          <input name="beeperSubmit" type="submit" value="Beep it">
        </form>
      </div>
      <div class="box">
        <h2>Latest beeps</h2>
        <div id="beepBox">
        </div>
      </div>
    </div>
  </body>
</html>