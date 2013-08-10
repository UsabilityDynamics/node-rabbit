/**
 * Rabbit Client
 *
 * - Process jobs.
 *
 * Set your RabbitMQ login and password as a global variable (e.g. in .bash_profile) and execute as:
 * clear && DEBUG=rabbit RABBIT_LOGIN=$RABBIT_LOGIN RABBIT_PASSWORD=$RABBIT_PASSWORD node client.js
 *
 * @author potanin
 * @date 8/10/13
 */

var Rabbit  = require( '../../' );
var Client  = Rabbit.createConnection({ login: process.env.RABBIT_LOGIN, password: process.env.RABBIT_PASSWORD });

var card    =  require( 'faker' ).Helpers.createCard
var async   =  require( 'async' )

// Successful client connection.
Client.configure( function configure( client ) {
  Rabbit.debug( 'Connected to RabbitMQ server.' );

  // Add several "test-job-one" jobs.
  async.times( 2, function( i ) {
    Rabbit.debug( 'Sending job [%d] to [%s] exchange.', i, client.get( 'exchange.name' ) );

    client.runJob( 'test-job-one', card(), function job_complete() {
      console.log( 'test job complete' );
    });

  });

});

// Client connection failure.
Client.once( 'connection.error', function( error, data ) {
  Rabbit.debug( 'Connection Error: [%s].', error.message );
});
