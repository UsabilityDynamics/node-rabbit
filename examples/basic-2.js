var Rabbit = require( '../' );

var rabbit = Rabbit.createConnection({
  host         : 'localhost',
  port         : 5672,
  login        : 'udx',
  password     : 'ISM0Rules'
});

rabbit.on( '**', function( data ) {
  console.log( rabbit.event + ':', data );
});



rabbit.on( 'online', function( data ) {


 rabbit.work( 'user', function( data ) {

   console.log( data );

 });


});