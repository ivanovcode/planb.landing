<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

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

    print_r(array('success' => true), true); die();
} catch (Exception $e) {
    print_r(array('success' => false), true); die();
}


?>