<?php
	
$token = "1176307202:AAFMfmvNmFVi2wy2A-2NsIjmgxgtPypsGT4";
$chat_id = "-327278816";
$message = "You have a visitor";

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$message}", "r");

if (!$sendToTelegram) {
    http_response_code(500);
}

HttpResponse::send();
