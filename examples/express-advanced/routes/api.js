/**
 * API Routes
 *
 * @param req
 * @param res
 * @param next
 */
exports.generate = {

  /**
   * Generate Key
   *
   * @param req
   * @param res
   * @param next
   */
  key: function generateKey( req, res ) {
    // console.log( 'Request to generateKey...' );

    // Run job
    req.rabbit.startActivity( 'api/generate-key', req.query, function job( correlation ) {
      // console.log( 'Sending job [%s] to exchange.', this.job_type );

      setTimeout( function() {

        // Force kill of correlation.
        correlation.emit( 'kill' );

        res.send({
          success: false,
          message: 'timed out..',
          correlation: correlation
        });

      }, 1000 )

      this.on( '**', function( error, message, data ) {
        console.log( this.event.blue, error, JSON.stringify( data ) )
      });

      this.once( 'complete', function( error, message, data ) {
        console.log( 'generateKey job complete' );

        res.send({
          success: true,
          data: data
        })

      });

    });

  }

};