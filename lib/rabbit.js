var _debug     = require( 'debug' );
var _inherits  = require( 'util' ).inherits;
var _settings  = require( 'object-settings' );
var _emitter   = require( 'object-emitter' );
var _rabbitMQ  = require( 'amqp' );



// The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is.
function Rabbit ( options ) {
  var self = this;

  // Add object settings to store possible meta data, etc.
  _settings.mixin( this  );

  // Add object emitter for event based structure.
  _emitter.mixin( this );

  // Properties to a specific instance of Rabbit.
  Object.defineProperties( this, {
    defineJobs: {
      value: {},
      writable: true
    }
  });

  // Connect to AMQP.
  this.connection = _rabbitMQ.createConnection( options );

  // Connection events.
  this.connection.on( 'error', function( error ) {
    self.emit( 'error', error );
  });
  this.connection.on( 'ready', function() {
    self.emit( 'online', 'A connection has been made.' );
  });
}








// Rabbit prototype properties.
Object.defineProperties( Rabbit.prototype, {

/*

  I don't really know where this was going.

  define: {
    *//**
     * Add worker to define job container.
     *
     * @param name
     * @param worker
     *//*
    value: function define ( name, worker ) {
      this.defineJobs[name] = worker;
    }
  },
*/

  run: {
    value: function run ( name, data, response ) {


      var exchange = this.connection.exchange( name, {type: 'direct', durable: true}, function() {
        var queue  = this.connection.queue( name + '.run', {durable:true}, function() {

          queue.bind( name, '' );
          queue.on( 'queueBindOk', function() {

            exchange.publish( name + '.run', data, {
              headers:      { api: 'some kind of key', sid: 'some kind of id'},
              contentType:      'application/json',
              deliveryMode      : 2,
              "priority"        : 9,
              "correlationId"   : "a unique id",
              //          "replyTo"         : message.email,
              //          "expiration"      : "10000", // Will delete messages in 10 seconds
              "messageId"       : Math.random().toString( 36 ).substring( 2 ),
              "type"            : "user",
              "userId"          : "udx", // must match authenticated..
              "appId"           : "rabbit",
              "clusterId"       : 'asdf'   // does nothing
            });
          });
        });
      });
    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  work: {
    value: function work ( name, response ) {
      var exchange = this.connection.exchange( name, {type: 'direct', durable: true}, function() {
        var queue  = this.connection.queue( name + '.run', {durable:true}, function() {

          queue.bind( name, '' );
          queue.on( 'queueBindOk', function() {

            queue.subscribe(function(message) {

              response( message );

            });


          });
        });
      });


    },
    enumerable: true,
    writable: true,
    configurable: true
  }
});








// Rabit constructor properties.
Object.defineProperties( module.exports = Rabbit, {
  debug: {
    value: _debug( 'Rabbit' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  createConnection: {
    /**
     * Returns new instance of Rabbit.
     */
    value: function createConnection ( options ) {
      Rabbit.debug( 'Creating new connection.' );
      return new Rabbit( options );
    },
    enumerable: true,
    writable: true,
    configurable: true
  }
});




