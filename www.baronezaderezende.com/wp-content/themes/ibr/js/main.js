$(document).ready(function () {
    $('.hero').slick({
        autoplay: true,
        autoplaySpeed: 3000,
    });

    $('.js-newsletter').submit(function () {
        var $form = $(this);

        $.post($form.attr('action'), $form.serialize(), function (data) {
            alert('Seu email foi cadastrado com sucesso!');
            $form[0].reset();
        }, 'json');

        return false;
    });

    $('.footer-nav .dropdown-toggle').removeAttr('href').removeClass('dropdown-toggle');
});


