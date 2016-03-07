$(function () {
    $().addMethod({
        alphaValidation: function (fieldVal) {
            var alphareg = /^[a-zA-Z ]*$/;
            return $().isInvalid(alphareg, fieldVal);
        }
    });

    $('#test').validateForm({

        custFunc: [{
            attributeVal: "alpha",
            fieldError: 'Please enter alphabets only',
            funcName: 'alphaValidation'
				}]
    });


    $('.submit').on('click', function () {
        $('#test').validateForm({
            custFunc: [{
                attributeVal: "alpha",
                fieldError: 'Please enter alphabets only',
                funcName: 'alphaValidation'
            }]
        });
        console.log('done');
    });
});