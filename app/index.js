var dom = require('domquery');
var domready = require('domready');
var forEach = Array.prototype.forEach;

var getFormData = function( form ){
    var form_data = {};
    forEach.call( form.elements, function( el, i ){
        switch( el.tagName ){
            case 'INPUT':
            case 'TEXTAREA':
            case 'SELECT':
                form_data[el.name] = el.value;
            break;
        }
    });
    return form_data;
};

domready( function(){
    var $form = dom('#configuration');
    $form.on( 'submit', function( event ){
        event.preventDefault();
        var form_data = getFormData( $form[0] );
        console.log( 'form_data', form_data );
    });
});
