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
_$jscoverage_init(_$jscoverage, "lib/client/job.js",[17,18,22,104,105,110,115,125,127,128,131,135,151,153,154,157,161,177,180,197,213,215,216,220,236,246,272]);
_$jscoverage_init(_$jscoverage_cond, "lib/client/job.js",[17,125,127,151,153,215]);
_$jscoverage["lib/client/job.js"].source = ["/**"," * Job Instance"," *"," * -"," *"," * @chainable"," *"," * @param data"," * @returns {*}"," * @constructor"," *"," * @author potanin@UD"," */","function Job( data ) {","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof Job ) ) {","    return new Job( data );","  }","","  // Set Job Properties","  Object.defineProperties( this, {","    id: {","      value: data.id,","      enumerable: true,","      configurable: true,","      writable: true","    },","    debug: {","      value: require( 'debug' )( [ 'rabbit', 'client', 'job', data.type ].join( ':' ) ),","      enumerable: true,","      configurable: true,","      writable: true","    },","    type: {","      value: data.type,","      enumerable: true,","      configurable: true,","      writable: true","    },","    format: {","      value: data.format || 'application/json',","      enumerable: true,","      configurable: true,","      writable: true","    },","    correlation_key: {","      value: data.correlation_key,","      enumerable: true,","      configurable: true,","      writable: true","    },","    client: {","      value: data.client,","      enumerable: true,","      configurable: true,","      writable: true","    },","    routing: {","      value: data.routing,","      enumerable: true,","      configurable: true,","      writable: true","    },","    message: {","      value: this.unpack( data.message ),","      enumerable: true,","      configurable: true,","      writable: true","    },","    meta: {","      value: data.meta,","      enumerable: false,","      configurable: true,","      writable: true","    },","    queue: {","      value: data.queue,","      enumerable: false,","      configurable: true,","      writable: true","    },","    exchange: {","      value: data.exchange,","      enumerable: false,","      configurable: true,","      writable: true","    },","    rabbit: {","      value: data.rabbit,","      enumerable: false,","      configurable: true,","      writable: true","    },","    headers: {","      value: data.headers,","      enumerable: false,","      configurable: true,","      writable: true","    }","  });","","  // Mixin Settings and EventEmitter","  Job.utility.settings( this );","  Job.utility.emitter( this );","","  // console.log( require( 'util' ).inspect( this, { showHidden: false, colors: true, depth: 2 } ) )","","  // @chainable","  return this;","","}","","// Rabbit Job prototype properties.","Object.defineProperties( Job.prototype, {","  pack: {","    /**","     * Pack String","     *","     * @param string","     * @returns {*}","     */","    value: function pack( string ) {","","      if( this.format === 'application/msgpack' ) {","","        if( this.data instanceof Buffer ) {","          this.data = this.data.toString();","        }","","        this.data = Job.utility.msgpack.pack( string || this.data );","","      }","","      return this.data;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  unpack: {","    /**","     * Unpack Message","     *","     * @param string","     * @returns {*}","     */","    value: function unpack( message ) {","","      if( this.format === 'application/msgpack' ) {","","        if( message instanceof Buffer ) {","          message = message.toString();","        }","","        message = Job.utility.msgpack.unpack( message );","","      }","","      return message;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  progress: {","    /**","     * Update Progress.","     *","     * @method progress","     * @param string","     * @returns {*}","     */","    value: function progress( value, message ) {","      this.debug( 'Updating progress job type [%s]. Responding to CQ [%s].', this.routing, this.correlation_key );","","      // Publish progress message to Session Queue.","      this.exchange.publish( this.correlation_key, {","        progress: value,","        message: message instanceof Error ? message.message : message","      }, {","        messageId: this.id,","        contentType: this.format,","        type: this.correlation_key,","        deliveryMode: 2,","        headers: {","          event: 'progress',","          is_error: error instanceof Error ? true : false,","          correlation_key: this.correlation_key,","          job_type: this.type","        }","      });","","      // @chainable","      return this;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  complete: {","    /**","     * Complete Job.","     *","     * @method complete","     * @param string","     * @returns {*}","     */","    value: function complete( error, response ) {","      this.debug( 'Completing job type [%s]. Responding to Session Queue [%s].', this.routing, this.correlation_key );","","      if( 'object' !== typeof response ) {","        response = { message: response }","      }","","      // Publish message to Session Queue","      this.exchange.publish( this.correlation_key, response, {","        messageId: this.id,","        contentType: this.format,","        type: this.correlation_key,","        deliveryMode: 2,","        headers: {","          event: 'complete',","          is_error: error instanceof Error ? true : false,","          correlation_key: this.correlation_key,","          job_type: this.type","        }","      });","","      // @todo Should we force-closure Session Queue?","","      // @chainable","      return this;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});","","// Rabit Job constructor properties.","Object.defineProperties( module.exports = Job, {","  Rabbit: {","    value: require( '../rabbit-client' ),","    enumerable: false,","    configurable: true,","    writable: true","  },","  Correlation: {","    value: require( './correlation' ),","    enumerable: false,","    configurable: true,","    writable: true","  },","  utility: {","    value: require( '../utility' ),","    enumerable: false,","    writable: true,","    configurable: true","  },","  create: {","    /**","     *","     * @param data","     * @returns {Job}","     */","    value: function create( data ) {","      return new Job( data );","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Job(data) {
    _$jscoverage_done("lib/client/job.js", 17);
    if (_$jscoverage_done("lib/client/job.js", 17, !(this instanceof Job))) {
        _$jscoverage_done("lib/client/job.js", 18);
        return new Job(data);
    }
    _$jscoverage_done("lib/client/job.js", 22);
    Object.defineProperties(this, {
        id: {
            value: data.id,
            enumerable: true,
            configurable: true,
            writable: true
        },
        debug: {
            value: require("debug")([ "rabbit", "client", "job", data.type ].join(":")),
            enumerable: true,
            configurable: true,
            writable: true
        },
        type: {
            value: data.type,
            enumerable: true,
            configurable: true,
            writable: true
        },
        format: {
            value: data.format || "application/json",
            enumerable: true,
            configurable: true,
            writable: true
        },
        correlation_key: {
            value: data.correlation_key,
            enumerable: true,
            configurable: true,
            writable: true
        },
        client: {
            value: data.client,
            enumerable: true,
            configurable: true,
            writable: true
        },
        routing: {
            value: data.routing,
            enumerable: true,
            configurable: true,
            writable: true
        },
        message: {
            value: this.unpack(data.message),
            enumerable: true,
            configurable: true,
            writable: true
        },
        meta: {
            value: data.meta,
            enumerable: false,
            configurable: true,
            writable: true
        },
        queue: {
            value: data.queue,
            enumerable: false,
            configurable: true,
            writable: true
        },
        exchange: {
            value: data.exchange,
            enumerable: false,
            configurable: true,
            writable: true
        },
        rabbit: {
            value: data.rabbit,
            enumerable: false,
            configurable: true,
            writable: true
        },
        headers: {
            value: data.headers,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });
    _$jscoverage_done("lib/client/job.js", 104);
    Job.utility.settings(this);
    _$jscoverage_done("lib/client/job.js", 105);
    Job.utility.emitter(this);
    _$jscoverage_done("lib/client/job.js", 110);
    return this;
}

_$jscoverage_done("lib/client/job.js", 115);
Object.defineProperties(Job.prototype, {
    pack: {
        value: function pack(string) {
            _$jscoverage_done("lib/client/job.js", 125);
            if (_$jscoverage_done("lib/client/job.js", 125, this.format === "application/msgpack")) {
                _$jscoverage_done("lib/client/job.js", 127);
                if (_$jscoverage_done("lib/client/job.js", 127, this.data instanceof Buffer)) {
                    _$jscoverage_done("lib/client/job.js", 128);
                    this.data = this.data.toString();
                }
                _$jscoverage_done("lib/client/job.js", 131);
                this.data = Job.utility.msgpack.pack(string || this.data);
            }
            _$jscoverage_done("lib/client/job.js", 135);
            return this.data;
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    unpack: {
        value: function unpack(message) {
            _$jscoverage_done("lib/client/job.js", 151);
            if (_$jscoverage_done("lib/client/job.js", 151, this.format === "application/msgpack")) {
                _$jscoverage_done("lib/client/job.js", 153);
                if (_$jscoverage_done("lib/client/job.js", 153, message instanceof Buffer)) {
                    _$jscoverage_done("lib/client/job.js", 154);
                    message = message.toString();
                }
                _$jscoverage_done("lib/client/job.js", 157);
                message = Job.utility.msgpack.unpack(message);
            }
            _$jscoverage_done("lib/client/job.js", 161);
            return message;
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    progress: {
        value: function progress(value, message) {
            _$jscoverage_done("lib/client/job.js", 177);
            this.debug("Updating progress job type [%s]. Responding to CQ [%s].", this.routing, this.correlation_key);
            _$jscoverage_done("lib/client/job.js", 180);
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
            _$jscoverage_done("lib/client/job.js", 197);
            return this;
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    complete: {
        value: function complete(error, response) {
            _$jscoverage_done("lib/client/job.js", 213);
            this.debug("Completing job type [%s]. Responding to Session Queue [%s].", this.routing, this.correlation_key);
            _$jscoverage_done("lib/client/job.js", 215);
            if (_$jscoverage_done("lib/client/job.js", 215, "object" !== typeof response)) {
                _$jscoverage_done("lib/client/job.js", 216);
                response = {
                    message: response
                };
            }
            _$jscoverage_done("lib/client/job.js", 220);
            this.exchange.publish(this.correlation_key, response, {
                messageId: this.id,
                contentType: this.format,
                type: this.correlation_key,
                deliveryMode: 2,
                headers: {
                    event: "complete",
                    is_error: error instanceof Error ? true : false,
                    correlation_key: this.correlation_key,
                    job_type: this.type
                }
            });
            _$jscoverage_done("lib/client/job.js", 236);
            return this;
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});

_$jscoverage_done("lib/client/job.js", 246);
Object.defineProperties(module.exports = Job, {
    Rabbit: {
        value: require("../rabbit-client"),
        enumerable: false,
        configurable: true,
        writable: true
    },
    Correlation: {
        value: require("./correlation"),
        enumerable: false,
        configurable: true,
        writable: true
    },
    utility: {
        value: require("../utility"),
        enumerable: false,
        writable: true,
        configurable: true
    },
    create: {
        value: function create(data) {
            _$jscoverage_done("lib/client/job.js", 272);
            return new Job(data);
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});