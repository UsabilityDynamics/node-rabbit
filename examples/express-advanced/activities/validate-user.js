/**
 * Validate User Credentials
 *
 * @param data
 * @param complete
 */
function validateUser( data, complete ) {
  this.debug( 'Doing [%s] job.', this.type );

  complete( null, {
    message: 'The TestJobOne has been complete.'
  });

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


