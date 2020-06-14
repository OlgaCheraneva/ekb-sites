<?php

$method = $_SERVER['REQUEST_METHOD'];

if ( $method === 'POST' ) {
	$form_subject = trim($_POST["form_subject"]);

	foreach ( $_POST as $key => $value ) {
		if ( $value != "" && $key != "form_subject" ) {
			$message .= "<b>".$key."</b> ".$value."%0A";
		}
	}
	
	$token = "1176307202:AAFMfmvNmFVi2wy2A-2NsIjmgxgtPypsGT4";
	$chat_id = "-327278816";
	
	$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$message}", "r");

	if (!$sendToTelegram) {
		http_response_code(500);
	}
	
	HttpResponse::send();
}
