var User   = require( 'faker' ).Helpers.userCard();

var Client = require( 'rabbit-client' ).create( function Client() {

  // Monitor all events.
  this.on( '**', function( error, data ) {
    console.log( this.event + ':', error, typeof data );
  });

});

Client.configure( function configure( client ) {
  client.log( 'Connected to [%s]', client.get( 'settings.url' ) );

  client.processJob( 'user', User, console.log );

  setInterval(function() {}, 1000 );

});



/*
 Where was this going?

 rabbit.define('samplejob', function sampleJobWorker( data, response ) {
 console.log( 'job recieved:', data );
 });
*/
