/**
 * -
 *
 * -
 *
 * @author potanin
 * @date 8/10/13
 */

var Rabbit = require( '../' );

var Client = require( '../' ).createConnection({
  login: 'demo',
  password: 'demo',
  vhost: '/'
});

Client.once( 'connection.success', function() {

  return done();

  Client.defineJob( 'test-job', function TestJob( data ) {
    console.log( 'doing test-job' );
  });

  setTimeout( function() {

    Client.runJob( 'test-job', { 'message': 'hello 2!' }, function job_complete() {
      console.log( 'test job complete' );
    });

  }, 1000 )


});

Client.once( 'connection.error', function( error, data ) {
  console.log( this.event.magenta, error.message.red );
  done( error );
});
