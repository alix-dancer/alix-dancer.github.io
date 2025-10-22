(function () {
    emailjs.init({
        publicKey: "7PaMgWM1gh0qKdYt_"
    });
})();

(function ($) {

    const $form = $('#contact-form');
    const $success = $('#success-message');
    const $error = $('#error-message');

    $form.on('submit', function (e) {
        e.preventDefault();

        // Hide previous messages
        $success.hide();
        $error.hide();

        emailjs.sendForm('service_32jfjod', 'template_rkyt10l', this)
            .then(() => {
                $form[0].reset();
                $success.fadeIn(400).delay(4000).fadeOut(600); // fade out automatically after 4s
            })
            .catch((err) => {
                console.error('FAILED...', err);
                $error.fadeIn(400).delay(4000).fadeOut(600);
            });
    });

})(jQuery);