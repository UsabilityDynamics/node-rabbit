// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "lib/rabbit-client.js",[36,37,41,44,47,50,51,53,56,67,68,72,86,89,92,94,95,98,105,112,121,125,130,151,153,156,170,171,173,174,177,182,185,186,187,193,197,198,202,214,215,232,233,234,236,238,239,242,243,244,246,247,249,256,280,283,285,304,308,316,320,323,330,343,346,364,366,368,379,380,384,385,389,390,394,395,399,400,404,413,423,461,470,472,474,476,478,480,481,484,485,491,497,519,535,537,538,540,541,545,548]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbit-client.js",[36,67,177,238,242,242,304,304,364,364,379,384,389,394,399,540]);
_$jscoverage["lib/rabbit-client.js"].source = ["/**"," * Rabbit Client"," *"," * The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is"," *"," * ## Events"," * - connection           : General connection event - could be an error or a success."," * - connection.success   : Successful connection event."," * - connection.error     : Connection failure."," * - error                : General error."," *"," * ## AMQP Events"," * - connection.end"," * - connection.finish"," * - connection.connect"," * - connection.data"," * - connection.readable"," * - connection.error"," * - connection.ready"," *"," * ## Useful Properties"," * - connection.channels: list of open channels"," * - connection.queues: list of open channels"," *"," * @param handler {Function} Extendeble callback method."," * @returns {RabbitClient} Newly created Rabbit context."," * @version 0.1.0"," *"," * @async"," * @chainable"," * @constructor"," */","function RabbitClient() {","","  // Force Instance.","  if( !( this instanceof RabbitClient ) ) {","    return new RabbitClient( arguments[0] );","  }","","  // Clone Context.","  var context = this;","","  // If an object is passed instead of a function.","  var handler = 'function' === typeof arguments[0] ? arguments[0] : RabbitClient.utility.noop;","","  // Extend child's prototype with RabbitClient.","  RabbitClient.utility.inherits( handler, RabbitClient );","","  // Mixing external prototypes.","  RabbitClient.utility.settings( handler.prototype );","  RabbitClient.utility.emitter( handler.prototype );","","  try {","","    // Set computed and default sedttings.","    handler.prototype.set({","      name: require( '../package' ).name,","      version: require( '../package' ).version,","      directories: require( '../package' ).directories,","      settings: RabbitClient.utility.omit( RabbitClient.utility.defaults( handler, require( '../package' ).config ), 'super_'  ),","      environment: process.env.NODE_ENV || 'production',","      identity: String( process.pid ),","      connection: {}","    });","","    // Save URL connection string.","    if( 'string' === typeof arguments[0] ) {","      handler.prototype.set( 'settings.url', arguments[0] );","    }","","    // Extend context.","    Object.defineProperties( handler.prototype, {","      __queue: {","        /**","         * Action Queue","         *","         * @property __queue","         */","        value: {},","        enumerable: false,","        writable: true","      }","    });","","    // Invoke handler and overwrite context.","    context = new handler( null, null, RabbitClient );","","    // Parse Settings","    context.validate();","","    // Creates Connection.","    context.connect();","","    context.get( 'connection' ).once( 'ready', function declare_exchanges() {","      context.debug( 'Connection is ready, declaring Exchange Documents.' );","","      // Register Activity Exchange Document","      RabbitClient.Activity.declare({","        name: 'activity',","        connection: context.get( 'connection' ),","        version: RabbitClient.version","      });","","      // Register Session Exchange Documents","      RabbitClient.Session.declare({","        name: 'session',","        connection: context.get( 'connection' ),","        version: RabbitClient.version","      });","","      // Register Job Exchange Documents","      RabbitClient.Job.declare({","        name: 'job',","        connection: context.get( 'connection' ),","        version: RabbitClient.version","      });","","    });","","  } catch( error ) {","    return new handler( error, RabbitClient ).error( error );","  }","","  // @chainable","  return context;","","}","","// Rabbit prototype properties.","Object.defineProperties( RabbitClient.prototype, {","  error: {","    value: require( './utility' ).error,","    configurable: true,","    enumerable: false,","    writable: true","  },","  debug: {","    value: require( './utility' ).debug,","    configurable: true,","    enumerable: true,","    writable: true","  },","  connect: {","    /**","     * Connect to Broker via AMQP","     *","     * @method connect","     * @for RabbitClient","     */","    value: function connect() {","      this.debug( 'Connecting to [%s].', this.get( 'settings.url' ) );","","      var context = this;","","      // Connect via AMQP.","      this.set( 'connection', RabbitClient.utility.amqp.createConnection({","        host: this.get( 'settings.host' ),","        port: this.get( 'settings.port' ),","        login: this.get( 'settings.login', 'guest' ),","        password: this.get( 'settings.password', 'guest' ),","        clientProperties: {","          version: RabbitClient.version,","          platform: 'rabbit-client-' + RabbitClient.version,","          product: 'rabbit-client'","        },","        vhost: this.get( 'settings.vhost' )","      }, { defaultExchangeName: this.get( 'settings.exchænge', 'amq.topic' ), reconnect: this.get( 'settings.reconnect', true )} ) );","","      // RabbitClient _connection failed.","      this.get( 'connection' ).on( 'error', function error( error ) {","        context.debug( 'Connection error: [%s]:[%s]', error.message, error.code );","","        context.emit( 'connection', new Error( error.message ), context );","        context.emit( 'connection.error', new Error( error.message ), context );","","        // CONNECTION_FORCED - Closed via management plugin","        if( error.code === 320 ) {}","","      });","","      // RabbitClient connection established.","      this.get( 'connection' ).once( 'ready', function get_exchanges() {","","        // Emit connection success.","        process.nextTick( function() {","          context.emit( 'connection', null, context );","          context.emit( 'connection.success', null, context );","        })","","      });","","      // Connection Closed.","      this.get( 'connection' ).on( 'close', function close( error ) {","","      });","","      this.get( 'connection' ).on( 'message', function message( message ) {","        console.log( 'message', message );","      });","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true","  },","  destroy: {","    /**","     * Destroy Connection","     *","     */","    value: function destroy() {","      this.get( 'connection' ).destroy();","      return this;","    },","    enumerable: true,","    writable: true","  },","  configure: {","    /**","     * Configure Client","     *","     * Method executed when connection is ready.","     * Usage and semantics emulating Express.","     *","     * @param env","     * @param callback","     * @returns {*}","     */","    value: function configure( env, callback ) {","      var self = this;","      var envs = 'all';","      var args = [].slice.call( arguments );","","      callback = args.pop();","","      if( args.length ) {","        envs = args;","      }","","      if( 'all' == envs || ~envs.indexOf( this.get( 'environment' ) ) ) {","        self.once( 'connection.success', function() {","          this.debug( 'Calling configuration callback [%s].', callback.name || 'no-name' );","","          try {","            callback.call( this, this, RabbitClient );","          } catch( error ) {","            this.error( error );","          }","","        });","      }","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: false","  },","  registerActivity: {","    /**","     * Regiser New Activity.","     *","     * - Instantiate Activity Type","     * - Subscribe to work-request queue.","     *","     *","     * @example","     *","     *    client.registerActivity( '/api/generate-key:v1', function Worker( req, res ) {","     *","     *    });","     *","     * @param name {String} Name of job type.","     * @param activity {Function} Function to process job.","     */","    value: function registerActivity( name, handler ) {","      this.debug( 'Registering Activity [%s].', name  );","","      // Create Activity Instance and subscribe to Work Requests, handler called in request/response context","      var instance = RabbitClient.Activity.create( name ).subscribe( name, handler );","","      return instance;","","    },","    enumerable: true,","    writable: false","  },","  processJob: {","    /**","     * Publish a Work Request","     *","     * @method processJob","     * @chainable","     * @param name {String} Name of job type.","     * @param message {Object} Job parameters.","     * @param handler {Function} Callback method.","     */","    value: function processJob( name, message, handler ) {","","      // Detect Middleware Use","      if( !message && !handler ) {","","        // Prepare Activity Queue.","        // Return Middleware handler.","        return require( './middleware/process-job' ).bind({","          activity: RabbitClient.Activity.create( name ),","          client: this,","          constructor: RabbitClient","        });","","      }","","      var job_id = Math.random().toString( 36 ).substring( 2 );","","      // Create Job Instance and subscribe to all messages","","      RabbitClient.Job.create( job_id ).subscribe( job_id, handler );","","      // Publish Work Request message to an Activity Work Queue.","      RabbitClient.Activity.create( name ).publish( name, message, {","        correlationId: job_id","      });","","      //console.log( require( 'util' ).inspect( handler, { showHidden: true, colors: true, depth: 2 } ) )","","      // @chainable.","      return this;","","    },","    enumerable: true,","    writable: true","  },","  getJob: {","    value: function getJob() {},","    enumerable: true,","    writable: true","  },","  getSession: {","    value: function getSession( sid, handler ) {","      this.debug( 'Get Session [%s].', sid );","","      // Create Session Instance and subscribe to own queue.","      return RabbitClient.Session.create( sid ).subscribe( sid, handler );","","    },","    enumerable: true,","    writable: true","  },","  validate: {","    /**","     * Validate Settings","     *","     * Attempts to fix broken settings and laod environment defaults.","     *","     * @method validate","     * @for RabbitClient","     */","    value: function validate() {","","      // Convert URL to Keys","      if( this.get( 'settings.url' ) || process.env.RABBIT_URL ) {","","        var _parse = RabbitClient.utility.url_parse( this.get( 'settings.url' ) || process.env.RABBIT_URL );","","        this.set( 'settings', RabbitClient.utility.defaults( this.get( 'settings' ), {","          host: _parse.hostname,","          port: _parse.port,","          login: _parse.auth ? _parse.auth.split( ':' )[0] : '',","          password: _parse.auth ? _parse.auth.split( ':' )[1] : '',","          vhost: _parse.pathname || '/'","        }));","","      }","","      // Set Host","      if( !this.get( 'settings.host' ) ) {","        this.set( 'settings.host', process.env.RABBIT_HOST );","      }","","      // Set Port","      if( !this.get( 'settings.port' ) ) {","        this.set( 'settings.port', process.env.RABBIT_PORT );","      }","","      // Set Login","      if( !this.get( 'settings.login' ) ) {","        this.set( 'settings.login', process.env.RABBIT_LOGIN );","      }","","      // Set Password","      if( !this.get( 'settings.password' ) ) {","        this.set( 'settings.password', process.env.RABBIT_LOGIN );","      }","","      // Create settings URL if it was not set","      if( !this.get( 'settings.url' ) ) {","        this.set( 'settings.url', [ 'amqp://', this.get( 'settings.host' ), ':', this.get( 'settings.port' ), this.get( 'settings.vhost' ) ].join( '' ) )","      }","","      // @chainable","      return this;","","    },","    enumerable: false,","    writable: true","  }","});","","// Rabbit constructor properties.","Object.defineProperties( module.exports = RabbitClient, {","  create: {","    /**","     * Returns new context of RabbitClient.","     *","     * @method create","     * @param handler {Object|Function} Handler method or configuration object for connection.","     * @returns {RabbitClient}","     */","    value: function create( handler ) {","      return new RabbitClient( handler );","    },","    enumerable: true,","    writable: false","  },","  Activity: {","    value: require( './exchange/activity' ),","    configurable: false,","    enumerable: true,","    writable: false","  },","  Exchange: {","    value: require( './exchange' ),","    configurable: false,","    enumerable: true,","    writable: false","  },","  Job: {","    value: require( './exchange/job' ),","    configurable: false,","    enumerable: true,","    writable: false","  },","  Session: {","    value: require( './exchange/session' ),","    enumerable: true,","    writable: false","  },","  sessionStore: {","    /**","     * Create Session Store Instance","     *","     * @param {Object} connect Connect, or Express, module.","     * @method sessionStore","     * @for RabbitClient","     */","    value: function sessionStore( connect ) {","","      var Store = connect.session.Store;","","      /**","       * Initialize RedisStore with the given `options`.","       *","       * @param options","       */","      function rabbitStore( options ) {","","        var self = this;","","        options = options || {};","","        Store.call( this, options );","","        this.prefix = null == options.prefix ? 'sess:' : options.prefix;","","        this.client = options.client || new RabbitClient.create( options.port || options.socket, options.host, options );","","        self.client.on( 'error', function() {","          self.emit( 'disconnect' );","        });","","        self.client.on( 'connect', function() {","          self.emit( 'connect' );","        });","","      }","","      // Inherit Store prototyp","      rabbitStore.prototype.__proto__ = Store.prototype;","","      /**","       * Add Custom Handlers","       *","       */","      Object.defineProperties( rabbitStore.prototype, {","        get: {","          value: function get() {},","          enumerable: true,","          configurable: true,","          writable: true","        },","        set: {","          value: function set() {},","          enumerable: true,","          configurable: true,","          writable: true","        },","        destroy: {","          value: function destroy() {},","          enumerable: true,","          configurable: true,","          writable: true","        },","      });","","      // Export rabbitStore","      return rabbitStore;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  startService: {","    /**","     * Create Service","     *","     * @method startService","     * @for RabbitClient","     */","    get: function startService() {","","      var _service;","","      try {","        _service = require( 'rabbit-service' );","","        if( 'function' !== typeof _service.create ) {","          throw new Error( 'Rabbit Service not loaded.' );","        }","","      } catch( error ) {","        return {}","      }","","      return _service.create;","","    },","    enumerable: true","  },","  utility: {","    value: require( './utility' ),","    enumerable: false,","    writable: false","  },","  version: {","    /**","     * Module Version","     *","     * @attribute version","     * @type sring","     */","    value: require( '../package' ).version,","    enumerable: true,","    writable: false","  }","});","","","","",""];
function RabbitClient() {
    _$jscoverage_done("lib/rabbit-client.js", 36);
    if (_$jscoverage_done("lib/rabbit-client.js", 36, !(this instanceof RabbitClient))) {
        _$jscoverage_done("lib/rabbit-client.js", 37);
        return new RabbitClient(arguments[0]);
    }
    _$jscoverage_done("lib/rabbit-client.js", 41);
    var context = this;
    _$jscoverage_done("lib/rabbit-client.js", 44);
    var handler = "function" === typeof arguments[0] ? arguments[0] : RabbitClient.utility.noop;
    _$jscoverage_done("lib/rabbit-client.js", 47);
    RabbitClient.utility.inherits(handler, RabbitClient);
    _$jscoverage_done("lib/rabbit-client.js", 50);
    RabbitClient.utility.settings(handler.prototype);
    _$jscoverage_done("lib/rabbit-client.js", 51);
    RabbitClient.utility.emitter(handler.prototype);
    _$jscoverage_done("lib/rabbit-client.js", 53);
    try {
        _$jscoverage_done("lib/rabbit-client.js", 56);
        handler.prototype.set({
            name: require("../package").name,
            version: require("../package").version,
            directories: require("../package").directories,
            settings: RabbitClient.utility.omit(RabbitClient.utility.defaults(handler, require("../package").config), "super_"),
            environment: process.env.NODE_ENV || "production",
            identity: String(process.pid),
            connection: {}
        });
        _$jscoverage_done("lib/rabbit-client.js", 67);
        if (_$jscoverage_done("lib/rabbit-client.js", 67, "string" === typeof arguments[0])) {
            _$jscoverage_done("lib/rabbit-client.js", 68);
            handler.prototype.set("settings.url", arguments[0]);
        }
        _$jscoverage_done("lib/rabbit-client.js", 72);
        Object.defineProperties(handler.prototype, {
            __queue: {
                value: {},
                enumerable: false,
                writable: true
            }
        });
        _$jscoverage_done("lib/rabbit-client.js", 86);
        context = new handler(null, null, RabbitClient);
        _$jscoverage_done("lib/rabbit-client.js", 89);
        context.validate();
        _$jscoverage_done("lib/rabbit-client.js", 92);
        context.connect();
        _$jscoverage_done("lib/rabbit-client.js", 94);
        context.get("connection").once("ready", function declare_exchanges() {
            _$jscoverage_done("lib/rabbit-client.js", 95);
            context.debug("Connection is ready, declaring Exchange Documents.");
            _$jscoverage_done("lib/rabbit-client.js", 98);
            RabbitClient.Activity.declare({
                name: "activity",
                connection: context.get("connection"),
                version: RabbitClient.version
            });
            _$jscoverage_done("lib/rabbit-client.js", 105);
            RabbitClient.Session.declare({
                name: "session",
                connection: context.get("connection"),
                version: RabbitClient.version
            });
            _$jscoverage_done("lib/rabbit-client.js", 112);
            RabbitClient.Job.declare({
                name: "job",
                connection: context.get("connection"),
                version: RabbitClient.version
            });
        });
    } catch (error) {
        _$jscoverage_done("lib/rabbit-client.js", 121);
        return (new handler(error, RabbitClient)).error(error);
    }
    _$jscoverage_done("lib/rabbit-client.js", 125);
    return context;
}

_$jscoverage_done("lib/rabbit-client.js", 130);
Object.defineProperties(RabbitClient.prototype, {
    error: {
        value: require("./utility").error,
        configurable: true,
        enumerable: false,
        writable: true
    },
    debug: {
        value: require("./utility").debug,
        configurable: true,
        enumerable: true,
        writable: true
    },
    connect: {
        value: function connect() {
            _$jscoverage_done("lib/rabbit-client.js", 151);
            this.debug("Connecting to [%s].", this.get("settings.url"));
            _$jscoverage_done("lib/rabbit-client.js", 153);
            var context = this;
            _$jscoverage_done("lib/rabbit-client.js", 156);
            this.set("connection", RabbitClient.utility.amqp.createConnection({
                host: this.get("settings.host"),
                port: this.get("settings.port"),
                login: this.get("settings.login", "guest"),
                password: this.get("settings.password", "guest"),
                clientProperties: {
                    version: RabbitClient.version,
                    platform: "rabbit-client-" + RabbitClient.version,
                    product: "rabbit-client"
                },
                vhost: this.get("settings.vhost")
            }, {
                defaultExchangeName: this.get("settings.exchænge", "amq.topic"),
                reconnect: this.get("settings.reconnect", true)
            }));
            _$jscoverage_done("lib/rabbit-client.js", 170);
            this.get("connection").on("error", function error(error) {
                _$jscoverage_done("lib/rabbit-client.js", 171);
                context.debug("Connection error: [%s]:[%s]", error.message, error.code);
                _$jscoverage_done("lib/rabbit-client.js", 173);
                context.emit("connection", new Error(error.message), context);
                _$jscoverage_done("lib/rabbit-client.js", 174);
                context.emit("connection.error", new Error(error.message), context);
                _$jscoverage_done("lib/rabbit-client.js", 177);
                if (_$jscoverage_done("lib/rabbit-client.js", 177, error.code === 320)) {}
            });
            _$jscoverage_done("lib/rabbit-client.js", 182);
            this.get("connection").once("ready", function get_exchanges() {
                _$jscoverage_done("lib/rabbit-client.js", 185);
                process.nextTick(function() {
                    _$jscoverage_done("lib/rabbit-client.js", 186);
                    context.emit("connection", null, context);
                    _$jscoverage_done("lib/rabbit-client.js", 187);
                    context.emit("connection.success", null, context);
                });
            });
            _$jscoverage_done("lib/rabbit-client.js", 193);
            this.get("connection").on("close", function close(error) {});
            _$jscoverage_done("lib/rabbit-client.js", 197);
            this.get("connection").on("message", function message(message) {
                _$jscoverage_done("lib/rabbit-client.js", 198);
                console.log("message", message);
            });
            _$jscoverage_done("lib/rabbit-client.js", 202);
            return this;
        },
        enumerable: true,
        writable: true
    },
    destroy: {
        value: function destroy() {
            _$jscoverage_done("lib/rabbit-client.js", 214);
            this.get("connection").destroy();
            _$jscoverage_done("lib/rabbit-client.js", 215);
            return this;
        },
        enumerable: true,
        writable: true
    },
    configure: {
        value: function configure(env, callback) {
            _$jscoverage_done("lib/rabbit-client.js", 232);
            var self = this;
            _$jscoverage_done("lib/rabbit-client.js", 233);
            var envs = "all";
            _$jscoverage_done("lib/rabbit-client.js", 234);
            var args = [].slice.call(arguments);
            _$jscoverage_done("lib/rabbit-client.js", 236);
            callback = args.pop();
            _$jscoverage_done("lib/rabbit-client.js", 238);
            if (_$jscoverage_done("lib/rabbit-client.js", 238, args.length)) {
                _$jscoverage_done("lib/rabbit-client.js", 239);
                envs = args;
            }
            _$jscoverage_done("lib/rabbit-client.js", 242);
            if (_$jscoverage_done("lib/rabbit-client.js", 242, "all" == envs) || _$jscoverage_done("lib/rabbit-client.js", 242, ~envs.indexOf(this.get("environment")))) {
                _$jscoverage_done("lib/rabbit-client.js", 243);
                self.once("connection.success", function() {
                    _$jscoverage_done("lib/rabbit-client.js", 244);
                    this.debug("Calling configuration callback [%s].", callback.name || "no-name");
                    _$jscoverage_done("lib/rabbit-client.js", 246);
                    try {
                        _$jscoverage_done("lib/rabbit-client.js", 247);
                        callback.call(this, this, RabbitClient);
                    } catch (error) {
                        _$jscoverage_done("lib/rabbit-client.js", 249);
                        this.error(error);
                    }
                });
            }
            _$jscoverage_done("lib/rabbit-client.js", 256);
            return this;
        },
        enumerable: true,
        writable: false
    },
    registerActivity: {
        value: function registerActivity(name, handler) {
            _$jscoverage_done("lib/rabbit-client.js", 280);
            this.debug("Registering Activity [%s].", name);
            _$jscoverage_done("lib/rabbit-client.js", 283);
            var instance = RabbitClient.Activity.create(name).subscribe(name, handler);
            _$jscoverage_done("lib/rabbit-client.js", 285);
            return instance;
        },
        enumerable: true,
        writable: false
    },
    processJob: {
        value: function processJob(name, message, handler) {
            _$jscoverage_done("lib/rabbit-client.js", 304);
            if (_$jscoverage_done("lib/rabbit-client.js", 304, !message) && _$jscoverage_done("lib/rabbit-client.js", 304, !handler)) {
                _$jscoverage_done("lib/rabbit-client.js", 308);
                return require("./middleware/process-job").bind({
                    activity: RabbitClient.Activity.create(name),
                    client: this,
                    constructor: RabbitClient
                });
            }
            _$jscoverage_done("lib/rabbit-client.js", 316);
            var job_id = Math.random().toString(36).substring(2);
            _$jscoverage_done("lib/rabbit-client.js", 320);
            RabbitClient.Job.create(job_id).subscribe(job_id, handler);
            _$jscoverage_done("lib/rabbit-client.js", 323);
            RabbitClient.Activity.create(name).publish(name, message, {
                correlationId: job_id
            });
            _$jscoverage_done("lib/rabbit-client.js", 330);
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
        value: function getSession(sid, handler) {
            _$jscoverage_done("lib/rabbit-client.js", 343);
            this.debug("Get Session [%s].", sid);
            _$jscoverage_done("lib/rabbit-client.js", 346);
            return RabbitClient.Session.create(sid).subscribe(sid, handler);
        },
        enumerable: true,
        writable: true
    },
    validate: {
        value: function validate() {
            _$jscoverage_done("lib/rabbit-client.js", 364);
            if (_$jscoverage_done("lib/rabbit-client.js", 364, this.get("settings.url")) || _$jscoverage_done("lib/rabbit-client.js", 364, process.env.RABBIT_URL)) {
                _$jscoverage_done("lib/rabbit-client.js", 366);
                var _parse = RabbitClient.utility.url_parse(this.get("settings.url") || process.env.RABBIT_URL);
                _$jscoverage_done("lib/rabbit-client.js", 368);
                this.set("settings", RabbitClient.utility.defaults(this.get("settings"), {
                    host: _parse.hostname,
                    port: _parse.port,
                    login: _parse.auth ? _parse.auth.split(":")[0] : "",
                    password: _parse.auth ? _parse.auth.split(":")[1] : "",
                    vhost: _parse.pathname || "/"
                }));
            }
            _$jscoverage_done("lib/rabbit-client.js", 379);
            if (_$jscoverage_done("lib/rabbit-client.js", 379, !this.get("settings.host"))) {
                _$jscoverage_done("lib/rabbit-client.js", 380);
                this.set("settings.host", process.env.RABBIT_HOST);
            }
            _$jscoverage_done("lib/rabbit-client.js", 384);
            if (_$jscoverage_done("lib/rabbit-client.js", 384, !this.get("settings.port"))) {
                _$jscoverage_done("lib/rabbit-client.js", 385);
                this.set("settings.port", process.env.RABBIT_PORT);
            }
            _$jscoverage_done("lib/rabbit-client.js", 389);
            if (_$jscoverage_done("lib/rabbit-client.js", 389, !this.get("settings.login"))) {
                _$jscoverage_done("lib/rabbit-client.js", 390);
                this.set("settings.login", process.env.RABBIT_LOGIN);
            }
            _$jscoverage_done("lib/rabbit-client.js", 394);
            if (_$jscoverage_done("lib/rabbit-client.js", 394, !this.get("settings.password"))) {
                _$jscoverage_done("lib/rabbit-client.js", 395);
                this.set("settings.password", process.env.RABBIT_LOGIN);
            }
            _$jscoverage_done("lib/rabbit-client.js", 399);
            if (_$jscoverage_done("lib/rabbit-client.js", 399, !this.get("settings.url"))) {
                _$jscoverage_done("lib/rabbit-client.js", 400);
                this.set("settings.url", [ "amqp://", this.get("settings.host"), ":", this.get("settings.port"), this.get("settings.vhost") ].join(""));
            }
            _$jscoverage_done("lib/rabbit-client.js", 404);
            return this;
        },
        enumerable: false,
        writable: true
    }
});

_$jscoverage_done("lib/rabbit-client.js", 413);
Object.defineProperties(module.exports = RabbitClient, {
    create: {
        value: function create(handler) {
            _$jscoverage_done("lib/rabbit-client.js", 423);
            return new RabbitClient(handler);
        },
        enumerable: true,
        writable: false
    },
    Activity: {
        value: require("./exchange/activity"),
        configurable: false,
        enumerable: true,
        writable: false
    },
    Exchange: {
        value: require("./exchange"),
        configurable: false,
        enumerable: true,
        writable: false
    },
    Job: {
        value: require("./exchange/job"),
        configurable: false,
        enumerable: true,
        writable: false
    },
    Session: {
        value: require("./exchange/session"),
        enumerable: true,
        writable: false
    },
    sessionStore: {
        value: function sessionStore(connect) {
            _$jscoverage_done("lib/rabbit-client.js", 461);
            var Store = connect.session.Store;
            function rabbitStore(options) {
                _$jscoverage_done("lib/rabbit-client.js", 470);
                var self = this;
                _$jscoverage_done("lib/rabbit-client.js", 472);
                options = options || {};
                _$jscoverage_done("lib/rabbit-client.js", 474);
                Store.call(this, options);
                _$jscoverage_done("lib/rabbit-client.js", 476);
                this.prefix = null == options.prefix ? "sess:" : options.prefix;
                _$jscoverage_done("lib/rabbit-client.js", 478);
                this.client = options.client || new RabbitClient.create(options.port || options.socket, options.host, options);
                _$jscoverage_done("lib/rabbit-client.js", 480);
                self.client.on("error", function() {
                    _$jscoverage_done("lib/rabbit-client.js", 481);
                    self.emit("disconnect");
                });
                _$jscoverage_done("lib/rabbit-client.js", 484);
                self.client.on("connect", function() {
                    _$jscoverage_done("lib/rabbit-client.js", 485);
                    self.emit("connect");
                });
            }
            _$jscoverage_done("lib/rabbit-client.js", 491);
            rabbitStore.prototype.__proto__ = Store.prototype;
            _$jscoverage_done("lib/rabbit-client.js", 497);
            Object.defineProperties(rabbitStore.prototype, {
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
                }
            });
            _$jscoverage_done("lib/rabbit-client.js", 519);
            return rabbitStore;
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    startService: {
        get: function startService() {
            _$jscoverage_done("lib/rabbit-client.js", 535);
            var _service;
            _$jscoverage_done("lib/rabbit-client.js", 537);
            try {
                _$jscoverage_done("lib/rabbit-client.js", 538);
                _service = require("rabbit-service");
                _$jscoverage_done("lib/rabbit-client.js", 540);
                if (_$jscoverage_done("lib/rabbit-client.js", 540, "function" !== typeof _service.create)) {
                    _$jscoverage_done("lib/rabbit-client.js", 541);
                    throw new Error("Rabbit Service not loaded.");
                }
            } catch (error) {
                _$jscoverage_done("lib/rabbit-client.js", 545);
                return {};
            }
            _$jscoverage_done("lib/rabbit-client.js", 548);
            return _service.create;
        },
        enumerable: true
    },
    utility: {
        value: require("./utility"),
        enumerable: false,
        writable: false
    },
    version: {
        value: require("../package").version,
        enumerable: true,
        writable: false
    }
});