/*
The MIT License (MIT)

Copyright (c) 2016 rakeshprakash91

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


(function ($, window, document, undefined) {

    $(function () {
        $('form').filter(function () {
            return $(this).find("[data-formValidate]").length > 0;
        }).validateForm();
    });
    $.fn.validateForm = function (options) {
        var opts = $.extend(globalVar.def, options);
        var formElem = this;

        $(formElem).find('[' + opts.attrUsed + ']').each(function (index, elem) {
            if (opts.hideErrorOnChange) {
                $(elem).on(opts.triggerUsed, function (e) {
                    checkError(elem, opts);
                }).on('keyup', function (e) {
                    removeInlineError(elem);
                });

            } else {
                $(elem).on(opts.triggerUsed, function (e) {
                    checkError(elem, opts)
                });
            }

        });


        $('form').on('click', '.submit,input[type="submit"]', function (e) {
            $(formElem).find('[' + opts.attrUsed + ']').each(function (index, elem) {
                checkError(elem, opts);
                if (opts.url != "") {
                    getAsyncPattern(elem, opts);
                }
            });
            if ($('.errorHeader').length > 0) {
                $('.errorHeader').remove();
            }
            if ($('.successHeader').length > 0) {
                $('.successHeader').remove();
            }
            if ($('.error').length > 0) {
                var html = "<div class='errorHeader'>" + opts.errorHeaderMsg + "</div>";
            } else {
                var html = "<div class='successHeader'>" + opts.successHeaderMsg + "</div>";
            }
            $('form').before(html);

        })
        return this;
    }

    var globalVar = {
        hasError: false,
        mandatoryError: 'Please fill the ',
        fieldError: '',
        def: {
            attrUsed: 'data-formValidate',
            triggerUsed: 'blur',
            focusFirstField: false,
            hideErrorOnChange: true,
            ajaxMethod: 'get',
            url: '',
            scroll: 'true',
            custFunc: [],
            errorHeaderMsg: 'Please correct the errors in the form',
            successHeaderMsg: 'Form validation successful'
        }
    }

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
        },
        ddmmyyyy: function (elementVal) {
            var reg = /(^(((0[1-9]|1[0-9]|2[0-8])[- / .](0[1-9]|1[012]))|((29|30|31)[- / .](0[13578]|1[02]))|((29|30)[- / .](0[4,6,9]|11)))[- / .](19|[2-9][0-9])\d\d$)|(^29[- / .]02[- / .](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;
            return $().isInvalid(reg, elementVal);
        },
        /*
        (0[1-9]|[12][0-8])[-](0[1-9]|1[012]) - days: from 1 to 28 for any months
        ((29|30|31)[-](0[13578]|1[02])) - days: 29, 30, 31 for months: 1, 3, 5, 7, 8, 10, 12
  	 	(29|30)[-](0[469]|11) - days: 29, 30 for months: 4, 6, 9, 11
  	 	(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$) years that ends with 00, 04, 08, etc. are leap years
        (^29[-]02[-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$) 29-02-only for leap years
        */
        mmddyyyy: function (elementVal, elem) {
            if ($(elem).length > 0) {
                removeInlineError(elem)
            }

            elementVal = convertDate(elementVal);
            if (elementVal != undefined) {
                if (elementVal.length != 3) {
                    globalVar.fieldError = "Please enter a valid date";
                    return true;
                } else {
                    return $().validationMethods.ddmmyyyy(elementVal[1] + '/' + elementVal[0] + '/' + elementVal[2]);
                }
            } else {
                globalVar.fieldError = "Please enter a valid date";
                return true;
            }
        },
        yyyymmdd: function (elementVal, elem) {
            if ($(elem).length > 0) {
                removeInlineError(elem)
            }
            elementVal = convertDate(elementVal);
            if (elementVal != undefined) {
                if (elementVal.length != 3) {
                    globalVar.fieldError = "Please enter a valid date";
                    return true;
                } else {
                    return $().validationMethods.ddmmyyyy(elementVal[2] + '/' + elementVal[1] + '/' + elementVal[0]);
                }
            } else {
                globalVar.fieldError = "Please enter a valid date";
                return true;
            }

        },
        dateRange: function (elem) {
            var dtFmt1, dtFmt2, dt1, dt2;
            if ($(elem).is('[fromdate]')) {
                dt1 = $(elem).val();
                dtFmt1 = $(elem).attr('fromdate');
                if (dt1 != "") {
                    if (!$().validationMethods[dtFmt1](dt1, elem)) {
                        dt2 = $(elem).parents('div, section, li').next().find('[todate]').val();
                        if (dt2 != "") {
                            dtFmt2 = $(elem).parents('div, section, li').next().find('[todate]').attr('todate');
                            if (!$().validationMethods[dtFmt2](dt2, elem)) {
                                if (compareDates(dt1, dt2)) {
                                    globalVar.fieldError = "From Date cannot be greater than To Date";
                                    return true;
                                } else {
                                    $(elem).parents('div, section, li').next().find('[todate]').siblings('span').remove();
                                    return false;
                                }
                            } else {
                                $(elem).parents('div, section, li').next().find('[todate]').siblings('span').remove();
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        globalVar.fieldError = "Please enter a valid date";
                        return true;
                    }
                }
            } else if ($(elem).is('[todate]')) {
                dt1 = $(elem).val();
                dtFmt1 = $(elem).attr('todate');
                if (dt1 != "") {
                    if (!$().validationMethods[dtFmt1](dt1, elem)) {
                        dt2 = $(elem).parents('div, section, li').prev().find('[fromdate]').val();
                        if (dt2 != "") {
                            dtFmt2 = $(elem).parents('div, section, li').prev().find('[fromdate]').attr('fromdate');
                            if (!$().validationMethods[dtFmt2](dt2, elem)) {
                                if (compareDates(dt2, dt1)) {
                                    globalVar.fieldError = "To Date cannot be lesser than From Date"
                                    return true;
                                } else {
                                    $(elem).parents('div, section, li').prev().find('[fromdate]').siblings('span').remove();
                                    return false;
                                }
                            } else {
                                $(elem).parents('div, section, li').prev().find('[fromdate]').siblings('span').remove();
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        globalVar.fieldError = "Please enter a valid date";
                        return true;
                    }
                }
            }
        }
    }

    var compareDates = function (dt1, dt2) {
        dt1 = new Date(dt1);
        dt2 = new Date(dt2);
        if (dt1 > dt2) {
            return true;
        } else {
            return false;
        }
    }

    var convertDate = function (elementVal) {
        var ary;
        if (elementVal.indexOf('.') != -1) {
            ary = elementVal.split('.');
        } else if (elementVal.indexOf('/') != -1) {
            ary = elementVal.split('/');
        } else if (elementVal.indexOf('-') != -1) {
            ary = elementVal.split('-');
        }
        return ary;
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
            if ($(elem).attr('isRequired') == "true") {
                if ($(elem).next('span').length == 0) {
                    html = '<span class= "error" style = "color : red; margin-left : 10px; font-size: 12px">' + globalVar.mandatoryError + fieldName + ' field</span>';
                }
                globalVar.hasError = true;
            } else {
                return;
            }

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
            } else if (attrType == "ddmmyyyy") {
                globalVar.hasError = $().validationMethods.ddmmyyyy(elementVal);
                globalVar.fieldError = "Please enter a valid date"
            } else if (attrType == "mmddyyyy") {
                globalVar.hasError = $().validationMethods.mmddyyyy(elementVal);
                globalVar.fieldError = "Please enter a valid date"
            } else if (attrType == "yyyymmdd") {
                globalVar.hasError = $().validationMethods.yyyymmdd(elementVal);
                globalVar.fieldError = "Please enter a valid date"
            } else if (attrType == "dateRange") {
                globalVar.hasError = $().validationMethods.dateRange(elem);
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
