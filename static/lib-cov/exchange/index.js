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
_$jscoverage_init(_$jscoverage, "lib/exchange/index.js",[8,9,13,21,26,85,111,114,131,142,144,145,148,162,166,168,169,170,173,176,222,227,228,229,230,231,233,234,237,238,241,242,245,263,264,267,268,269,272,281,284,287,288,291,292,296,298,299,302,303,307,329,344,358,360,361,365,384,386,387,390,391,392,394,407,408,411,413,414,417,420,430,438,439,442,443,446,447,450,477,478,481,482,485,486,489,490,494,495,497,509,515,560,579,584]);
_$jscoverage_init(_$jscoverage_cond, "lib/exchange/index.js",[8,144,168,263,263,291,298,302,360,360,386,386,407,438,442,446,477,481,485,489]);
_$jscoverage["lib/exchange/index.js"].source = ["/**"," *"," * @param handler"," * @constructor"," */","function Exchange( name ) {","","  if( !this.connection ) {","    console.log( 'Exchange can not be properly instantiated until the connection is set.' );","  }","","  // Lockin Activity Instance Name","  Object.defineProperty( this, 'name', {","    value: name,","    enumerable: true,","    configurable: false,","    writable: false","  });","","  // @chainable","  return this;","","}","","// Exchange Instance Properties.","Object.defineProperties( Exchange.prototype, {","  name: {","    /**","     * Activity Name","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  type: {","    /**","     * Activity Group / Type","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  connection: {","    /**","     * Activity Connection","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  exchange: {","    /**","     * Activity Exchange","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  request: {","    /**","     * Exchange Request Object","     *","     */","    value: {","      auth: function auth() {},","      param: function param() {},","      kill: function kill() {","","        this.queue.destroy({","          ifUnused: false,","          ifEmpty: false","        });","","      },","      on: function on() {}","    },","    configurable: true,","    enumerable: true,","    writable: true","  },","  response: {","    /**","     * Exchange Response Object","     *","     */","    value: {","      /**","       * Update Progress.","       *","       * @method progress","       * @param string","       * @returns {*}","       */","      progress: function progress( value, message ) {","        this.debug( 'Updating progress job type [%s]. Responding to CQ [%s].', this.routing, this.correlation_key );","","        // Publish progress message to module.exports Queue.","        this.exchange.publish( this.correlation_key, {","          progress: value,","          message: message instanceof Error ? message.message : message","        }, {","          messageId: this.id,","          contentType: this.format,","          type: this.correlation_key,","          deliveryMode: 2,","          headers: {","            event: 'progress',","            is_error: error instanceof Error ? true : false,","            correlation_key: this.correlation_key,","            job_type: this.type","          }","        });","","        // @chainable","        return this;","","      },","      /**","       * Complete Exchange.","       *","       * @method complete","       * @param string","       * @returns {*}","       */","      complete: function complete( error, response ) {","        this.debug( 'Completing job type [%s]. Responding to Exchange Queue [%s].', this.routing, this.correlation_key );","","        if( 'object' !== typeof response ) {","          response = { message: response }","        }","","        require( './job' ).create( this.get( 'headers.correlation-id' ) ).publish(","          this.get( 'headers.correlation-id' ),","          response, {","            type: this.get( 'headers.correlation-id' ),","            deliveryMode: 2,","            headers: {","              event: 'complete',","              is_error: error instanceof Error ? true : false,","              correlation_key: this.get( 'headers.correlation-id' ),","              job_type: this.type","            }","        });","","        // @chainable","        return this;","","      },","      send: function send( message ) {","        console.log( 'Completing job type [%s]. Responding to Exchange Queue [%s].', this.get( 'headers.type' ), this.get( 'headers.correlation-id' ) );","","        if( !this.get( 'headers.correlation-id' ) ) {","          console.log( 'Can not respond - no correlation ID.' );","          return;","        }","","        require( './job' ).create( this.get( 'headers.correlation-id' ) ).publish( this.get( 'headers.correlation-id' ), message );","","        // @chainable","        return this;","","      },","      header: function header() {},","      emit: function emit() {},","      error: function error() {}","    },","    configurable: true,","    enumerable: true,","    writable: true","  },","  create_context: {","    /**","     * Prepare Handler Context to work with incoming message.","     *","     * @param {Object}    message","     * @param {Object}    message.body","     * @param {String}    message.type Job Type","     * @param {Object}    message.headers","     * @param {String}    message.headers.message-id","     * @param {Buffer}    message.headers.delivery-tag","     * @param {String}    message.headers.consumer-tag","     * @param {String}    message.headers.routing-key","     * @param {String}    message.headers.content-type","     * @param {String}    message.headers.delivery-mode","     * @param {String}    message.headers.priority","     * @param {String}    message.headers.correlation-id","     * @param {String}    message.headers.content-encoding","     * @param {Boolean}   message.headers.redelivered","     * @param {String}    message.headers.timestamp","     * @param {String}    message.headers.user-id","     * @param {String}    message.headers.app-id","     * @param {String}    message.headers.cluster-id","     * @param {String}    message.headers.reply-to","     * @param {String}    message.headers.queue","     * @param {String}    message.headers.exchange","     * @param {Function}  message.acknowledge","     * @param {Function}  message.reject","     * @param {Function}  message.shift","     * @param {Object}    message.queue Queue object","     * @param {Object}    message.exchange Exchange object.","     * @param {Function}  handler Callback method provided by subscription method.","     *","     * @returns {*}","     */","    value: function create_context( message,  handler ) {","      this.debug( 'Handling incoming work request for job [%s] in [%s] exchange.', message.type, this.exchange.name );","","      // module.exports.utility.emitter( handler.prototype );","","      // Create Exchange instance from incoming message.","      handler.prototype.type      = message.type;","      handler.prototype.debug     = console.log;","      handler.prototype.queue     = message.queue;","      handler.prototype.request   = this.request;","      handler.prototype.response  = this.response;","","      module.exports.utility.settings( handler.prototype.response );","      module.exports.utility.settings( handler.prototype.request );","","      // Set Request Settings.","      handler.prototype.request.set( 'headers', message.headers );","      handler.prototype.request.set( 'body', message.body );","","      // Set Response Settings.","      handler.prototype.response.set( 'headers', message.headers );","      handler.prototype.response.set( 'body', {} );","","      // Invoke handler","      return new handler( handler.prototype.request, handler.prototype.response );","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  subscribe: {","    /**","     * Subscribe to Pattern","     *","     * @param pattern {String} Defaults to this.name.","     * @param handler {Function} Callback method, if not set will still bind.","     * @param options {Object}","     * @returns {*}","     */","    value: function subscribe( pattern, handler ) {","","      if( !this.connection || !this.exchange ) {","        throw Error( 'Connectedion not ready.' );","      }","","      var self        = this;","      var _queue      = [ this.type, this.name ].join( '.' );","      var _pattern    = pattern || this.name;","","      // Queue Defaults","      var _options = module.exports.utility.defaults( 'object' === typeof ( arguments[2] || arguments[1] ) ? arguments[1] || arguments[2] : {}, {","        \"autoDelete\": true,","        \"closeChannelOnUnsubscribe\": true,","        \"durable\": true,","        \"exclusive\": false,","        \"noDeclare\": false,","        \"passive\": false","      });","","      this.debug( 'Binding [%s:%s] queue to [%s] pattern.', this.type, this.name, _pattern );","","      // Create a self-named queue","      this.connection.queue( _queue, _options, function( queue ) {","","        // Bind Exchange with topic \"pattern\"","        queue.bind( self.exchange, _pattern, function bound() {","          self.debug( \"Created queue [%s] and bound to pattern [%s].\", _queue, _pattern );","        });","","        if( !handler ) {","          return;","        }","","        // Hadle messages.","        queue.subscribe( function( body, headers, info, message ) {","","          if( info.correlationId ) {","            require( './job' ).create( info.correlationId ).subscribe();","          }","","          if( message.contentType === 'application/msgpack' ) {","            body = module.exports.utility.unpack( body )","          }","","            // Setup Headers","          module.exports.utility.extend( headers, {","            \"type\": info.type,","            \"message-id\": info.messageId,","            \"delivery-tag\": info.deliveryTag,","            \"routing-key\": info.routingKey,","            \"consumer-tag\": info.consumerTag,","            \"content-type\": message.contentType,","            \"redelivered\": info.redelivered,","            \"delivery-mode\": info.deliveryMode,","            \"priority\": info.priority,","            \"correlation-id\": info.correlationId,","            \"content-encoding\": info.contentEncoding,","            \"timestamp\": info.timestamp,","            \"user-id\": info.userId,","            \"app-id\": info.appId,","            \"cluster-id\": info.clusterId,","            \"reply-to\": info.replyTo,","            \"exchange\": info.exchange,","            \"queue\": info.queue","          });","","            // Execute Message Context","          self.create_context({","            \"type\": info.type,","            \"body\": body,","            \"headers\": headers,","            \"acknowledge\": message.acknowledge,","            \"reject\": message.reject,","            \"shift\": message.shift,","            \"queue\": message.queue","          }, handler );","","        });","","      });","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true,","    configurable: true","  },","  unsubscribe: {","    /**","     *","     * @param consumer_tag","     * @returns {*}","     */","    value: function unsubscribe( consumer_tag ) {","      this.debug( '%s.unsubscribe(%s)', this.name, consumer_tag );","","      if( !this.connection || !this.exchange ) {","        throw Error( 'Connectedion not ready.' );","      }","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true,","    configurable: true","  },","  publish: {","    /**","     * Publish Message to Exchange","     *","     * @param {String} pattern  AMQP","     * @param {Object} message","     * @param {Object} options.type","     * @param {Object} options.correlationId - Can not be blank if used.","     * @param {Object} options.replyTo - Can not be blank if used.","     * @returns {*}","     */","    value: function publish( routingKey ) {","      this.debug( '%s.publish( %s, %s )', this.constructor.name, routingKey );","","      if( !this.connection || !this.exchange ) {","        throw Error( 'Connection not ready.' );","      }","","      var self    = this;","      var message = arguments[1] || {};","      var options = arguments[2] || {};","","      module.exports.utility.defaults( options, {","        type: this.type,","        messageId: Math.random().toString( 36 ).substring( 2 ),","        contentType: 'application/json',","        deliveryMode: 2,","        headers: {","          confirm: this.exchange.confirm ? true : false,","          correlation: null,","          name: this.name,","          type: this.type","        }","      });","","      if( options.correlationId ) {","        self.debug( '%s.publish( %s, %s ) - Job has a correlation id: [%s].', self.constructor.name, routingKey, options.correlationId  );","      }","","      try {","","        this.exchange.publish( routingKey, message, options ).once( 'ack', function() {","          self.debug( '%s.publish( %s, %s ) - Acknowledged.', self.constructor.name, routingKey );","        });","","      } catch( error ) { console.error( 'Publishing Error:' + error.message ); }","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true,","    configurable: true","  }","});","","// Exchange Constructor Properties.","Object.defineProperties( module.exports = Exchange, {","  create: {","    /**","     *","     * @returns {}","     */","    value: function create() {","","      if( !arguments[0] ) {","        throw new Error( 'Unable to identify constructor.' );","      }","","      if( !this.prototype.pool ) {","        throw new Error( 'Can not create Activity Instance Queue, the Activity Exchange has not been declared.' );","      }","","      if( this.prototype.pool[ arguments[0] ]) {","        return this.prototype.pool[ arguments[0] ];","      }","","      return this.prototype.pool[ arguments[0] ] = new this( arguments[0] ).subscribe();","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  utility: {","    value: require( '../utility' ),","    enumerable: false,","    writable: false","  },","  declare: {","    /**","     * Initialize Prototype","     *","     * @param {Object} settings","     * @param {String} settings.name Name of Exchange, will be set to object type later.","     * @param {String} settings.type Type of Exchange, such as \"fanout\" or \"topic\".","     * @param {String} settings.version","     * @param {Number} settings.expires Expiration timeout for queues.","     *","     * @returns {Function}","     */","    value: function declare( settings ) {","","      // If already registered do nothing.","      if( this.prototype.pool ) {","        return this;","      }","","      if( !settings.name ) {","        throw new Error( 'Can not declare Exchange without a valid name.' );","      }","","      if( !settings.connection ) {","        throw new Error( 'Connection does not seem to be ready.' );","      }","","      if( !settings.connection.exchange ) {","        throw new Error( 'Connection does not have the exchange method.' );","      }","","      // Mixing external prototypes.","      this.utility.settings( this.prototype );","      this.utility.emitter( this.prototype );","","      this.utility.defaults( settings, {","        name: 'exchange',","        type: 'topic',","        expires: undefined,","        autoDelete: true,","        passive: false,","        durable: true,","        confirm: true,","        noDeclare: false","      });","","      // Store Exchange settings.","      this.prototype.set( 'settings', settings );","","      /**","       * Update Prototype Properties.","       *","       */","      Object.defineProperties( this.prototype, {","        pool: {","          /**","           * Instance Pool","           *","           */","          value: {},","          enumerable: false,","          configurable: true,","          writable: true","        },","        type: {","          /**","           * Set Exchange Type - can not be changed","           *","           */","          value: this.prototype.get( 'settings.name' ),","          enumerable: true,","          configurable: false,","          writable: false","        },","        version: {","          /**","           * Set Exchange Type - can not be changed","           *","           */","          value: settings.version,","          enumerable: true,","          configurable: false,","          writable: false","        },","        active: {","          value: true,","          enumerable: true,","          configurable: false,","          writable: true","        },","        connection: {","          value: settings.connection,","          enumerable: false,","          configurable: false,","          writable: false","        }","      });","","      Object.defineProperty( this.prototype, 'exchange', {","        value: settings.connection.exchange( this.prototype[ 'exchange-name' ] = [ 'rc', this.prototype.get( 'settings.name' ), 'topic' ].join( '.' ), {","          arguments: {","            type: this.prototype.get( 'settings.name' ),","            version: this.version || '0.0.0',","            created: new Date().getTime()","          },","          autoDelete: settings.autoDelete,","          confirm: settings.confirm,","          durable: settings.durable,","          noDeclare: settings.noDeclare,","          passive: settings.passive,","          type: this.prototype.get( 'settings.type' )","        }),","        enumerable: false,","        configurable: true,","        writable: false","      });","","      this.prototype.exchange.on( 'open', function open() {","        // Exchange available.","      });","","      // @chainable","      return this;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Exchange(name) {
    _$jscoverage_done("lib/exchange/index.js", 8);
    if (_$jscoverage_done("lib/exchange/index.js", 8, !this.connection)) {
        _$jscoverage_done("lib/exchange/index.js", 9);
        console.log("Exchange can not be properly instantiated until the connection is set.");
    }
    _$jscoverage_done("lib/exchange/index.js", 13);
    Object.defineProperty(this, "name", {
        value: name,
        enumerable: true,
        configurable: false,
        writable: false
    });
    _$jscoverage_done("lib/exchange/index.js", 21);
    return this;
}

_$jscoverage_done("lib/exchange/index.js", 26);
Object.defineProperties(Exchange.prototype, {
    name: {
        value: undefined,
        enumerable: true,
        configurable: true,
        writable: true
    },
    type: {
        value: undefined,
        enumerable: true,
        configurable: true,
        writable: true
    },
    connection: {
        value: undefined,
        enumerable: true,
        configurable: true,
        writable: true
    },
    exchange: {
        value: undefined,
        enumerable: true,
        configurable: true,
        writable: true
    },
    request: {
        value: {
            auth: function auth() {},
            param: function param() {},
            kill: function kill() {
                _$jscoverage_done("lib/exchange/index.js", 85);
                this.queue.destroy({
                    ifUnused: false,
                    ifEmpty: false
                });
            },
            on: function on() {}
        },
        configurable: true,
        enumerable: true,
        writable: true
    },
    response: {
        value: {
            progress: function progress(value, message) {
                _$jscoverage_done("lib/exchange/index.js", 111);
                this.debug("Updating progress job type [%s]. Responding to CQ [%s].", this.routing, this.correlation_key);
                _$jscoverage_done("lib/exchange/index.js", 114);
                this.exchange.publish(this.correlation_key, {
                    progress: value,
                    message: message instanceof Error ? message.message : message
                }, {
                    messageId: this.id,
                    contentType: this.format,
                    type: this.correlation_key,
                    deliveryMode: 2,
                    headers: {
                        event: "progress",
                        is_error: error instanceof Error ? true : false,
                        correlation_key: this.correlation_key,
                        job_type: this.type
                    }
                });
                _$jscoverage_done("lib/exchange/index.js", 131);
                return this;
            },
            complete: function complete(error, response) {
                _$jscoverage_done("lib/exchange/index.js", 142);
                this.debug("Completing job type [%s]. Responding to Exchange Queue [%s].", this.routing, this.correlation_key);
                _$jscoverage_done("lib/exchange/index.js", 144);
                if (_$jscoverage_done("lib/exchange/index.js", 144, "object" !== typeof response)) {
                    _$jscoverage_done("lib/exchange/index.js", 145);
                    response = {
                        message: response
                    };
                }
                _$jscoverage_done("lib/exchange/index.js", 148);
                require("./job").create(this.get("headers.correlation-id")).publish(this.get("headers.correlation-id"), response, {
                    type: this.get("headers.correlation-id"),
                    deliveryMode: 2,
                    headers: {
                        event: "complete",
                        is_error: error instanceof Error ? true : false,
                        correlation_key: this.get("headers.correlation-id"),
                        job_type: this.type
                    }
                });
                _$jscoverage_done("lib/exchange/index.js", 162);
                return this;
            },
            send: function send(message) {
                _$jscoverage_done("lib/exchange/index.js", 166);
                console.log("Completing job type [%s]. Responding to Exchange Queue [%s].", this.get("headers.type"), this.get("headers.correlation-id"));
                _$jscoverage_done("lib/exchange/index.js", 168);
                if (_$jscoverage_done("lib/exchange/index.js", 168, !this.get("headers.correlation-id"))) {
                    _$jscoverage_done("lib/exchange/index.js", 169);
                    console.log("Can not respond - no correlation ID.");
                    _$jscoverage_done("lib/exchange/index.js", 170);
                    return;
                }
                _$jscoverage_done("lib/exchange/index.js", 173);
                require("./job").create(this.get("headers.correlation-id")).publish(this.get("headers.correlation-id"), message);
                _$jscoverage_done("lib/exchange/index.js", 176);
                return this;
            },
            header: function header() {},
            emit: function emit() {},
            error: function error() {}
        },
        configurable: true,
        enumerable: true,
        writable: true
    },
    create_context: {
        value: function create_context(message, handler) {
            _$jscoverage_done("lib/exchange/index.js", 222);
            this.debug("Handling incoming work request for job [%s] in [%s] exchange.", message.type, this.exchange.name);
            _$jscoverage_done("lib/exchange/index.js", 227);
            handler.prototype.type = message.type;
            _$jscoverage_done("lib/exchange/index.js", 228);
            handler.prototype.debug = console.log;
            _$jscoverage_done("lib/exchange/index.js", 229);
            handler.prototype.queue = message.queue;
            _$jscoverage_done("lib/exchange/index.js", 230);
            handler.prototype.request = this.request;
            _$jscoverage_done("lib/exchange/index.js", 231);
            handler.prototype.response = this.response;
            _$jscoverage_done("lib/exchange/index.js", 233);
            module.exports.utility.settings(handler.prototype.response);
            _$jscoverage_done("lib/exchange/index.js", 234);
            module.exports.utility.settings(handler.prototype.request);
            _$jscoverage_done("lib/exchange/index.js", 237);
            handler.prototype.request.set("headers", message.headers);
            _$jscoverage_done("lib/exchange/index.js", 238);
            handler.prototype.request.set("body", message.body);
            _$jscoverage_done("lib/exchange/index.js", 241);
            handler.prototype.response.set("headers", message.headers);
            _$jscoverage_done("lib/exchange/index.js", 242);
            handler.prototype.response.set("body", {});
            _$jscoverage_done("lib/exchange/index.js", 245);
            return new handler(handler.prototype.request, handler.prototype.response);
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    subscribe: {
        value: function subscribe(pattern, handler) {
            _$jscoverage_done("lib/exchange/index.js", 263);
            if (_$jscoverage_done("lib/exchange/index.js", 263, !this.connection) || _$jscoverage_done("lib/exchange/index.js", 263, !this.exchange)) {
                _$jscoverage_done("lib/exchange/index.js", 264);
                throw Error("Connectedion not ready.");
            }
            _$jscoverage_done("lib/exchange/index.js", 267);
            var self = this;
            _$jscoverage_done("lib/exchange/index.js", 268);
            var _queue = [ this.type, this.name ].join(".");
            _$jscoverage_done("lib/exchange/index.js", 269);
            var _pattern = pattern || this.name;
            _$jscoverage_done("lib/exchange/index.js", 272);
            var _options = module.exports.utility.defaults("object" === typeof (arguments[2] || arguments[1]) ? arguments[1] || arguments[2] : {}, {
                autoDelete: true,
                closeChannelOnUnsubscribe: true,
                durable: true,
                exclusive: false,
                noDeclare: false,
                passive: false
            });
            _$jscoverage_done("lib/exchange/index.js", 281);
            this.debug("Binding [%s:%s] queue to [%s] pattern.", this.type, this.name, _pattern);
            _$jscoverage_done("lib/exchange/index.js", 284);
            this.connection.queue(_queue, _options, function(queue) {
                _$jscoverage_done("lib/exchange/index.js", 287);
                queue.bind(self.exchange, _pattern, function bound() {
                    _$jscoverage_done("lib/exchange/index.js", 288);
                    self.debug("Created queue [%s] and bound to pattern [%s].", _queue, _pattern);
                });
                _$jscoverage_done("lib/exchange/index.js", 291);
                if (_$jscoverage_done("lib/exchange/index.js", 291, !handler)) {
                    _$jscoverage_done("lib/exchange/index.js", 292);
                    return;
                }
                _$jscoverage_done("lib/exchange/index.js", 296);
                queue.subscribe(function(body, headers, info, message) {
                    _$jscoverage_done("lib/exchange/index.js", 298);
                    if (_$jscoverage_done("lib/exchange/index.js", 298, info.correlationId)) {
                        _$jscoverage_done("lib/exchange/index.js", 299);
                        require("./job").create(info.correlationId).subscribe();
                    }
                    _$jscoverage_done("lib/exchange/index.js", 302);
                    if (_$jscoverage_done("lib/exchange/index.js", 302, message.contentType === "application/msgpack")) {
                        _$jscoverage_done("lib/exchange/index.js", 303);
                        body = module.exports.utility.unpack(body);
                    }
                    _$jscoverage_done("lib/exchange/index.js", 307);
                    module.exports.utility.extend(headers, {
                        type: info.type,
                        "message-id": info.messageId,
                        "delivery-tag": info.deliveryTag,
                        "routing-key": info.routingKey,
                        "consumer-tag": info.consumerTag,
                        "content-type": message.contentType,
                        redelivered: info.redelivered,
                        "delivery-mode": info.deliveryMode,
                        priority: info.priority,
                        "correlation-id": info.correlationId,
                        "content-encoding": info.contentEncoding,
                        timestamp: info.timestamp,
                        "user-id": info.userId,
                        "app-id": info.appId,
                        "cluster-id": info.clusterId,
                        "reply-to": info.replyTo,
                        exchange: info.exchange,
                        queue: info.queue
                    });
                    _$jscoverage_done("lib/exchange/index.js", 329);
                    self.create_context({
                        type: info.type,
                        body: body,
                        headers: headers,
                        acknowledge: message.acknowledge,
                        reject: message.reject,
                        shift: message.shift,
                        queue: message.queue
                    }, handler);
                });
            });
            _$jscoverage_done("lib/exchange/index.js", 344);
            return this;
        },
        enumerable: true,
        writable: true,
        configurable: true
    },
    unsubscribe: {
        value: function unsubscribe(consumer_tag) {
            _$jscoverage_done("lib/exchange/index.js", 358);
            this.debug("%s.unsubscribe(%s)", this.name, consumer_tag);
            _$jscoverage_done("lib/exchange/index.js", 360);
            if (_$jscoverage_done("lib/exchange/index.js", 360, !this.connection) || _$jscoverage_done("lib/exchange/index.js", 360, !this.exchange)) {
                _$jscoverage_done("lib/exchange/index.js", 361);
                throw Error("Connectedion not ready.");
            }
            _$jscoverage_done("lib/exchange/index.js", 365);
            return this;
        },
        enumerable: true,
        writable: true,
        configurable: true
    },
    publish: {
        value: function publish(routingKey) {
            _$jscoverage_done("lib/exchange/index.js", 384);
            this.debug("%s.publish( %s, %s )", this.constructor.name, routingKey);
            _$jscoverage_done("lib/exchange/index.js", 386);
            if (_$jscoverage_done("lib/exchange/index.js", 386, !this.connection) || _$jscoverage_done("lib/exchange/index.js", 386, !this.exchange)) {
                _$jscoverage_done("lib/exchange/index.js", 387);
                throw Error("Connection not ready.");
            }
            _$jscoverage_done("lib/exchange/index.js", 390);
            var self = this;
            _$jscoverage_done("lib/exchange/index.js", 391);
            var message = arguments[1] || {};
            _$jscoverage_done("lib/exchange/index.js", 392);
            var options = arguments[2] || {};
            _$jscoverage_done("lib/exchange/index.js", 394);
            module.exports.utility.defaults(options, {
                type: this.type,
                messageId: Math.random().toString(36).substring(2),
                contentType: "application/json",
                deliveryMode: 2,
                headers: {
                    confirm: this.exchange.confirm ? true : false,
                    correlation: null,
                    name: this.name,
                    type: this.type
                }
            });
            _$jscoverage_done("lib/exchange/index.js", 407);
            if (_$jscoverage_done("lib/exchange/index.js", 407, options.correlationId)) {
                _$jscoverage_done("lib/exchange/index.js", 408);
                self.debug("%s.publish( %s, %s ) - Job has a correlation id: [%s].", self.constructor.name, routingKey, options.correlationId);
            }
            _$jscoverage_done("lib/exchange/index.js", 411);
            try {
                _$jscoverage_done("lib/exchange/index.js", 413);
                this.exchange.publish(routingKey, message, options).once("ack", function() {
                    _$jscoverage_done("lib/exchange/index.js", 414);
                    self.debug("%s.publish( %s, %s ) - Acknowledged.", self.constructor.name, routingKey);
                });
            } catch (error) {
                _$jscoverage_done("lib/exchange/index.js", 417);
                console.error("Publishing Error:" + error.message);
            }
            _$jscoverage_done("lib/exchange/index.js", 420);
            return this;
        },
        enumerable: true,
        writable: true,
        configurable: true
    }
});

_$jscoverage_done("lib/exchange/index.js", 430);
Object.defineProperties(module.exports = Exchange, {
    create: {
        value: function create() {
            _$jscoverage_done("lib/exchange/index.js", 438);
            if (_$jscoverage_done("lib/exchange/index.js", 438, !arguments[0])) {
                _$jscoverage_done("lib/exchange/index.js", 439);
                throw new Error("Unable to identify constructor.");
            }
            _$jscoverage_done("lib/exchange/index.js", 442);
            if (_$jscoverage_done("lib/exchange/index.js", 442, !this.prototype.pool)) {
                _$jscoverage_done("lib/exchange/index.js", 443);
                throw new Error("Can not create Activity Instance Queue, the Activity Exchange has not been declared.");
            }
            _$jscoverage_done("lib/exchange/index.js", 446);
            if (_$jscoverage_done("lib/exchange/index.js", 446, this.prototype.pool[arguments[0]])) {
                _$jscoverage_done("lib/exchange/index.js", 447);
                return this.prototype.pool[arguments[0]];
            }
            _$jscoverage_done("lib/exchange/index.js", 450);
            return this.prototype.pool[arguments[0]] = (new this(arguments[0])).subscribe();
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    utility: {
        value: require("../utility"),
        enumerable: false,
        writable: false
    },
    declare: {
        value: function declare(settings) {
            _$jscoverage_done("lib/exchange/index.js", 477);
            if (_$jscoverage_done("lib/exchange/index.js", 477, this.prototype.pool)) {
                _$jscoverage_done("lib/exchange/index.js", 478);
                return this;
            }
            _$jscoverage_done("lib/exchange/index.js", 481);
            if (_$jscoverage_done("lib/exchange/index.js", 481, !settings.name)) {
                _$jscoverage_done("lib/exchange/index.js", 482);
                throw new Error("Can not declare Exchange without a valid name.");
            }
            _$jscoverage_done("lib/exchange/index.js", 485);
            if (_$jscoverage_done("lib/exchange/index.js", 485, !settings.connection)) {
                _$jscoverage_done("lib/exchange/index.js", 486);
                throw new Error("Connection does not seem to be ready.");
            }
            _$jscoverage_done("lib/exchange/index.js", 489);
            if (_$jscoverage_done("lib/exchange/index.js", 489, !settings.connection.exchange)) {
                _$jscoverage_done("lib/exchange/index.js", 490);
                throw new Error("Connection does not have the exchange method.");
            }
            _$jscoverage_done("lib/exchange/index.js", 494);
            this.utility.settings(this.prototype);
            _$jscoverage_done("lib/exchange/index.js", 495);
            this.utility.emitter(this.prototype);
            _$jscoverage_done("lib/exchange/index.js", 497);
            this.utility.defaults(settings, {
                name: "exchange",
                type: "topic",
                expires: undefined,
                autoDelete: true,
                passive: false,
                durable: true,
                confirm: true,
                noDeclare: false
            });
            _$jscoverage_done("lib/exchange/index.js", 509);
            this.prototype.set("settings", settings);
            _$jscoverage_done("lib/exchange/index.js", 515);
            Object.defineProperties(this.prototype, {
                pool: {
                    value: {},
                    enumerable: false,
                    configurable: true,
                    writable: true
                },
                type: {
                    value: this.prototype.get("settings.name"),
                    enumerable: true,
                    configurable: false,
                    writable: false
                },
                version: {
                    value: settings.version,
                    enumerable: true,
                    configurable: false,
                    writable: false
                },
                active: {
                    value: true,
                    enumerable: true,
                    configurable: false,
                    writable: true
                },
                connection: {
                    value: settings.connection,
                    enumerable: false,
                    configurable: false,
                    writable: false
                }
            });
            _$jscoverage_done("lib/exchange/index.js", 560);
            Object.defineProperty(this.prototype, "exchange", {
                value: settings.connection.exchange(this.prototype["exchange-name"] = [ "rc", this.prototype.get("settings.name"), "topic" ].join("."), {
                    arguments: {
                        type: this.prototype.get("settings.name"),
                        version: this.version || "0.0.0",
                        created: (new Date).getTime()
                    },
                    autoDelete: settings.autoDelete,
                    confirm: settings.confirm,
                    durable: settings.durable,
                    noDeclare: settings.noDeclare,
                    passive: settings.passive,
                    type: this.prototype.get("settings.type")
                }),
                enumerable: false,
                configurable: true,
                writable: false
            });
            _$jscoverage_done("lib/exchange/index.js", 579);
            this.prototype.exchange.on("open", function open() {});
            _$jscoverage_done("lib/exchange/index.js", 584);
            return this;
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});