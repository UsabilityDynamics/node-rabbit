/**
 * Rabbit
 *
 * The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is
 *
 * ## Events
 * - connection: General connection event - could be an error or a success.
 * - connection.success: Successful connection event.
 * - connection.error: Connection failure.
 *
 * @param settings {Object} Configuration.
 * @param settings.api {String} URL to RabbitMQ management API, if available.
 * @param cb {Function} Callback function.
 * @returns {Rabbit}
 * @constructor
 */
function Rabbit( settings, cb ) {
  Rabbit.debug( 'Creating new connection.' );

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Rabbit ) ) {
    return new Rabbit( settings, cb );
  }

  var Instance = this;

  // Mixin Settings and EventEmitter
  require( 'object-settings' ).mixin( Instance );
  require( 'object-emitter' ).mixin( Instance );

  // Configure instance.
  Instance.set({
    settings: Rabbit.extend( {}, Rabbit.defaults, settings ),
    exchange: {},
    identity: String( process.pid )
  });

  // Connect to AMQP.
  this.connection = Rabbit.amqp.createConnection({
    host: Instance.get( 'settings.host' ),
    port: Instance.get( 'settings.port' ),
    login: Instance.get( 'settings.login' ),
    password: Instance.get( 'settings.password' ),
    vhost: Instance.get( 'settings.vhost' )
  }, {
    defaultExchangeName: Instance.get( 'settings.defaultExchange', '' ),
    reconnect: Instance.get( 'settings.reconnect', true ),
  });

  // Bind callback to ready event, if provided.
  if( 'function' === typeof cb ) {
    this.on( 'ready', cb );
  }

  // RabbitMQ connection failed.
  this.connection.on( 'error', function rabbit_error( error ) {
    Instance.emit( 'connection', new Error( error.message ), Instance );
    Instance.emit( 'connection.error', new Error( error.message ), Instance );
  });

  // RabbitMQ connection established.
  this.connection.on( 'ready', function rabbit_ready( connection ) {

    this.exchange( 'wabbit', {
      type: 'topic',
      passive: false,
      durable: true,
      //confirm: true,
      //autoDelete: true,
      //noDeclare: false,
    }, function have_exchange() {

      // Set Exchange Variables.
      Instance.set( 'exchange', this );

      // Emit connection success.
      Instance.emit( 'connection', null, Instance );
      Instance.emit( 'connection.success', Instance );

    });

  });

  // Return context.
  return this;

}

// Rabbit prototype properties.
Object.defineProperties( Rabbit.prototype, {
  api: {
    /**
     * Make RabbitMQ API Request
     *
     * @example
     *
     *    // Get Vhosts
     *    Instance.api( 'get', 'vhosts', console.log );
     *
     *    // Get queues
     *    Instance.api( 'get', 'queues', console.log );
     *
     * @async
     * @chainable
     * @param method
     * @param query
     * @param cb
     */
    value: function api( method, query, cb ) {

      Rabbit.request({
        url: Instance.get( 'settings.api' ) + '/vhosts',
        json: true,
        auth: {
          user: Instance.get( 'settings.login' ),
          pass: Instance.get( 'settings.password' )
        }
      }, function( error, req, body ) { cb( error, body ); });

      // Chainable.
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  defineJob: {
    /**
     * Define a job.
     *
     * @param name {String} Name of job type.
     * @param fn {Function} Function to process job.
     */
    value: function defineJob( name, fn ) {

      var Instance = this;

      // Job Queue Options.
      var _options = {
        durable: true,
        autoDelete: false,
        passive: false,
        arguments: {
          name: name
        }
      };

      // Use the default 'amqueue.topic' exchange
      this.connection.queue( _options.arguments.name, _options, function have_queue( queue ) {
        console.log( 'have_queue', queue.state, Instance.get( 'exchange.name' ) );

        // Bind to exchange with routing of "job"
        queue.bind( Instance.get( 'exchange.name' ), name );

        // Receive messages
        queue.subscribe({ prefetchCount: 1, ack: true }, function have_message( message, headers, info ) {

          console.log( 'message', message );
          console.log( 'headers', headers );
          // console.log( 'deliveryTag', info.deliveryTag.toString() );

          setTimeout( function() {
            queue.shift();
          }, 1000 )

        });

      });

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  runJob: {
    /**
     * Run a job.
     *
     * @param name
     * @param data
     * @param response
     */
    value: function runJob( name, data, response ) {

      var _options = {
        type: 'job',
        correlationId : Math.random().toString( 36 ).substring( 2 ),
        contentType:'application/json',
        headers: {
          format: 'json',
          sid: Math.random().toString( 36 ).substring( 2 ),
          jid: Math.random().toString( 36 ).substring( 2 ),
          pid: this.get( 'identity' )
        },
        deliveryMode: 2
        // immediate : false,
        // confirm: false,
        // priority: 9,
        // expiration: "10000",
        // messageId: Math.random().toString( 36 ).substring( 2 ),
        // replyTo: message.email,
        // appId: this.get( 'app_id' )
      }

      this.get( 'exchange' ).publish( name, data, _options, function published() {
        console.log( 'job request published' );

        // Instance.subscribe( _options.correlationId );

      });

      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  define: {
    get: function() { return this.defineJob },
    enumerable: false,
    configurable: true
  },
  run: {
    get: function() { return this.runJob },
    enumerable: false,
    configurable: true
  },
  message: {
    value: require( './message' ),
    enumerable: true,
    writable: true,
    configurable: true
  }
});

// Rabit constructor properties.
Object.defineProperties( module.exports = Rabbit, {
  debug: {
    value: require( 'debug' )( 'rabbit' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  request: {
    value: require( 'request' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  extend: {
    value: require( 'extend' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  amqp: {
    value: require( 'amqp' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  defaults: {
    value: {
      host: 'localhost',
      port: 5672,
      login: 'guest',
      password: 'guest',
      vhost: '/',
      exchange: 'wabbit',
      reconnect: true,
      api: 'http://localhost:15672/api'
    },
    enumerable: false,
    writable: true,
    configurable: true
  },
  createConnection: {
    /**
     * Returns new instance of Rabbit.
     *
     * @param settings {Object} Configuration for connection.
     * @returns {Rabbit}
     */
    value: function createConnection ( settings, cb ) {
      return new Rabbit( settings, cb );
    },
    enumerable: true,
    writable: true,
    configurable: true
  }
});




