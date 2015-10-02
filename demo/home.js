/// <reference path="http://ajax.microsoft.com/ajax/jquery/jquery-1.7.1.js" />

(function ($)
{
    if (!$.browser.webkit && !$.browser.msie && !$.browser.mozilla && !$.browser.opera
        || $.browser.msie && parseInt($.browser.version, 10) < 7
        || $.browser.mozilla && parseInt($.browser.version, 10) < 9
        || $.browser.opera && parseInt($.browser.version, 10) < 11)
    {

        $('#browserVersionError').show();

        if ($.browser.msie)
        {
            $('#browserVersionIE').show();
        }
        if ($.browser.webkit)
        {
            $('#browserVersionChrome').show();
        }
        if ($.browser.mozilla)
        {
            $('#browserVersionMozilla').show();
        }
        if ($.browser.opera)
        {
            $('#browserVersionOpera').show();
        }
    }
})(jQuery)