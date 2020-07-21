<?php

error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host       = 'ssl://smtp.yandex.ru';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'technograd.moscow.planb@yandex.ru';
    $mail->Password   = 'huj2ov4f';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 465;

    $mail->setFrom('technograd.moscow.planb@yandex.ru', 'План Б');
    $mail->addAddress('ivanov.vladimir.v@yandex.ru');

    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Заявка с сайта';
    $mail->Body    = 'Проверка <b>сообщения</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}


?>