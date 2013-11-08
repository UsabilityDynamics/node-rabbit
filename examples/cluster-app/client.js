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

require( 'rabbit-client' ).create( 'amqp://guest:guest@localhost:5672' ).configure( function configure() {
  this.debug( 'Starting job runners...' );

  var card    = require( 'faker' ).Helpers.createCard
  var async   = require( 'async' )
  var client  = this;

  this.set( 'settings.exchange', 'cluster-test' );

  // Successful client connection.

  async.times( 10, function( count ) {

    client.processJob( 'test-job-one', card(), function job_complete() {
      this.debug( 'Sending job [%s] #[%d] to [%s] exchange.', this.job_type, count, client.get( 'settings.vhost' ) );

      this.on( 'progress', function( value ) {
        this.debug( 'test-job-one progress update', value );
      });

      this.on( 'complete', function( message ) {
        this.debug( 'test-job-one complete', message );
      });

    });

    client.processJob( 'test-job-two', card(), function job_complete() {
      this.debug( 'A "test-job-two" work request sent.' );

      this.on( 'complete', function( message ) {
        this.debug( 'test-job-two complete', message );
      });

    });

  });


  // Client connection failure.
  this.once( 'connection.error', function( error, data ) {
  this.debug( 'Connection Error: [%s].', error.message );
  });


});