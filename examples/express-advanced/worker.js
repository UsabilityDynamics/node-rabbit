/**
 * Express Job Worker
 *
 * @author potanin
 * @date 8/10/13
 */
require( 'rabbit-client' ).create( function Worker( error  ) {

  // Configure
  this.set( 'settings.url', 'amqp://guest:guest@localhost:5672' );
  this.set( 'settings.exchange', 'example' );

  this.configure( function() {
    this.debug( 'Connected to [%s] exchange; registering jobs.', this.get( 'settings.vhost' ) );

    // Define Activities
    this.registerActivity( 'api/generate-key', require( './activities/generate-key' ) );
    this.registerActivity( 'user/validate', require( './activities/validate-user' ) );

  });

});

