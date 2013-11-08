/**
 * Connecting Example
 *
 * @author potanin
 * @date 8/5/13
 */
var express = require( 'express' );
var app = require( 'express' )();
var rabbit = require( 'rabbit-client' );

app.configure( function() {

  var app = module.exports = this;

  // console.log( require( 'util' ).inspect( arguments, { showHidden: true, colors: true, depth: 2 } ) )
  // this.rabbit.on( '**', function( data ) { console.log( this.event, data ); });

  // Start Service
  rabbit.create( 'amqp://guest:guest@localhost:5672' ).configure( function configure( client, Rabbit ) {
    this.debug( 'Rabbit Client ready, adding worker routes. ');

    // Add routes only when Client is ready
    app.get( '/login-validation', function( req, res, next ) {
      client.debug( 'Have job request for login-validation... Sending job request.');

      client.processJob( 'login-validation', card(), function job_complete() {
        this.debug( 'Sending job [%s] #[%d] to [%s] exchange.', this.job_type, count, client.get( 'settings.vhost' ) );

        this.on( 'progress', function( value ) {
          this.debug( 'test-job-one progress update', value );
        });

        this.on( 'complete', function( message ) {
          this.debug( 'test-job-one complete', message );
        });

      });

    });

  });

  app.use( express.logger() );
  app.use( express.compress() );
  app.use( express.methodOverride() );
  app.use( express.bodyParser() );
  app.use( app.router );

  // app.use( '/secure', connect.basicAuth( function( user, pass, fn ) { User.authenticate({ user: user, pass: pass }, fn); }));


  app.use( '/', function( req, res, next ) {
    res.send( 'asdf' );
  });

  app.on( 'error', console.error );

}).listen( 3000, '127.0.0.1' );