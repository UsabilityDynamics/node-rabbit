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
 * - __connection.end
 * - __connection.finish
 * - __connection.connect
 * - __connection.data
 * - __connection.readable
 * - __connection.error
 * - __connection.ready
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

      var self = this;

      this.debug( 'Connecting to [%s].', this.get( 'settings.url' ) );

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
        self.debug( 'Connection error: [%s]:[%s]', error.message, error.code );

        self.emit( 'connection', new Error( error.message ), self );
        self.emit( 'connection.error', new Error( error.message ), self );

        // CONNECTION_FORCED - Closed via management plugin
        if( error.code === 320 ) {}

      });

      // RabbitClient connection established.
      this.get( 'connection' ).once( 'ready', function get_exchanges() {
        self.debug( 'Connection is ready.' );

        // Emit connection success.
        self.emit( 'connection', null, self );
        self.emit( 'connection.success', null, self );

        //console.log( 'RabbitClient.Activity.register', typeof RabbitClient.Activity.register );

        // Register Activity Document
        RabbitClient.Activity.register( '_activity', {
          durable: true,
          confirm: false,
          passive: false,
          connection: self.get( 'connection' )
        });

        // Some Activities
        RabbitClient.Activity.create( '/api/generate-pdf:v1' );
        RabbitClient.Activity.create( '/api/generate-pdf:v2' );

        // Get Created
        RabbitClient.Activity.create( '/api/generate-pdf:v1' ).publish( 'work-request', {
          bells: 'whistles'
        });

        return;

        // Register Session Document
        RabbitClient.Session.register( '_session', {
          durable: true,
          confirm: false,
          passive: false,
          autoDelete: false,
          connection: self.get( 'connection' )
        }, function() {


          // Some Bulilshit Sessions
          RabbitClient.Session.create( 'usabilitydynamics.com' );
          RabbitClient.Session.create( 'terminallance.com.com' );

        });

      });

      // @chainable
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

      // Ensure Activity is registered
      if( !RabbitClient.Activity.ready ) {
        return this.error ? this.error( 'Can not call registerActivity - Activity is not active.' ) : new Error( 'processJob() was called out of context.' );
      }

      // Create Activity Instance and subscribe to Work Requests, handler called in request/response context
      RabbitClient.Activity.create( name ).subscribe( 'work-request', handler );

      return this;

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

      // Ensure Activity is registered
      if( !RabbitClient.Activity.ready ) {
        return this.error ? this.error( 'Can not call processJob - Activity is not registered.' ) : new Error( 'processJob() was called out of context.' );
      }

      // Create or load Activity.
      var _activity = RabbitClient.Activity.create( name );

      // Send Work Request to Activity Work Queue.
      _activity.publish( 'work-request', message, {
        correlationId: 'unique-id-of-this-task',
        mandatory: true,
        immediate: true
      });

      // Subscribe to Work Request queue
      // 'unique-id-of-this-task';

      // @chainable.
      return this;

    },
    enumerable: true,
    writable: true
  },
  getJob: {
    value: function createSession() {

    },
    enumerable: true,
    writable: true
  },
  getSession: {
    value: function createSession() {

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

// Rabit constructor properties.
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
  Thing: {
    value: require( './client/thing' ),
    enumerable: true,
    writable: false
  },
  Activity: {
    value: require( './client/activity' ),
    enumerable: true,
    writable: false
  },
  Correlation: {
    value: require( './client/correlation' ),
    enumerable: true,
    writable: false
  },
  Job: {
    value: require( './client/job' ),
    enumerable: true,
    writable: false
  },
  Session: {
    value: require( './client/session' ),
    enumerable: true,
    writable: false
  },
  Service: {
    value: require( 'rabbit-service' ),
    enumerable: true,
    writable: false
  },
  startService: {
    /**
     * Create Service
     *
     * @method startService
     * @for RabbitClient
     */
    get: function startService() {
      return require( 'rabbit-service' ).create;
    },
    enumerable: true
  },
  createConnection: {
    /**
     * Create Connection
     *
     * @method startService
     * @for RabbitClient
     */
    get: function createConnection() {
      return require( 'rabbit-client' ).create;
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
  },
  _schemas: {
    /**
     * Schemas
     *
     * @attribute _schemas
     * @type object
     */
    value: {},
    enumerable: false,
    writable: false
  }
});




