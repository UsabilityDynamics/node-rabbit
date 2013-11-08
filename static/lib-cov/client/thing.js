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
_$jscoverage_init(_$jscoverage, "lib/client/thing.js",[7,16,18,19,23,36,37,55,58,81,83,84,87,90,123]);
_$jscoverage_init(_$jscoverage_cond, "lib/client/thing.js",[18]);
_$jscoverage["lib/client/thing.js"].source = ["function Thing( handler ) {","","","","}","","Object.defineProperties( Thing.prototype, {","  get_exchange: {","    /**","     *","     * @param name {String} Name of exchange to connection to.","     * @returns {*|error|string}","     */","    value: function get_exchange( name ) {","","      var self = this;","","      if( !this.get( 'connection.exchange' ) ) {","        throw new Error( 'Attempted to bind to an exchange before connection being ready.' );","      }","","      // Exchange Options.","      var _options = {","        type: 'direct',","        durable: true,","        confirm: false,","        passive: false,","        noDeclare: false, // @important If true will not create new exchange on first connection.","        autoDelete: false,","        arguments: {","          created: new Date().getTime()","        }","      };","","      // Create/Update Exchange.","      return this.get( 'connection' ).exchange( name, _options, function have_exchange() {","        self.debug( 'Connection to [%s] established.', this.name );","      });","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  request: {","    /**","     *","     * @param activity_type {String}","     * @param message","     * @param headers","     * @param info","     * @param queue","     */","    value: function request( activity_type, message, headers, info, queue ) {","      this.debug( 'Handling incoming work request for job [%s] in [%s] exchange.', activity_type, this.get( 'exchange.name' ) );","","      // Create Job instance from incoming message.","      var job = RabbitClient.Job.create({","        id: info.messageId,","        exchange: this.get( 'exchange' ),","        type: info.type,","        client: info.replyTo,","        message: message,","        format: info.contentType,","        routing: info.routingKey,","        correlation_key: headers.correlation_key,","        meta: {","          exchange: info.exchange,","          appId: info.appId,","          correlation: info.correlationId,","          mode: info.deliveryMode,","          consumer: info.consumerTag,","          redelivered: info.redelivered","        },","        queue: queue,","        headers: headers,","        rabbit: this","      });","","      // Call the Job Worker callback.","      try {","","        this.__activities[ job.type ].call( job, job.message, function complete_wrapper( error, response ) {","          return job.complete( error, response );","        });","","      } catch( error ) { return this.error( error ); }","","      // @chainable","      return this;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  on: {","    value: function on() {},","    enumerable: true,","    configurable: true,","    writable: true","  },","  off: {","    value: function off() {},","    enumerable: true,","    configurable: true,","    writable: true","  },","  emit: {","    value: function emit() {},","    enumerable: true,","    configurable: true,","    writable: true","  },","  exchange: {","    value: function on() {},","    enumerable: true,","    configurable: true,","    writable: true","  }","})","","Object.defineProperties( module.exports = Thing, {","  create: {","    value: function create() {},","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Thing(handler) {}

_$jscoverage_done("lib/client/thing.js", 7);
Object.defineProperties(Thing.prototype, {
    get_exchange: {
        value: function get_exchange(name) {
            _$jscoverage_done("lib/client/thing.js", 16);
            var self = this;
            _$jscoverage_done("lib/client/thing.js", 18);
            if (_$jscoverage_done("lib/client/thing.js", 18, !this.get("connection.exchange"))) {
                _$jscoverage_done("lib/client/thing.js", 19);
                throw new Error("Attempted to bind to an exchange before connection being ready.");
            }
            _$jscoverage_done("lib/client/thing.js", 23);
            var _options = {
                type: "direct",
                durable: true,
                confirm: false,
                passive: false,
                noDeclare: false,
                autoDelete: false,
                arguments: {
                    created: (new Date).getTime()
                }
            };
            _$jscoverage_done("lib/client/thing.js", 36);
            return this.get("connection").exchange(name, _options, function have_exchange() {
                _$jscoverage_done("lib/client/thing.js", 37);
                self.debug("Connection to [%s] established.", this.name);
            });
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    request: {
        value: function request(activity_type, message, headers, info, queue) {
            _$jscoverage_done("lib/client/thing.js", 55);
            this.debug("Handling incoming work request for job [%s] in [%s] exchange.", activity_type, this.get("exchange.name"));
            _$jscoverage_done("lib/client/thing.js", 58);
            var job = RabbitClient.Job.create({
                id: info.messageId,
                exchange: this.get("exchange"),
                type: info.type,
                client: info.replyTo,
                message: message,
                format: info.contentType,
                routing: info.routingKey,
                correlation_key: headers.correlation_key,
                meta: {
                    exchange: info.exchange,
                    appId: info.appId,
                    correlation: info.correlationId,
                    mode: info.deliveryMode,
                    consumer: info.consumerTag,
                    redelivered: info.redelivered
                },
                queue: queue,
                headers: headers,
                rabbit: this
            });
            _$jscoverage_done("lib/client/thing.js", 81);
            try {
                _$jscoverage_done("lib/client/thing.js", 83);
                this.__activities[job.type].call(job, job.message, function complete_wrapper(error, response) {
                    _$jscoverage_done("lib/client/thing.js", 84);
                    return job.complete(error, response);
                });
            } catch (error) {
                _$jscoverage_done("lib/client/thing.js", 87);
                return this.error(error);
            }
            _$jscoverage_done("lib/client/thing.js", 90);
            return this;
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    on: {
        value: function on() {},
        enumerable: true,
        configurable: true,
        writable: true
    },
    off: {
        value: function off() {},
        enumerable: true,
        configurable: true,
        writable: true
    },
    emit: {
        value: function emit() {},
        enumerable: true,
        configurable: true,
        writable: true
    },
    exchange: {
        value: function on() {},
        enumerable: true,
        configurable: true,
        writable: true
    }
});

_$jscoverage_done("lib/client/thing.js", 123);
Object.defineProperties(module.exports = Thing, {
    create: {
        value: function create() {},
        enumerable: true,
        configurable: true,
        writable: true
    }
});