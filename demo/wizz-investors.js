$(document).ready(function ()
{
    wizzDesign.ipoDocuments = (function ()
    {
        var $ipo = $('.ipo-documents');
        var $continue = $ipo.find('#continue');

        var goToStep = function (page)
        {
            $('.step').hide();
            $('#' + page).show();
        };

        var handleGatekeeper = function ()
        {
            if ($.cookie('GatekeeperCookie') !== undefined)
            {
                if ($('.createGatekeeperCookie').length)
                {
                    window.location.href = $('.createGatekeeperCookie').attr('href');
                }
            } else
            {
                $('.createGatekeeperCookie').click(function ()
                {
                    $.cookie('GatekeeperCookie', '1', { expires: 365, path: '/' });
                });
            }
        };

        var init = function ()
        {
            handleGatekeeper();

            $continue.click(function ()
            {
                var valid = $('body').wizzValidation('execute', $(this).attr('data-validation-group'));
                if (valid)
                {
                    var allowed = true;
                    $('#country, #country-current').each(function ()
                    {
                        var exceptions = $(this).data('validation-exceptions').split(',');
                        if (allowed && $.inArray($(this).val(), exceptions) > -1)
                        {
                            allowed = false;
                        }
                    });

                    var step;
                    if (allowed)
                    {
                        if ($continue.data('step-next'))
                        {
                            step = $continue.data('step-next');
                        } else
                        {
                            step = 'step2';
                        }
                    } else
                    {
                        if ($continue.data('step-error'))
                        {
                            step = $continue.data('step-error');
                        } else
                        {
                            step = 'step0';
                        }
                    }

                    goToStep(step);
                }
            });

            $ipo.find('.button-continue').click(function (event)
            {
                event.preventDefault();
                goToStep($(this).attr('data-step-next'));
            });

            $ipo.find('.button-cancel').click(function (event)
            {
                event.preventDefault();
                goToStep('step0');
            });

            $ipo.find('#btnAgreeDisclaimer').click(function (event)
            {
                goToStep('step4');
            });
        };

        return {
            init: init
        }
    })();

    if ($('.ipo-documents').length)
    {
        wizzDesign.ipoDocuments.init();
    }
});