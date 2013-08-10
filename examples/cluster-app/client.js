/**
 * Rabbit Client
 *
 * - Process jobs.
 *
 * Set your RabbitMQ host, port, login and password as environmental variables (e.g. in .bash_profile) and execute, or
 * add inline as seen with the port variable below:
 *
 * $ RABBIT_PORT=5672 DEBUG=rabbit* node client.js
 *
 * @author potanin
 * @date 8/10/13
 */

var Rabbit  = require( '../../' );

// Create Connection.
var Client  = Rabbit.createConnection({
  host: process.env.RABBIT_HOST,
  port: process.env.RABBIT_PORT,
  login: process.env.RABBIT_LOGIN, 
  password: process.env.RABBIT_PASSWORD 
});

var card    =  require( 'faker' ).Helpers.createCard
var async   =  require( 'async' )

// Successful client connection.
Client.configure( function configure( client ) {
  Rabbit.debug( 'Connected to RabbitMQ server.' );

  async.times( 10, function( count ) {

    client.runJob( 'test-job-one', card(), function job_complete() {
      Rabbit.debug( 'Sending job [%s] #[%d] to [%s] exchange.', this.job_type, count, client.get( 'exchange.name' ) );

      this.on( 'progress', function( value ) {
        Rabbit.debug( 'test-job-one progress update', value );
      });

      this.on( 'complete', function( message ) {
        Rabbit.debug( 'test-job-one complete', message );
      });

    });

    client.runJob( 'test-job-two', card(), function job_complete() {
      Rabbit.debug( 'A "test-job-two" work request sent.' );

      this.on( 'complete', function( message ) {
        Rabbit.debug( 'test-job-two complete', message );
      });

    });

  });

});

// Client connection failure.
Client.once( 'connection.error', function( error, data ) {
  Rabbit.debug( 'Connection Error: [%s].', error.message );
});
