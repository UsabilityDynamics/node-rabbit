/**
 * Basic Auto Example
 *
 * @author potanin
 * @date 8/5/13
 */

var express   = require( 'express' );
var app       = express();

app.configure( function configure() {

  this.use( express.bodyParser() );
  this.use( this.router );
  this.use( express.errorHandler() );











  // Start Service
  this.server = this.listen( 3000, '127.0.0.1' ).on( 'error', console.error );

  // Export for testing
  module.exports = this;

});