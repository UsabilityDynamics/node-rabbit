/**
 * Generate API Key
 *
 * @param data
 * @param complete
 */
function generateKey( data, complete ) {
  this.debug( 'Doing [%s] job; Generating key for site:[%s].', this.type, data.site );

  // console.log( require( 'util' ).inspect( arguments, { showHidden: true, colors: true, depth: 2 } ) )

  complete( null, {
    message: 'The TestJobOne has been complete.',
    site: data.site,
    key: '32423423',
    secret: 'asdfasfsadfaf'
  });

}

module.exports = generateKey;

