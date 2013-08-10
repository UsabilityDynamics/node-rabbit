/**
 * Rabbit Worker
 *
 * - Define several jobs and wait.
 *
 * Set your RabbitMQ login and password as a global variable (e.g. in .bash_profile) and execute as:
 * clear && DEBUG=rabbit* node worker.js
 *
 * @author potanin
 * @date 8/10/13
 */

var Rabbit  = require( '../../' );

// Create Connection
var Worker  = Rabbit.createConnection({
  host: process.env.RABBIT_HOST,
  port: process.env.RABBIT_PORT,
  login: process.env.RABBIT_LOGIN,
  password: process.env.RABBIT_PASSWORD
});

// Successful worker connection.
Worker.configure( function configure( client ) {
  Rabbit.debug( 'Connected to RabbitMQ server.' );

  // Define Job One
  client.registerJob( 'test-job-one', function TestJobOne( data, complete ) {
    Rabbit.Job.debug( 'Doing [%s] job.', this.type );

    setTimeout( function() {
      complete( null, { message: 'The TestJobOne has been complete.' });
    }, 5000 )

  });

  // Define Job Two
  client.registerJob( 'test-job-two', function TestJobTwo( data, complete ) {
    Rabbit.Job.debug( 'Doing [%s] job.', this.type );

    setTimeout( function() {

      // Logic for test-job-two goes here, call "complete" method when done with error/null, and response message

      complete( null, { message: 'The TestJobTwo has been complete.' });

    }, 10000 )

  });

});

// Worker connection failure.
Worker.once( 'connection.error', function( error, data ) {
  Rabbit.debug( 'Could not connect to %s:%s - error message: [%s].', this.get( 'settings.host' ), this.get( 'settings.port' ), error.message );
});
