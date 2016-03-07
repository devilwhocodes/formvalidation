(function ($, window, document, undefined) {

    $(function () {
        $('form').filter(function () {
            return $(this).find("[data-formValidate]").length > 0;
        }).validateForm();
    });

    $.fn.validateForm = function (options) {
        var opts = {};
        var def = {
            attrUsed: 'data-formValidate',
            triggerUsed: 'blur',
            focusFirstField: false,
            hideErrorOnChange: true,
            scroll: 'true',
            custFunc: []
        }
        opts = $.extend(def, options);
        var formElem = this;

        $(formElem).find('[' + opts.attrUsed + ']').each(function (index, elem) {
            if (opts.hideErrorOnChange) {
                $(elem).on(opts.triggerUsed, function (e) {
                    e.stopImmediatePropagation();
                    checkError(elem, opts);
                }).on('keyup', function (e) {
                    e.stopImmediatePropagation();
                    removeInlineError(elem);
                });

            } else {
                $(elem).on(opts.triggerUsed, function (e) {
                    e.stopImmediatePropagation();
                    checkError(elem, opts)
                });
            }

        });


        $('form').on('click', '.submit,input[type="submit"]', function (e) {
            $(formElem).find('[' + opts.attrUsed + ']').each(function (index, elem) {
                e.stopImmediatePropagation();
                checkError(elem, opts);
            });
        })
        return this;
    }

    var globalVar = {
        hasError: false,
        mandatoryError: 'Please fill the ',
        fieldError: ''
    }

    $.extend({
        validateForm: $().validateForm()
    });

    $.fn.addMethod = function (option) {
        $.extend($().validationMethods, option);
        return this;
    }

    $.fn.validationMethods = {
        email: function (elementVal) {
            var emailreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return $().isInvalid(emailreg, elementVal);
        },
        password: function (elementVal) {
            var passwdreg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
            return $().isInvalid(passwdreg, elementVal);
        },
        number: function (elementVal) {
            var numreg = /^\d+$/;
            return $().isInvalid(numreg, elementVal);
        },
        telephone: function (elementVal) {
            if (!$().validationMethods['number'](elementVal) && elementVal.length == 10) {
                return false;
            } else {
                return true;
            }
        },
        alphaNumeric: function (elementVal) {
            var alphanumreg = /^[a-z0-9]+$/i;
            return $().isInvalid(alphaNumeric, elementVal);
        },
        alphaNumericWithSpecialChar: function (elementVal) {
            var reg = /^[\w\-\s]+$/;
            return $().isInvalid(alphaNumericWithSpecialChar, elementVal);
        },
        address: function (elementVal) {
            var addreg = /^[A-Za-z0-9'\.\-\s\,]+$/;
            return $().isInvalid(address, elementVal);
        },
        zipcode: function (elementVal) {
            if (!$().validationMethods.number(elementVal) && elementVal.length == 6) {
                return false;
            } else {
                return true;
            }
        },
        url: function (elementVal) {
            var urlreg = /^(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
            return $().isInvalid(urlreg, elementVal);
        }

    }

    $.fn.isInvalid = function (reg, val) {
        if (!reg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    var removeInlineError = function (elem) {
        $(elem).siblings('span').remove();
        globalVar.fieldError = '';
    }

    var checkError = function (elem, opts) {
        var elementVal = $(elem).val().trim();
        var fieldName = $(elem).prev('label').text();
        var html = '';
        var attrType = $(elem).attr(opts.attrUsed);

        if (elementVal == "") {
            if ($(elem).next('span').length == 0) {
                html = '<span class= "error" style = "color : red; margin-left : 10px; font-size: 12px">' + globalVar.mandatoryError + fieldName + ' field</span>';
            }
            globalVar.hasError = true;
        } else if (elementVal != "") {
            removeInlineError(elem);
            if (attrType == "password") {
                globalVar.hasError = $().validationMethods.password(elementVal);
                globalVar.fieldError = "Password should contain atleast 6 characters,  1 lowercase, 1 uppercase and 1 number";

            } else if (attrType == "email") {
                globalVar.hasError = $().validationMethods.email(elementVal);
                globalVar.fieldError = "Please enter a valide email";

            } else if (attrType == "number") {
                globalVar.hasError = $().validationMethods.number(elementVal);
                globalVar.fieldError = "Please enter numbers only";
            } else if (attrType == "telephone") {
                globalVar.hasError = $().validationMethods.telephone(elementVal);
                globalVar.fieldError = "Please enter 10 digit number";
            } else if (attrType == "alphanumeric") {
                globalVar.hasError = $().validationMethods.alphaNumeric(elementVal);
                globalVar.fieldError = "Please enter only alphabets and numbers";
            } else if (attrType == "alphaNumericWithSpecialChar") {
                globalVar.hasError = $().validationMethods.alphaNumericWithSpecialChar(elementVal);
                globalVar.fieldError = "There are errors in the field";
            } else if (attrType == "address") {
                globalVar.hasError = $().validationMethods.address(elementVal);
                globalVar.fieldError = "Please use only , . - as special characters";
            } else if (attrType == "url") {
                globalVar.hasError = $().validationMethods.url(elementVal);
                globalVar.fieldError = "Please enter a valid url";
            }

            if (opts.custFunc.length > 0) {
                for (var i = 0; i < opts.custFunc.length; i++) {
                    if (opts.custFunc[i].attributeVal == attrType) {
                        globalVar.hasError = $().validationMethods[opts.custFunc[i].funcName](elementVal);
                        globalVar.fieldError = opts.custFunc[i].fieldError;
                    }
                }
            }

            if (globalVar.hasError) {
                html = '<span class = "error" style = "color : red; margin-left : 10px; font-size : 12px"> ' + globalVar.fieldError + ' </span>';

            } else {
                removeInlineError(elem);
            }
        }
        if (html != "") {
            $(elem).after(html);
        }

        if (globalVar.hasError) {
            if (opts.focusFirstField) {
                $('.error:first').siblings('input').focus();
            }

            var elPos = $('.error:first').siblings('input').position().top - 20;
            if (opts.scroll) {
                $('html, body').animate({
                    scrollTop: elPos
                }, 500);
            }
        }

    }
})(jQuery)