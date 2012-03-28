<?php
/**
 * Handles requests to either add a new beep to the database, or to retrieve the
 * latest 100 beeps.
 */
require_once("config.php");

// Set up DB.
$db = @mysql_connect($DB_HOST, $DB_USER, $DB_PASSWORD);
mysql_select_db($DB_NAME, $db);

// If action variable is set to "beep", insert a new beep into the DB.
if (isset($_POST["action"]) && $_POST["action"] === "beep") {
  $name = trim($_POST["name"]);
  $beep = trim($_POST["beep"]);
  $result = mysql_query(sprintf(
    "insert into beeps(name, beep) values (\"%s\", \"%s\")",
    mysql_real_escape_string($name),
    mysql_real_escape_string($beep)));
}

// Otherwise, assume that the action is a request for existing beeps.
else {
  $time = time();
  while((time() - $time) < 1) {
    $result = mysql_query(
      "select * from beeps order by timestamp desc limit 100");
    if ($result === false) { // No beeps yet.
      return false;
    }

    $rows = array();
    if (mysql_num_rows($result) > 0) {
      while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
        $row["name"] = htmlspecialchars($row["name"]);
        $row["beep"] = htmlspecialchars($row["beep"]);
        $row["timeString"] = date('l, M j Y \a\t g:ia',
          strtotime($row["timestamp"]));
        $rows[] = $row;
      }
      echo json_encode($rows);
      break;
    }

    usleep(800);
  }
}

?>
