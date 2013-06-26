<?php

// Define some constants
define( "RECIPIENT_NAME", "Hsin-Lei Chen" );
define( "RECIPIENT_EMAIL", "joe@joeonmars.com" );
define( "EMAIL_SUBJECT", "A message from Hsin-Lei Chen website." );

// Read the form values
$success = false;
$senderName = isset( $_POST['fromName'] ) ? preg_replace( "/[^\.\-\' a-zA-Z0-9]/", "", $_POST['fromName'] ) : "";
$senderEmail = isset( $_POST['fromEmail'] ) ? preg_replace( "/[^\.\-\_\@a-zA-Z0-9]/", "", $_POST['fromEmail'] ) : "";
$message = isset( $_POST['message'] ) ? preg_replace( "/(From:|To:|BCC:|CC:|Subject:|Content-Type:)/", "", $_POST['message'] ) : "";

// If all values exist, send the email
if ( $senderName && $senderEmail && $message ) {
  $recipient = RECIPIENT_NAME . " <" . RECIPIENT_EMAIL . ">";
  $headers = "From: " . $senderName . " <" . $senderEmail . ">";
  $success = mail( $recipient, EMAIL_SUBJECT, $message, $headers );
}

// Return an appropriate response to the browser
if ( isset($_GET["ajax"]) ) {
  echo $success ? "success" : "error";
} else {
?>
<html>
  <head>
    <title>Thanks!</title>
  </head>
  <body>
  <?php if ( $success ) echo "<p>Thanks for sending your message! Will get back to you shortly.</p>" ?>
  <?php if ( !$success ) echo "<p>There was a problem sending your message. Please try again.</p>" ?>
  <p>Click your browser's Back button to return to the page.</p>
  </body>
</html>
<?php
}
?>


