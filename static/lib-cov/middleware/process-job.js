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
_$jscoverage_init(_$jscoverage, "lib/middleware/process-job.js",[13,15,16,17,19,21,27]);
_$jscoverage_init(_$jscoverage_cond, "lib/middleware/process-job.js",[]);
_$jscoverage["lib/middleware/process-job.js"].source = ["/**"," * Express Middleware Handler"," *"," * - activity - Activity this middleware instance is handling."," * - client - Rabbit Client instance."," * - constructor - Rabbit Client module."," *"," * @param req"," * @param res"," * @param next"," */","function processJob( req, res, next ) {","  console.log( 'Having Activity request [%s].', this.activity.name );","","  var activity      = this.activity;","  var client        = this.client;","  var RabbitClient  = this.RabbitClient;","","  client.processJob( activity.name, { name: 'andy' }, function jobHandler() {","","    res.send( this.request.get( 'body' ) );","","  });","","}","","module.exports = processJob;",""];
function processJob(req, res, next) {
    _$jscoverage_done("lib/middleware/process-job.js", 13);
    console.log("Having Activity request [%s].", this.activity.name);
    _$jscoverage_done("lib/middleware/process-job.js", 15);
    var activity = this.activity;
    _$jscoverage_done("lib/middleware/process-job.js", 16);
    var client = this.client;
    _$jscoverage_done("lib/middleware/process-job.js", 17);
    var RabbitClient = this.RabbitClient;
    _$jscoverage_done("lib/middleware/process-job.js", 19);
    client.processJob(activity.name, {
        name: "andy"
    }, function jobHandler() {
        _$jscoverage_done("lib/middleware/process-job.js", 21);
        res.send(this.request.get("body"));
    });
}

_$jscoverage_done("lib/middleware/process-job.js", 27);
module.exports = processJob;