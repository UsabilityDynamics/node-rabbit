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
_$jscoverage_init(_$jscoverage, "lib/client/correlation.js",[14,15,18,38,69,70,72,75,80,91,101,127]);
_$jscoverage_init(_$jscoverage_cond, "lib/client/correlation.js",[14]);
_$jscoverage["lib/client/correlation.js"].source = ["/**"," * Correlation Response Stream"," *"," * -"," *"," * @constructor"," * @chainable"," * @author potanin"," * @date 8/10/13"," */","function Correlation( data ) {","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof Correlation ) ) {","    return new Correlation( data );","  }","","  Object.defineProperties( this, {","    id: {","      value: Math.random().toString( 36 ).substring( 2 ),","      enumerable: true,","      configurable: true,","      writable: false","    },","    job_key: {","      value: data.job_key,","      writable: true,","      enumerable: true,","      configurable: true","    },","    activity_type: {","      value: data.activity_type,","      enumerable: true,","      writable: false,","      configurable: true","    },","    key: {","      get: function() { return [ 'correlation', this.id ].join( '.' ) },","      enumerable: true,","      configurable: true","    },","    sid: {","      value: data.sid,","      enumerable: true,","      writable: true,","      configurable: true","    },","    mid: {","      value: data.mid,","      enumerable: true,","      writable: true,","      configurable: true","    },","    format: {","      value: data.format,","      enumerable: true,","      writable: true,","      configurable: true","    },","    debug: {","      value: require( 'debug' )( [ 'rabbit', 'client', 'correlation', data.activity_type ].join( ':' ) ),","      enumerable: true,","      configurable: true,","      writable: true","    }","  })","","  // Mixin Settings and EventEmitter","  Correlation.utility.settings( this );","  Correlation.utility.emitter( this );","","  this.debug( 'Created new correlation [%s].', this.id );","","  // @chainable","  return this;","","}","","// Rabbit Correlation prototype properties.","Object.defineProperties( Correlation.prototype, {","  timeout: {","    /**","     * Correlation job timeout.","     *","     * @todo -","     * @returns {*}","     */","    value: function timeout() {","","      // @chainable","      return this;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});","","// Rabit Correlation constructor properties.","Object.defineProperties( module.exports = Correlation, {","  Rabbit: {","    value: require( '../rabbit-client' ),","    enumerable: false,","    configurable: true,","    writable: true","  },","  Job: {","    value: require( './job' ),","    enumerable: false,","    configurable: true,","    writable: true","  },","  utility: {","    value: require( '../utility' ),","    enumerable: false,","    writable: true,","    configurable: true","  },","  create: {","    /**","     *","     * @param data","     * @returns {Correlation}","     */","    value: function create( data ) {","      return new Correlation( data );","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});","",""];
function Correlation(data) {
    _$jscoverage_done("lib/client/correlation.js", 14);
    if (_$jscoverage_done("lib/client/correlation.js", 14, !(this instanceof Correlation))) {
        _$jscoverage_done("lib/client/correlation.js", 15);
        return new Correlation(data);
    }
    _$jscoverage_done("lib/client/correlation.js", 18);
    Object.defineProperties(this, {
        id: {
            value: Math.random().toString(36).substring(2),
            enumerable: true,
            configurable: true,
            writable: false
        },
        job_key: {
            value: data.job_key,
            writable: true,
            enumerable: true,
            configurable: true
        },
        activity_type: {
            value: data.activity_type,
            enumerable: true,
            writable: false,
            configurable: true
        },
        key: {
            get: function() {
                _$jscoverage_done("lib/client/correlation.js", 38);
                return [ "correlation", this.id ].join(".");
            },
            enumerable: true,
            configurable: true
        },
        sid: {
            value: data.sid,
            enumerable: true,
            writable: true,
            configurable: true
        },
        mid: {
            value: data.mid,
            enumerable: true,
            writable: true,
            configurable: true
        },
        format: {
            value: data.format,
            enumerable: true,
            writable: true,
            configurable: true
        },
        debug: {
            value: require("debug")([ "rabbit", "client", "correlation", data.activity_type ].join(":")),
            enumerable: true,
            configurable: true,
            writable: true
        }
    });
    _$jscoverage_done("lib/client/correlation.js", 69);
    Correlation.utility.settings(this);
    _$jscoverage_done("lib/client/correlation.js", 70);
    Correlation.utility.emitter(this);
    _$jscoverage_done("lib/client/correlation.js", 72);
    this.debug("Created new correlation [%s].", this.id);
    _$jscoverage_done("lib/client/correlation.js", 75);
    return this;
}

_$jscoverage_done("lib/client/correlation.js", 80);
Object.defineProperties(Correlation.prototype, {
    timeout: {
        value: function timeout() {
            _$jscoverage_done("lib/client/correlation.js", 91);
            return this;
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});

_$jscoverage_done("lib/client/correlation.js", 101);
Object.defineProperties(module.exports = Correlation, {
    Rabbit: {
        value: require("../rabbit-client"),
        enumerable: false,
        configurable: true,
        writable: true
    },
    Job: {
        value: require("./job"),
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
            _$jscoverage_done("lib/client/correlation.js", 127);
            return new Correlation(data);
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});