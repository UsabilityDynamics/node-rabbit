/**
 * Validate User Credentials
 *
 * @param data
 * @param complete
 */
function validateUser( req, res ) {
  this.debug( 'Doing [%s] job.', this.type, req.get() );

  setTimeout( function() {

    res.send({
      message: 'The TestJobOne has been complete.'
    });

  }, 1000 )

}

Object.defineProperties( validateUser.prototype, {
  bells: {
    value: function bells() {},
    enumerable: true,
    configurable: true,
    writable: true
  }
});

Object.defineProperties( module.exports = validateUser, {
  create: {
    value: function create() {
      return new validateUser( data );
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});


