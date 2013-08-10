/**
 * Rabbit Worker
 *
 * - Define several jobs and wait.
 *
 * Set your RabbitMQ login and password as a global variable (e.g. in .bash_profile) and execute as:
 * clear && DEBUG=rabbit* RABBIT_LOGIN=$RABBIT_LOGIN RABBIT_PASSWORD=$RABBIT_PASSWORD node worker
 *
 * @author potanin
 * @date 8/10/13
 */

var Rabbit  = require( '../../' );
var Worker  = Rabbit.createConnection({ login: process.env.RABBIT_LOGIN, password: process.env.RABBIT_PASSWORD });
var async   =  require( 'async' )

// Successful worker connection.
Worker.configure( function configure( client ) {
  Rabbit.debug( 'Connected to RabbitMQ server.' );

  // Define Job One
  client.registerJob( 'test-job-one', function TestJob( data, complete ) {
    Rabbit.debug( 'Doing [%s] job.', this.type );

    // this.progress( 0.5 );

    setTimeout( function() {

      complete( null, {
        message: 'this job has been done'
      });

    }, 500 )

  });

  // Define Job Two
  client.registerJob( 'test-job-two', function TestJob( data ) {
    console.log( 'doing test-job-two' );
  });

});

// Worker connection failure.
Worker.once( 'connection.error', function( error, data ) {
  Rabbit.debug( 'Connection Error: [%s].', error.message );
});
