<?php

Class Captcha {

	public function verify($code) {
		$url = 'https://www.google.com/recaptcha/api/siteverify';
		$data = array(
				'secret' => '6LeY8hsTAAAAANLX7hO4xDZVD8GB1lbX_7q7xtKk',
				'response' => $code,
				'remoteip' => $_SERVER['REMOTE_ADDR']
		);

// use key 'http' even if you send the request to https://...
		$options = array(
				'http' => array(
						'header' => "Content-type: application/x-www-form-urlencoded\r\n",
						'method' => 'POST',
						'content' => http_build_query($data)
				)
		);
		$context = stream_context_create($options);
		$result = file_get_contents($url, false, $context);
		if ($result === false) {
			return false;
		}

		return json_decode($result);
	}

}
