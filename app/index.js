var dom = require('domquery');
var domready = require('domready');

domready( function(){
    var $form = dom('#configuration');

    $form.on( 'submit', function( event ){
        event.preventDefault();
        console.log( arguments );
    });
});
