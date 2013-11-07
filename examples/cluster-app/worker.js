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
require( 'rabbit-client' ).create( 'amqp://guest:guest@localhost:5672' ).configure( function configure( error, Rabbit ) {
  this.debug( 'Connected to RabbitMQ server.' );

  this.set( 'settings.exchange', 'cluster-test' );

  // Define Job One
  this.registerActivity( 'test-job-one', function TestJobOne( data, complete ) {
    this.debug( 'Doing [%s] job.', this.type );

    setTimeout( function() {
      complete( null, { message: 'The TestJobOne has been complete.' });
    }, 5000 )

  });

  // Define Job Two
  this.registerActivity( 'test-job-two', function TestJobTwo( data, complete ) {
    this.debug( 'Doing [%s] job.', this.type );

    setTimeout( function() {
      complete( null, { message: 'The TestJobTwo has been complete.' });
    }, 10000 )

  });

  // Worker connection failure.
  this.once( 'connection.error', function( error, data ) {
    this.debug( 'Could not connect to %s:%s - error message: [%s].', this.get( 'settings.host' ), this.get( 'settings.port' ), error.message );
  });

});

