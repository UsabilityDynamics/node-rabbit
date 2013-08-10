/**
 * Mocha Test for Rabbit api
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 8/10/13
 * @type {Object}
 */
module.exports = {

  'before': function() {
    require( 'colors' );
  },

  'Rabbit API': {

    /**
     *
     */
    'has expected properties.': function() {
      var Rabbit = require( '../' );

      // Constructor properties.
      Rabbit.should.have.property( 'debug' );
      Rabbit.should.have.property( 'request' );
      Rabbit.should.have.property( 'amqp' );
      Rabbit.should.have.property( 'extend' );
      Rabbit.should.have.property( 'defaults' );
      Rabbit.should.have.property( 'prototype' );
      Rabbit.should.have.property( 'createConnection' );

      // Prototype properties.
      Rabbit.prototype.should.have.property( 'defineJob' );
      Rabbit.prototype.should.have.property( 'runJob' );
      Rabbit.prototype.should.have.property( 'message' );

      // Shortcuts.
      Rabbit.prototype.should.have.property( 'define' );
      Rabbit.prototype.should.have.property( 'run' );

      // Message properties.
      Rabbit.prototype.message.prototype.should.have.property( 'pack' );
      Rabbit.prototype.message.prototype.should.have.property( 'unpack' );

    },

    'can establish a RabbitMQ connection.': function( done ) {
      this.timeout( 5000 );

      var Rabbit = require( '../' );

      var Client = require( '../' ).createConnection({
        login: 'demo',
        password: 'demo'
      });

      Client.once( 'connection.success', function() {
        done();
      });

      Client.once( 'connection.error', function( error, data ) {
        //console.log( this.event.magenta, error.message.red );
        done();
      });

    }

  }

};