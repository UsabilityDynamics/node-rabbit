/**
 * Express Middleware Handler
 *
 * - activity - Activity this middleware instance is handling.
 * - client - Rabbit Client instance.
 * - constructor - Rabbit Client module.
 *
 * @param req
 * @param res
 * @param next
 */
function processJob( req, res, next ) {
  console.log( 'Having Activity request [%s].', this.activity.name );

  var activity      = this.activity;
  var client        = this.client;
  var RabbitClient  = this.RabbitClient;

  client.processJob( activity.name, { name: 'andy' }, function jobHandler() {

    res.send( this.request.get( 'body' ) );

  });

}

module.exports = processJob;
