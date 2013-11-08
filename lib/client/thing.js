function Thing( handler ) {



}

Object.defineProperties( Thing.prototype, {
  get_exchange: {
    /**
     *
     * @param name {String} Name of exchange to connection to.
     * @returns {*|error|string}
     */
    value: function get_exchange( name ) {

      var self = this;

      if( !this.get( 'connection.exchange' ) ) {
        throw new Error( 'Attempted to bind to an exchange before connection being ready.' );
      }

      // Exchange Options.
      var _options = {
        type: 'direct',
        durable: true,
        confirm: false,
        passive: false,
        noDeclare: false, // @important If true will not create new exchange on first connection.
        autoDelete: false,
        arguments: {
          created: new Date().getTime()
        }
      };

      // Create/Update Exchange.
      return this.get( 'connection' ).exchange( name, _options, function have_exchange() {
        self.debug( 'Connection to [%s] established.', this.name );
      });

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  request: {
    /**
     *
     * @param activity_type {String}
     * @param message
     * @param headers
     * @param info
     * @param queue
     */
    value: function request( activity_type, message, headers, info, queue ) {
      this.debug( 'Handling incoming work request for job [%s] in [%s] exchange.', activity_type, this.get( 'exchange.name' ) );

      // Create Job instance from incoming message.
      var job = RabbitClient.Job.create({
        id: info.messageId,
        exchange: this.get( 'exchange' ),
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

      // Call the Job Worker callback.
      try {

        this.__activities[ job.type ].call( job, job.message, function complete_wrapper( error, response ) {
          return job.complete( error, response );
        });

      } catch( error ) { return this.error( error ); }

      // @chainable
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
})

Object.defineProperties( module.exports = Thing, {
  create: {
    value: function create() {},
    enumerable: true,
    configurable: true,
    writable: true
  }
});