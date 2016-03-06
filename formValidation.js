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
            ajaxMethod: 'get',
            url: '',
            scroll: 'true',
            custFunc: []
        }
        opts = $.extend(def, options);
        var formElem = this;

        $(formElem).find('input').each(function (index, elem) {
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


        $('form').on('click', '.submit', function (e) {
            $(formElem).find('input').each(function (index, elem) {
                e.stopImmediatePropagation();
				checkError(elem, opts);
                if (opts.url != "") {
                    getAsyncPattern(elem, opts);
                }
            });
        })
        return this;
    }

    var globalVar = {
        hasError: false,
        mandatoryError: 'Please fill the ',
        fieldError: ''
    }

    $.fn.addMethod = function (option) {
        $.extend($().validationMethods, option);
        return this;
    }

    $.fn.validationMethods = {
        emailValidation: function (elementVal) {
            var emailreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailreg.test(elementVal)) {
                return true;
            } else {
                return false;
            }
        },
        passwordValidation: function (elementVal) {
            var passwdreg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
			if (!passwdreg.test(elementVal)) {
                return true;
            } else {
                return false;
            }
        },
        numberValidation: function (elementVal) {
            var numreg = /^\d+$/;
			if (!numreg.test(elementVal)) {
                return true;
            } else {
                return false;
            }
        },
        telephone: function(elementVal){
            if(!$().validationMethods['numberValidation'](elementVal) && elementVal.length == 10){
                return false;
            }else{
                return true;
            }
        },
       /* alphanumeric:function(elementVal){
            var alphanumreg = /^[0-9] [a-zA-Z]+$/;
            if(!alphanumreg.test(elementVal)){
                return true;
            }else{
                return false;
            }
        }*/
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
                globalVar.hasError = $().validationMethods.passwordValidation(elementVal);
                globalVar.fieldError = "Password should contain atleast 6 characters,  1 lowercase, 1 uppercase and 1 number";

            } else if (attrType == "email") {
                globalVar.hasError = $().validationMethods.emailValidation(elementVal);
                globalVar.fieldError = "Please enter a valide email";

            } else if (attrType == "number") {
                globalVar.hasError = $().validationMethods.numberValidation(elementVal);
                globalVar.fieldError = "Please enter numbers only";
            } else if (attrType == "telephone") {
                globalVar.hasError = $().validationMethods.telephone(elementVal);
                globalVar.fieldError = "Please enter 10 digit number";
            } else if(attrType == "alphanumeric"){
                globalVar.hasError = $().validationMethods.alphanumeric(elementVal);
                globalVar.fieldError = "Please enter only alphabets and numbers";
            }
  
            if (opts.custFunc.length > 0) {
				for(var i = 0; i < opts.custFunc.length; i++){
					if(opts.custFunc[i].attributeVal == attrType){
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


    /*var getAsyncPattern = function (elem, opts) {
        $.ajax({
            data: {},
            method: opts.ajaxMethod,
            url: opts.url,
            success: function (result) {
                //whatever needs to be done with the result
            },
            error: function (e) {
                //handle the error / display the error message if present
            }
        });
    }*/
})(jQuery)
