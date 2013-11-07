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

    // Start Activity
    req.app.startActivity( 'api/generate-key', req.query, function job( task ) {

      setTimeout( function() {

        // Force kill of correlation.
        task.emit( 'kill' );

        res.send({
          success: false,
          message: 'timed out..',
          correlation: task
        });

      }, 1000 )

      task.on( '**', function( error, message, data ) {
        console.log( this.event.blue, error, JSON.stringify( data ) )
      });

      task.once( 'complete', function( error, message, data ) {
        console.log( 'generateKey job complete' );

        res.send({
          success: true,
          data: data
        })

      });

    });

  }

};