<?php
require_once('autoload.php');

if (empty($_SERVER['HTTP_REFERER'])) {
	return false;
}
$ref = preg_replace('/^https?:\/\/([^\/]+).*$/', '$1', $_SERVER['HTTP_REFERER']);

if ($ref !== $_SERVER['HTTP_HOST'] || empty($_POST)) {
	return false;
}

$response = array('error' => true, 'message' => '');

$captcha = new Captcha;

$verify = $captcha->verify($_POST['g-recaptcha-response']);

if (!$verify->success) {
	$response['message'] = 'Capcha is not valid. Please refresh and try again.';
	echo json_encode($response);
	exit;
}

// Pear Mail Library
require_once "Mail.php";
require_once "Mail/mime.php";

$from = '<cuayocps@gmail.com>';
$to = '<psolis@pcsaerospace.com>';

$post = array_map('htmlspecialchars', $_POST);

$reply_to = "{$post['name']} <{$post['email']}>";

array_walk($post, function(&$v, $k) {
	$v = sprintf('<strong>%s:</strong> %s', ucwords($k), $v);
});

$body = implode("<br/>\n", $post);

$subject = 'Contact from web UH-1H';

$headers = array(
		'From' => $reply_to,
		'To' => $to,
		'reply-to' => $reply_to,
		'Subject' => $subject,
		'Content-Type' => "text/html; charset=UTF-8"
);



$mime_params = array(
		'text_encoding' => '7bit',
		'text_charset' => 'UTF-8',
		'html_charset' => 'UTF-8',
		'head_charset' => 'UTF-8'
);

$mime = new Mail_mime();

$mime->setTXTBody(strip_tags($body));
$mime->setHTMLBody($body);

$body = $mime->get($mime_params);
$headers = $mime->headers($headers);



$smtp = Mail::factory('smtp', array(
						'host' => 'ssl://smtp.gmail.com',
						'port' => '465',
						'auth' => true,
						'username' => 'cuayocps@gmail.com',
						'password' => 'Cl4p3s3x.'
				));

$mail = $smtp->send($to, $headers, $body);

if (PEAR::isError($mail)) {
	$response['message'] = 'The E-Mail could not be sent!';
} else {
	$response['error'] = false;
}

echo json_encode($response);
