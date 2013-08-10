var Rabbit = require( '../' );
var User   = require( 'faker' ).Helpers.userCard();

var rabbit = Rabbit.createConnection({
  host         : 'localhost',
  port         : 5672,
  login        : process.env.RABBIT_LOGIN,
  password     : process.env.RABBIT_PASSWORD
});


rabbit.on( '**', function( data ) {
  console.log(rabbit.event + ':', data );
});


rabbit.on( 'online', function( data ) {


  setInterval(function() {

    rabbit.run( 'user', User, console.log );

  }, 1000 );


});




/*
 Where was this going?

 rabbit.define('samplejob', function sampleJobWorker( data, response ) {
 console.log( 'job recieved:', data );
 });
*/
