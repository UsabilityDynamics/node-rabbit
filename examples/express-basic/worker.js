/**
 * Express Job Worker
 *
 * @author potanin
 * @date 8/10/13
 */
require( 'rabbit-client' ).create( 'amqp://guest:guest@localhost:5672' ).configure( function configure( error, Rabbit ) {
  this.debug( 'Connected to RabbitMQ server.' );

  this.set( 'settings.exchange', 'express-test' );

  // Define Job One
  this.registerActivity( 'login-validation', function loginValidation( data, complete ) {
    this.debug( 'Doing [%s] job.', this.type );
    complete( null, { message: 'The TestJobOne has been complete.' });
  });


});

