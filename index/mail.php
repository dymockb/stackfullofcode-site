<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader

require '../../vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'dymockbrett.co.uk';                    //Set the SMTP server to send through 'smtp.example.com'
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'no-reply@dymockbrett.co.uk';           //SMTP username
    $mail->Password   = 'Tgyhu678!';                            //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('no-reply@dymockbrett.co.uk', 'Dymock Brett');
    $mail->addAddress($_REQUEST['email']);   //Add a recipient
    //$mail->addAddress('dymockb@gmail.com', 'DB');     				//Add a recipient
    //$mail->addAddress('ellen@example.com');               		//Name is optional
    //$mail->addReplyTo('info@example.com', 'Information');
    //$mail->addCC('cc@example.com');
    $mail->addBCC('dymockb@gmail.com');

    //Attachments
    //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Reply from Dymock Brett';
    $mail->Body    = 'Hi ' . $_REQUEST['name'] . '.  Thanks for your message - a copy is below: <br><br>' . $_REQUEST['message'];
    //$mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    $mail->AltBody = $_REQUEST['message'];
    
		$mail->send();
    echo json_encode('Message has been sent');
} catch (Exception $e) {
    echo json_encode("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
}