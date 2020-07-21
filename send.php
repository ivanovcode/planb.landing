<?php
/*ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);*/

error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }
    if (!is_dir($dir)) {
        return unlink($dir);
    }
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }

    }
    return rmdir($dir);
}

try {
    require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
    require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

    require_once __DIR__ . '/vendor/phpoffice/phpexcel/Classes/PHPExcel.php';
    require_once __DIR__ . '/vendor/phpoffice/phpexcel/Classes/PHPExcel/IOFactory.php';

    $fileBase = __DIR__ . '/uploads/' . date("m.d.y") . '.xlsx';
    $uuid = md5(uniqid(rand(),1));

    if (!isset($_COOKIE["uuid"])) {
        setcookie("uuid", $uuid,time()+86400);
    } else {
        $uuid = $_COOKIE["uuid"];
    }

    $filesDir = __DIR__ . '/uploads/' . $uuid . '/';

    if (is_dir($filesDir)) {
        deleteDirectory($filesDir);
    }

    if (!is_dir($filesDir)) {
        mkdir($filesDir);
    }

    foreach ($_FILES["files"]["error"] as $key => $error) {
        if ($error == UPLOAD_ERR_OK) {
            $fileName = $_POST['filenames'][$key] . '_' . $_FILES["files"]["name"][$key];
            move_uploaded_file( $_FILES["files"]["tmp_name"][$key], $filesDir . $fileName);
        }
    }

    if (!file_exists($fileBase)) {
        $objPHPExcel = new PHPExcel();
    } else {
        $objPHPExcel = PHPExcel_IOFactory::load($fileBase);
    }

    $objPHPExcel->setActiveSheetIndex(0);
    $row = $objPHPExcel->getActiveSheet()->getHighestRow()+1;

    $objPHPExcel->getActiveSheet()->setCellValueExplicit('A'.$row, date("Y-m-d H:i:s"),PHPExcel_Cell_DataType::TYPE_STRING);
    $objPHPExcel->getActiveSheet()->setCellValueExplicit('B'.$row, $_POST['fio'],PHPExcel_Cell_DataType::TYPE_STRING);
    $objPHPExcel->getActiveSheet()->setCellValueExplicit('C'.$row, $_POST['phone'],PHPExcel_Cell_DataType::TYPE_STRING);
    $objPHPExcel->getActiveSheet()->setCellValueExplicit('D'.$row, $_POST['email'],PHPExcel_Cell_DataType::TYPE_STRING);
    $objPHPExcel->getActiveSheet()->setCellValueExplicit('E'.$row, $_POST['segment'],PHPExcel_Cell_DataType::TYPE_STRING);
    $objPHPExcel->getActiveSheet()->setCellValueExplicit('F'.$row, $_POST['inn'],PHPExcel_Cell_DataType::TYPE_STRING);
    $objPHPExcel->getActiveSheet()->setCellValueExplicit('G'.$row, $_POST['report'],PHPExcel_Cell_DataType::TYPE_STRING);
    $objPHPExcel->getActiveSheet()->setCellValueExplicit('H'.$row, $uuid,PHPExcel_Cell_DataType::TYPE_STRING);

    $objWriter = new PHPExcel_Writer_Excel2007($objPHPExcel);
    $objWriter->save($fileBase);

    print_r(array('success' => true), true);
} catch (Exception $e) {
    print_r(array('success' => false), true);
}

try {
    $mail = new PHPMailer(true);

    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host       = 'ssl://smtp.yandex.ru';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'technograd.moscow.planb@yandex.ru';
    $mail->Password   = 'huj2ov4f';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 465;

    $mail->setFrom('technograd.moscow.planb@yandex.ru', 'План Б');
    $mail->addAddress($_POST['email']);

    $htmlContent = ' 
    <html> 
    <head> 
        <title>Ваша заявка будет рассмотрена в ближайшее время!</title> 
    </head> 
    <body> 
        <h1>Ваша заявка будет рассмотрена в ближайшее время!</h1> 
        <p>В заявке вы указали следующие данные:</p>
        <table cellspacing="0" style="border: 2px dashed #FB4314; width: 100%;"> 
            <tr> 
                <th>ФИО:</th><td>'.$_POST['fio'].'</td> 
            </tr> 
            <tr> 
                <th>Телефон:</th><td>'.$_POST['phone'].'</td> 
            </tr> 
            <tr> 
                <th>Email:</th><td>'.$_POST['email'].'</td> 
            </tr>        
            <tr> 
                <th>Выбранный сегмент:</th><td>'.$_POST['segment'].'</td> 
            </tr> 
            <tr> 
                <th>ИНН вашей организации:</th><td>'.$_POST['inn'].'</td> 
            </tr>                          
        </table> 
        <p>А так же приложили к заявке файлы годовых отчетов с суммами, анкету и презентацию.</p><br>
        <p>Дополнительную информацию Вам предоставит наш менеджер по контактам указанным в заявке.</p>
        <p>Спасибо за обращение!</p>
    </body> 
    </html>';

    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Вы оставили заявку на нашем сайте.';
    $mail->Body  =  $htmlContent;
    $mail->send();

} catch (Exception $e) { }

?>