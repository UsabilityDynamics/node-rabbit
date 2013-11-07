/**
 * Module dependencies.
 */
var express = require( 'express' );
var rabbit = require( 'rabbit-client' );
var request = require( 'request' );
var path = require( 'path' );
var routes = require( './routes' );
var api = require( './routes/api' );
var user = require( './routes/user' );
var app = express();

// Start Server
app.listen( process.env.PORT || 3000 , process.env.HOSTNAME || '0.0.0.0', function() {

  app.set( 'hostname', this.address().address );
  app.set( 'port', this.address().port );
  app.set( 'views', path.join( __dirname, 'views' ) );
  app.set( 'view engine', 'jade' );
  app.use( express.favicon() );
  app.use( express.logger( 'dev' ) );
  app.use( express.json() );
  app.use( express.urlencoded() );
  app.use( express.methodOverride() );
  app.use( app.router );
  app.use( express.static( path.join( __dirname, 'public' ) ) );
  app.use( express.errorHandler() );
  app.get( '/', routes.index );
  app.get( '/users', user.list );

  // Expose
  module.exports = this;

  // Send test request
  // request.get({ url: 'http://localhost:3000/api/generate-key?site=terminallance.com' }, function( error, res, body ) { console.log( 'body', body ); });

});

// Start Service
rabbit.create( function Client( error ) {
  // console.log( 'Rabbit Client started on an Express server listening on port %s:%s.', app.get( 'hostname' ), app.get( 'port' ) );

  // Configure
  this.set( 'settings.url', 'amqp://guest:guest@localhost:5672' );
  this.set( 'settings.exchange', 'example' );

  this.configure( function() {
    this.debug( 'Connected to [%s] exchange; adding jobs to routes.', this.get( 'exchange.name' ) );

    // Add new Routes
    app.get( '/user/validation', user.validate );
    app.get( '/api/generate-key', api.generate.key );

    // Add Rabbit Client to Application
    app.startActivity = this.startActivity.bind( this );;

  });

});
