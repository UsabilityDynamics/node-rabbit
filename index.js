/**
 * author: imcrthy@UD
 *
 */

module.exports = process.env.APP_COVERAGE ? require( './static/lib-cov/rabbit' ) : require( './lib/rabbit' );
