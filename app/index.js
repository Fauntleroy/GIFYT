const DOWNLOADS_PATH = process.cwd() +'app/downloads/';
const GIFS_PATH = process.cwd() +'app/gifs/';
const GIF_DEFAULTS = {
    width: 300,
    rate: 12
};
console.log( 'cwd', process.cwd() );
console.log( 'DP', DOWNLOADS_PATH );
var fs = nequire('fs');
var ytdl = nequire('ytdl');
var gify = nequire('gify');

var _ = require('underscore');
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
        var youtube_stream = ytdl( form_data.url, {
            filter: function( format ){
                return format.container === 'mp4';
            }
        });
        console.log(DOWNLOADS_PATH +'video.mp4');
        var video_destination_stream = fs.createWriteStream( DOWNLOADS_PATH +'video.mp4');
        youtube_stream
            .pipe( video_destination_stream )
            .on( 'finish', function(){
                console.log('youtube download finished');
                var gif_options = {
                    width: form_data.width || undefined,
                    rate: form_data.framerate || undefined,
                    start: form_data.start || undefined,
                    duration: form_data.end - form_data.start
                };
                gif_options = _.defaults( gif_options, GIF_DEFAULTS );
                gify( DOWNLOADS_PATH +'video.mp4', GIFS_PATH +'video.gif', gif_options, function( err ){
                    if( err ){
                        console.log( 'error converting to GIF', err );
                    }
                    else {
                        console.log( 'video converted to GIF' );
                    }
                });
            });
        console.log( 'form_data', form_data );
    });
});
