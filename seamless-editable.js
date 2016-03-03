/**
 * Created by animesh on 2/9/16.
 */

(function ( $ ) {
    $.fn.seamlessEditable = function(options) {
        var settings = $.extend({
            // These are the defaults.
            placeholder: '',
            maxlength: 0,
            toolTipTitle: '',
            toolTipPlacement: 'right',
            toolTipTrigger: 'click | hover | manual',
            methodname: ''
        }, options );

        settings.lastsaveditemname = $(this).val();

        if ($('.seamless-editable-dummy-container').length === 0) {
            $('body').prepend('<span class="seamless-editable-dummy-container"></span>');
        }
        synchSeamlessEditable(this, $(this).val());

        if (settings.placeholder != '') {
            $(this).attr("placeholder", settings.placeholder);
        }

        if (settings.maxlength > 0) {
            $(this).attr('maxlength', settings.maxlength);
        }

        if (settings.toolTipTitle != '') {
            $(this).tooltip({
                title: settings.toolTipTitle,
                trigger: settings.toolTipTrigger,
                placement: settings.toolTipPlacement
            });
        }


        return $(this).hover(
            function() {
                $(this).toggleClass("bc-transparent bc-ccc");
            }
        )
            .change(function() {
                if ($(this).val() == '' || $(this).data('escapepressed')) {
                    $(this).val(settings.lastsaveditemname);
                    synchSeamlessEditable(this, $(this).val());
                    event.stopPropagation();
                    return false;
                }
                settings.lastsaveditemname = $(this).val();
                var url = '/a/sle?methodname=' + settings.methodname + '&itemname=' + $(this).val();
                $.ajax({
                    url: url
                });
            })
            .click(function() {
                $(this).data('escapepressed', false);
                synchSeamlessEditable(this, $(this).val());
            })
            .keypress(function(e) {
                var keyCode = e.which || e.keyCode;
                if ((keyCode && e.charCode) || keyCode === 13) {
                    if (keyCode === 13) {
                        $(this).blur();
                        return false;
                    } else {
                        var c = String.fromCharCode(e.keyCode | e.charCode);
                        var selectionStartPos = this.selectionStart;
                        var selectionEndPos = this.selectionEnd;
                        var startSubStr = $(this).val().substr(0, selectionStartPos);
                        var endSubStr = $(this).val().substr(selectionEndPos, $(this).val().length);
                        synchSeamlessEditable(this, startSubStr + c + endSubStr);
                    }
                }
            })
            .keyup(function(e) {
                var keyCode = e.which || e.keyCode;
                if (keyCode === 8 || keyCode === 46) {
                    synchSeamlessEditable(this, $(this).val());
                }
            })
            .keydown(function(e) {
                var keyCode = e.which || e.keyCode;
                if (keyCode === 8 || keyCode === 46 || keyCode === 27) {
                    synchSeamlessEditable(this, $(this).val());
                }
                if (keyCode === 27) {
                    $(this).data('escapepressed', true);
                    $(this).blur();
                    return false;
                }
            });

        function synchSeamlessEditable(obj, text) {
            if (!text && $(obj).attr('placeholder')) {
                text = $(obj).attr('placeholder').trim();
            }
            var maxlength = $(obj).attr('maxlength');
            if (maxlength != undefined && maxlength > 0 && text.length > maxlength) {
                return false;
            }
            $('.seamless-editable-dummy-container').text(text);
            $('.seamless-editable-dummy-container').css({
                'font-size': $(obj).css('font-size'),
                'font-family': $(obj).css('font-family'),
                'font-weight': $(obj).css('font-weight'),
                'line-height': $(obj).css('line-height'),
                'padding-top': $(obj).css('padding-top'),
                'padding-right': $(obj).css('padding-right'),
                'padding-bottom': $(obj).css('padding-bottom'),
                'padding-left': $(obj).css('padding-left'),
                'max-width': $(obj).css('max-width')
            });
            $(obj).width($('.seamless-editable-dummy-container').width() + 5);
            if (typeof window[settings.postKeyPressFunction] == 'function') {
                settings.text = text;
                eval(settings.postKeyPressFunction+'(settings)');
            }
        }
    };
}( jQuery ));

