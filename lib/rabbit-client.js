/**
 * Rabbit Client
 *
 * The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is
 *
 * ## Events
 * - connection           : General connection event - could be an error or a success.
 * - connection.success   : Successful connection event.
 * - connection.error     : Connection failure.
 * - error                : General error.
 *
 * ## AMQP Events
 * - connection.end
 * - connection.finish
 * - connection.connect
 * - connection.data
 * - connection.readable
 * - connection.error
 * - connection.ready
 *
 * ## Useful Properties
 * - connection.channels: list of open channels
 * - connection.queues: list of open channels
 *
 * @param handler {Function} Extendeble callback method.
 * @returns {RabbitClient} Newly created Rabbit context.
 * @version 0.1.0
 *
 * @async
 * @chainable
 * @constructor
 */
function RabbitClient() {

  // Force Instance.
  if( !( this instanceof RabbitClient ) ) {
    return new RabbitClient( arguments[0] );
  }

  // Clone Context.
  var context = this;

  // If an object is passed instead of a function.
  var handler = 'function' === typeof arguments[0] ? arguments[0] : RabbitClient.utility.noop;

  // Extend child's prototype with RabbitClient.
  RabbitClient.utility.inherits( handler, RabbitClient );

  // Mixing external prototypes.
  RabbitClient.utility.settings( handler.prototype );
  RabbitClient.utility.emitter( handler.prototype );

  try {

    // Set computed and default sedttings.
    handler.prototype.set({
      name: require( '../package' ).name,
      version: require( '../package' ).version,
      directories: require( '../package' ).directories,
      settings: RabbitClient.utility.omit( RabbitClient.utility.defaults( handler, require( '../package' ).config ), 'super_'  ),
      environment: process.env.NODE_ENV || 'production',
      identity: String( process.pid ),
      connection: {}
    });

    // Save URL connection string.
    if( 'string' === typeof arguments[0] ) {
      handler.prototype.set( 'settings.url', arguments[0] );
    }

    // Extend context.
    Object.defineProperties( handler.prototype, {
      __queue: {
        /**
         * Action Queue
         *
         * @property __queue
         */
        value: {},
        enumerable: false,
        writable: true
      }
    });

    // Invoke handler and overwrite context.
    context = new handler( null, null, RabbitClient );

    // Parse Settings
    context.validate();

    // Creates Connection.
    context.connect();

    context.get( 'connection' ).once( 'ready', function declare_exchanges() {
      context.debug( 'Connection is ready, declaring Exchange Documents.' );

      // Register Activity Exchange Document
      RabbitClient.Activity.declare({
        name: 'activity',
        connection: context.get( 'connection' ),
        version: RabbitClient.version
      });

      // Register Session Exchange Documents
      RabbitClient.Session.declare({
        name: 'session',
        connection: context.get( 'connection' ),
        version: RabbitClient.version
      });

      // Register Job Exchange Documents
      RabbitClient.Job.declare({
        name: 'job',
        connection: context.get( 'connection' ),
        version: RabbitClient.version
      });

    });

  } catch( error ) {
    return new handler( error, RabbitClient ).error( error );
  }

  // @chainable
  return context;

}

// Rabbit prototype properties.
Object.defineProperties( RabbitClient.prototype, {
  error: {
    value: require( './utility' ).error,
    configurable: true,
    enumerable: false,
    writable: true
  },
  debug: {
    value: require( './utility' ).debug,
    configurable: true,
    enumerable: true,
    writable: true
  },
  connect: {
    /**
     * Connect to Broker via AMQP
     *
     * @method connect
     * @for RabbitClient
     */
    value: function connect() {
      this.debug( 'Connecting to [%s].', this.get( 'settings.url' ) );

      var context = this;

      // Connect via AMQP.
      this.set( 'connection', RabbitClient.utility.amqp.createConnection({
        host: this.get( 'settings.host' ),
        port: this.get( 'settings.port' ),
        login: this.get( 'settings.login', 'guest' ),
        password: this.get( 'settings.password', 'guest' ),
        clientProperties: {
          version: RabbitClient.version,
          platform: 'rabbit-client-' + RabbitClient.version,
          product: 'rabbit-client'
        },
        vhost: this.get( 'settings.vhost' )
      }, { defaultExchangeName: this.get( 'settings.exchænge', 'amq.topic' ), reconnect: this.get( 'settings.reconnect', true )} ) );

      // RabbitClient _connection failed.
      this.get( 'connection' ).on( 'error', function error( error ) {
        context.debug( 'Connection error: [%s]:[%s]', error.message, error.code );

        context.emit( 'connection', new Error( error.message ), context );
        context.emit( 'connection.error', new Error( error.message ), context );

        // CONNECTION_FORCED - Closed via management plugin
        if( error.code === 320 ) {}

      });

      // RabbitClient connection established.
      this.get( 'connection' ).once( 'ready', function get_exchanges() {

        // Emit connection success.
        process.nextTick( function() {
          context.emit( 'connection', null, context );
          context.emit( 'connection.success', null, context );
        })

      });

      // Connection Closed.
      this.get( 'connection' ).on( 'close', function close( error ) {

      });

      this.get( 'connection' ).on( 'message', function message( message ) {
        console.log( 'message', message );
      });

      // @chainable
      return this;

    },
    enumerable: true,
    writable: true
  },
  destroy: {
    /**
     * Destroy Connection
     *
     */
    value: function destroy() {
      this.get( 'connection' ).destroy();
      return this;
    },
    enumerable: true,
    writable: true
  },
  configure: {
    /**
     * Configure Client
     *
     * Method executed when connection is ready.
     * Usage and semantics emulating Express.
     *
     * @param env
     * @param callback
     * @returns {*}
     */
    value: function configure( env, callback ) {
      var self = this;
      var envs = 'all';
      var args = [].slice.call( arguments );

      callback = args.pop();

      if( args.length ) {
        envs = args;
      }

      if( 'all' == envs || ~envs.indexOf( this.get( 'environment' ) ) ) {
        self.once( 'connection.success', function() {
          this.debug( 'Calling configuration callback [%s].', callback.name || 'no-name' );

          try {
            callback.call( this, this, RabbitClient );
          } catch( error ) {
            this.error( error );
          }

        });
      }

      // @chainable
      return this;

    },
    enumerable: true,
    writable: false
  },
  registerActivity: {
    /**
     * Regiser New Activity.
     *
     * - Instantiate Activity Type
     * - Subscribe to work-request queue.
     *
     *
     * @example
     *
     *    client.registerActivity( '/api/generate-key:v1', function Worker( req, res ) {
     *
     *    });
     *
     * @param name {String} Name of job type.
     * @param activity {Function} Function to process job.
     */
    value: function registerActivity( name, handler ) {
      this.debug( 'Registering Activity [%s].', name  );

      // Create Activity Instance and subscribe to Work Requests, handler called in request/response context
      var instance = RabbitClient.Activity.create( name ).subscribe( name, handler );

      return instance;

    },
    enumerable: true,
    writable: false
  },
  processJob: {
    /**
     * Publish a Work Request
     *
     * @method processJob
     * @chainable
     * @param name {String} Name of job type.
     * @param message {Object} Job parameters.
     * @param handler {Function} Callback method.
     */
    value: function processJob( name, message, handler ) {

      // Detect Middleware Use
      if( !message && !handler ) {

        // Prepare Activity Queue.
        // Return Middleware handler.
        return require( './middleware/process-job' ).bind({
          activity: RabbitClient.Activity.create( name ),
          client: this,
          constructor: RabbitClient
        });

      }

      var job_id = Math.random().toString( 36 ).substring( 2 );

      // Create Job Instance and subscribe to all messages

      RabbitClient.Job.create( job_id ).subscribe( job_id, handler );

      // Publish Work Request message to an Activity Work Queue.
      RabbitClient.Activity.create( name ).publish( name, message, {
        correlationId: job_id
      });

      //console.log( require( 'util' ).inspect( handler, { showHidden: true, colors: true, depth: 2 } ) )

      // @chainable.
      return this;

    },
    enumerable: true,
    writable: true
  },
  getJob: {
    value: function getJob() {},
    enumerable: true,
    writable: true
  },
  getSession: {
    value: function getSession( sid, handler ) {
      this.debug( 'Get Session [%s].', sid );

      // Create Session Instance and subscribe to own queue.
      return RabbitClient.Session.create( sid ).subscribe( sid, handler );

    },
    enumerable: true,
    writable: true
  },
  validate: {
    /**
     * Validate Settings
     *
     * Attempts to fix broken settings and laod environment defaults.
     *
     * @method validate
     * @for RabbitClient
     */
    value: function validate() {

      // Convert URL to Keys
      if( this.get( 'settings.url' ) || process.env.RABBIT_URL ) {

        var _parse = RabbitClient.utility.url_parse( this.get( 'settings.url' ) || process.env.RABBIT_URL );

        this.set( 'settings', RabbitClient.utility.defaults( this.get( 'settings' ), {
          host: _parse.hostname,
          port: _parse.port,
          login: _parse.auth ? _parse.auth.split( ':' )[0] : '',
          password: _parse.auth ? _parse.auth.split( ':' )[1] : '',
          vhost: _parse.pathname || '/'
        }));

      }

      // Set Host
      if( !this.get( 'settings.host' ) ) {
        this.set( 'settings.host', process.env.RABBIT_HOST );
      }

      // Set Port
      if( !this.get( 'settings.port' ) ) {
        this.set( 'settings.port', process.env.RABBIT_PORT );
      }

      // Set Login
      if( !this.get( 'settings.login' ) ) {
        this.set( 'settings.login', process.env.RABBIT_LOGIN );
      }

      // Set Password
      if( !this.get( 'settings.password' ) ) {
        this.set( 'settings.password', process.env.RABBIT_LOGIN );
      }

      // Create settings URL if it was not set
      if( !this.get( 'settings.url' ) ) {
        this.set( 'settings.url', [ 'amqp://', this.get( 'settings.host' ), ':', this.get( 'settings.port' ), this.get( 'settings.vhost' ) ].join( '' ) )
      }

      // @chainable
      return this;

    },
    enumerable: false,
    writable: true
  }
});

// Rabbit constructor properties.
Object.defineProperties( module.exports = RabbitClient, {
  create: {
    /**
     * Returns new context of RabbitClient.
     *
     * @method create
     * @param handler {Object|Function} Handler method or configuration object for connection.
     * @returns {RabbitClient}
     */
    value: function create( handler ) {
      return new RabbitClient( handler );
    },
    enumerable: true,
    writable: false
  },
  Activity: {
    value: require( './exchange/activity' ),
    configurable: false,
    enumerable: true,
    writable: false
  },
  Exchange: {
    value: require( './exchange' ),
    configurable: false,
    enumerable: true,
    writable: false
  },
  Job: {
    value: require( './exchange/job' ),
    configurable: false,
    enumerable: true,
    writable: false
  },
  Session: {
    value: require( './exchange/session' ),
    enumerable: true,
    writable: false
  },
  sessionStore: {
    /**
     * Create Session Store Instance
     *
     * @param {Object} connect Connect, or Express, module.
     * @method sessionStore
     * @for RabbitClient
     */
    value: function sessionStore( connect ) {

      var Store = connect.session.Store;

      /**
       * Initialize RedisStore with the given `options`.
       *
       * @param options
       */
      function rabbitStore( options ) {

        var self = this;

        options = options || {};

        Store.call( this, options );

        this.prefix = null == options.prefix ? 'sess:' : options.prefix;

        this.client = options.client || new RabbitClient.create( options.port || options.socket, options.host, options );

        self.client.on( 'error', function() {
          self.emit( 'disconnect' );
        });

        self.client.on( 'connect', function() {
          self.emit( 'connect' );
        });

      }

      // Inherit Store prototyp
      rabbitStore.prototype.__proto__ = Store.prototype;

      /**
       * Add Custom Handlers
       *
       */
      Object.defineProperties( rabbitStore.prototype, {
        get: {
          value: function get() {},
          enumerable: true,
          configurable: true,
          writable: true
        },
        set: {
          value: function set() {},
          enumerable: true,
          configurable: true,
          writable: true
        },
        destroy: {
          value: function destroy() {},
          enumerable: true,
          configurable: true,
          writable: true
        },
      });

      // Export rabbitStore
      return rabbitStore;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  startService: {
    /**
     * Create Service
     *
     * @method startService
     * @for RabbitClient
     */
    get: function startService() {

      var _service;

      try {
        _service = require( 'rabbit-service' );

        if( 'function' !== typeof _service.create ) {
          throw new Error( 'Rabbit Service not loaded.' );
        }

      } catch( error ) {
        return {}
      }

      return _service.create;

    },
    enumerable: true
  },
  utility: {
    value: require( './utility' ),
    enumerable: false,
    writable: false
  },
  version: {
    /**
     * Module Version
     *
     * @attribute version
     * @type sring
     */
    value: require( '../package' ).version,
    enumerable: true,
    writable: false
  }
});




