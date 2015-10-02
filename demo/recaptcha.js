(function ()
{
    window.captchaIds = [];
    window.initReCAPTCHA = function ()
    {
        var captchas = document.querySelectorAll('.g-recaptcha');
        for (var i = 0; i < captchas.length; i++)
        {
            var captcha = captchas[i];
            var widgetId = grecaptcha.render(captcha.id, { 'sitekey': captcha.getAttribute('data-sitekey') });
            captcha.setAttribute('data-widget-id', widgetId);
        }

        window.setValidationGroupForReCAPTCHA = function ()
        {
            var captchas = document.querySelectorAll('.g-recaptcha');
            for (var i = 0; i < captchas.length; i++)
            {
                var captcha = captchas[i];
                var response = captcha.querySelector('.g-recaptcha-response');
                if (response !== null && captcha.getAttribute('data-validation-group') !== null)
                {
                    response.setAttribute('data-validation-group', captcha.getAttribute('data-validation-group'));
                }
            }
        }
    }
})();