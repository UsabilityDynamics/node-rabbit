/**
 * Job Handler
 *
 * @source examples/basic/job-handler.js
 */
function jobHandler( req, res ) {
  this.debug( 'Starting PDF Generation job.' );

  // Receive a message from Activity Worker on the other side of the world.
  this.on( 'message', function message( error, data ) {
    this.debug( 'PDF Generation job complete in [s].', this.time );
    console.log( 'Job Message: [%s]', error ? error.message : data.message );
  });

  // Completion event - could be an error
  this.on( 'complete', function complete( error, data ) {
    this.debug( 'PDF Generation job complete in [s].', this.time );
    console[ error ? 'error' : 'log' ]( error || data );
  });

}

client.processJob( 'api/generate-pdf:v1', {
  name: "My Invoice",
  template: "invoice",
  amount: 50
}, jobHandler );