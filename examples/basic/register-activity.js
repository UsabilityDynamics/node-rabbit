/**
 * On a Worker node we define an Activity Type and a handler method to be invoked for Job Requests.
 *
 * @source examples/basic/register-activity.js
 * @params req {Object} Request object.
 * @params res {Object} Response object.
 */
require( 'rabbit-client' ).registerActivity( 'api/generate-pdf:v1', function generatePDF( req, res ) {

  // Get Header Fields
  this.debug( 'Processing PDF Generation request #[%s] for [%s].', req.get( 'job' ), req.get( 'session' ) );

  // Get a parameter. In practice, this validation should occur on the producer end.
  if( !req.param( 'name' ) ) {
    return res.send( new Error( 'The name field is not specified.' ) );
  }

  // Set some response fields.
  res.set({
    size: 234323,
    template: req.param( 'template', 'default-template' )
  });

  // Send progress update...
  res.send({
    progress: 0.2,
    message: util.format( 'Generating PDF named [%s].', req.param( 'name' )  )
  });

  // Send progress update.
  res.send({
    progress: 0.2,
    message: util.format( 'Generation complete; uploading to GS Bucket [%s].', req.param( 'bucket' ) )
  });

  // Test if we are passed the timeout limit - meaning the client is no longer expected to be online
  if( this.time > req.get( 'timeout' ) ) {
    this.debug( 'PDF Generation request for #[%s] took too long...', req.get( 'job' ) );
  }

  // Send final response.
  res.send({
    progress: 1,
    message: "PDF File generated.",
    url: "http://commondatastorage.googleapis.com/static.saas.usabilitydynamics.com/sample.pdf"
  });

});