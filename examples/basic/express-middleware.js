/**
 * Instantiate Express
 *
 * @source examples/basic/express-middleware.js
 * @type {*|configure|app}
 */
var app = require( 'express' ).call().configure( function() {

  // Create Rabbit Client instance
  var client = require( 'rabbit-client' ).create( 'amqp://user:password@localhost:11300/my-vhost' );

  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.logger() );
  app.use( express.static( 'public' ) );

  // Add Rabbit Client task handlers as middleware.
  app.use( '/api/generate-pdf', client.processJob( 'api/generate-pdf:v1' ) );
  app.use( '/api/validate-key', client.processJob( 'api/validate-key:v2' ) );
  app.use( '/api/analyze-site', client.processJob( 'api/analyze-site:v1' ) );

  app.use( app.router );
  app.use( express.errorHandler() );

  app.listen( 3000 );

  module.exports = this;

});