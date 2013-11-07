/**
 * GET users listing.
 *
 */
exports.list = function listUsers(req, res){
  res.send("respond with a resource");
};

/**
 * Validate Credentials
 *
 * @param req
 * @param res
 * @param next
 */
exports.validate = function validateUser( req, res ) {
  console.log( 'Request to validate user...' );

  req.job( 'user/validate', req.query, function() {
    console.log( 'Sending job [%s] to exchange.', this.job_type );

    setTimeout( function() {

      // Force kill of correlation.
      correlation.emit( 'kill' );

      res.send({
        success: false,
        message: 'timed out..',
        correlation: correlation
      });

    }, 1000 )

    this.once( 'complete', function( message ) {
      console.log( 'test-job-one complete', message );
    });

  });

};