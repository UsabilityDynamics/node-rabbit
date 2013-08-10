/**
 * -
 *
 * -
 *
 * @author potanin
 * @date 8/10/13
 */
function Message( data ) {

  if( this instanceof Message ) {
    var type = 'own';
  } else if( this instanceof require( './rabbit' ) ) {
    var type = 'rabbit';
  } else {
    console.error( 'Unexpected context for Message' );
  }


  this.message = message;

}

Object.defineProperties( Message.prototype, {
  pack: {
    /**
     * Pack String
     *
     * @param string
     * @returns {*}
     */
    value: function pack( string ) {
      var Instance    = this;
      var msgpack     = require( 'msgpack' );

      if( string instanceof Buffer ) {
        string = string.toString();
      }

      return msgpack.pack( string );

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  unpack: {
    /**
     * Unpack Message
     *
     * @param string
     * @returns {*}
     */
    value: function unpack( string ) {
      var Instance    = this;
      var msgpack     = require( 'msgpack' );

      if( string instanceof Buffer ) {
        string = string.toString();
      }

      return msgpack.unpack( string )

    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})

Object.defineProperties( module.exports = Message, {
  create: {
    /**
     *
     * @param data
     * @returns {Message}
     */
    value: function create( data ) {
      return new Message( data );
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})