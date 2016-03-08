$(function () {


    //adding custom method to the inbuilt validation collection
    $().addMethod({
        alphaValidation: function (fieldVal) {
            var alphareg = /^[a-zA-Z ]*$/;
            return $().isInvalid(alphareg, fieldVal); // this function evaluated the given value to the regex provided and will return true if error is present else it will return false
        }
    });

    //initializing the plugin with userdefined function details
    $('#test').validateForm({
        // custfunc takes an array of objects, the object will hold the values of data-attribute,error message to be displayed and the name of the userdefined function
        custFunc: [{
            attributeVal: "alpha", // value of the data-attribute
            fieldError: 'Please enter alphabets only', // the error that should appear when an error is present
            funcName: 'alphaValidation' // name of the function that has been added
        }]
    });


    //the same functionality as above, but its attached to the click event of submit btn
    $('.submit').on('click', function () {
        $('#test').validateForm({
            custFunc: [{
                attributeVal: "alpha",
                fieldError: 'Please enter alphabets only',
                funcName: 'alphaValidation'
            }]
        });
    });
});
