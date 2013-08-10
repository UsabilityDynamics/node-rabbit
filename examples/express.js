/**
 * Basic Auto Example
 *
 * @author potanin
 * @date 8/5/13
 */

var express   = require( 'express' );
var Rabbit    = require( '../' );
var app = express();

app.configure( function configure() {

  this.use( express.bodyParser() );
  this.use( this.router );
  this.use( express.errorHandler() );

  this.rabbit = Rabbit.createConnection({
    host         : 'localhost',
    port         : 5672,
    login        : process.env.RABBIT_LOGIN,
    password     : process.env.RABBIT_PASSWORD
  });

  Rabbit.on( '**', function( data ) {
    console.log( this.event, data );
  });

  this.post( '/generate/user', function( req, res, next ) {
    var user = req.body.user;
    this.rabbit.run( 'validate.email', user.email, console.log );
    this.rabbit.run( 'create.account', user, console.log );
  });

  // Start Service
  this.server = this.listen( 3000, '127.0.0.1' ).on( 'error', console.error );

  // Export for testing
  module.exports = this;

});