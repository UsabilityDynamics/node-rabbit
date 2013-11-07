/**
 * Express Job Worker
 *
 * @author potanin
 * @date 8/10/13
 */
require( 'rabbit-client' ).create( 'amqp://guest:guest@localhost:5672' ).configure( function configure( error, Rabbit ) {
  this.debug( 'Connected to RabbitMQ server, registering jobs.' );

  this.set( 'settings.exchange', 'express-test' );

  // Define Jobs
  this.registerActivity( 'api/generate-key', require( './activities/generate-key' ) );
  this.registerActivity( 'user/validate', require( './activities/validate-user' ) );

});

