/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * navigator menu
 */
$("#navbar ul li a[href^='#']").on('click', function (e) {

	// prevent default anchor click behavior
	e.preventDefault();

	// store hash
	var hash = this.hash;

	// animate
	$('html, body').animate({
		scrollTop: $(hash).offset().top
	}, 300, function () {

	});

});

var captchaId;
var onloadCallback = function () {
	captchaId = grecaptcha.render('captcha', {
		'sitekey': '6LeY8hsTAAAAAMZ38WI-SnyIEQoMGk1PLAErJZOK'
	});
	$refresh = $('<button/>')
					.attr('type', 'button')
					.css('padding', '2px 5px')
					.addClass('btn btn-info')
					.addClass('pull-right')
					.html($('<i/>').addClass('glyphicon glyphicon-refresh'))
					.on('click', resetCaptcha);
	$('#captcha').before($refresh);
};

var resetCaptcha = function () {
	grecaptcha.reset(captchaId);
};
$('#contact').on('shown.bs.modal', resetCaptcha);
$('#contact').on('hidden.bs.modal', function (event) {
	$('#form-error').text('').addClass('hide');
})
$('#contact [type="submit"]').click(function (event) {
	event.preventDefault();
	$('#contact form').submit();
});

$('#contact form').submit(function (event) {
	event.preventDefault();
	$('#contact [type="submit"]').html('Sending...');
	$('#contact button').addClass('disabled').attr('disabled', 'disabled');
	$form = $(this);
	$.post($form.attr('action'), $form.serialize(), function (reply) {
		$('#contact button').removeClass('disabled').removeAttr('disabled');
		$('#contact [type="submit"]').html('Send');
		console.log(reply);
		if (reply.error) {
			$('#form-error').text(reply.message).removeClass('hide');
		} else {
			$('#form-error').text('').addClass('hide');
			$('#contact').modal('hide');
			$form[0].reset();
			alertModal('Successfully Sent');
		}
	}, 'json');
});

function alertModal(text, status) {
	var title = $('<h4/>')
					.addClass('modal-title')
					.html(text);
	var close = $('<span/>')
					.addClass('glyphicon glyphicon-remove')
					.attr('aria-hidden', 'true');
	var button = $('<button/>')
					.addClass('close')
					.attr({type: 'button', 'data-dismiss': 'modal', 'aria-label': 'close'})
					.append(close);
	var header = $('<div/>')
					.addClass('modal-header alert-success')
					.append(button)
					.append(title);
	var content = $('<div/>')
					.addClass('modal-content')
					.append(header);
	var dialog = $('<div/>')
					.addClass('modal-dialog')
					.append(content);
	var modal = $('<div/>')
					.addClass('modal fade')
					.attr({tabindex: -1, role: 'dialog', 'aria-hidden': 'true'})
					.append(dialog);
	$('body').append(modal);
	$(modal).on('show.bs.modal', function () {
		var myModal = $(this);
		clearTimeout(myModal.data('hideInterval'));
		myModal.data('hideInterval', setTimeout(function () {
			myModal.modal('hide');
		}, 3000));
	});
	$(modal).on('hide.bs.modal', function () {
		$(this)[0].remove();
	});

	modal.modal();

}
