Node.js module for RabbitMQ-controlled job and session management.

## Overview

  - [Registering Activities](#creating-activities)
  - [Processing Distributed Jobs](#processing-distributed-jobs)

## Semantics

  - Activity: A defined job handler. 
  - Job: An instance of an activity with parameters, Session ID, timeout limit, etc..
  - Job Request: A message sent to the activity exchange to start an activity (job).
  - Session: Unique identifier for a persistent client.
  - Exchange: Two exchanges are created - "activities" and "sessions"
  - Queue: Multiple queues are created automatically for activity workers, job progress and persistent sessions.
  - Worker: A Node.js service, or cluster of services, that consume job requests.
  - Virtual Host: Organizational unit.

## Registering Activities
Define an activity by specifying a unique name and a callback method.
The activity will be registered within the client and a corresponding queue will be created and associated with the exchange.

If you are familiar with Express you will notice that task handler's "request" and "response" parameters follow many of the same conventions. 

```js
/**
 * On a Worker node we define an Activity Type and a handler method to be invoked for Job Requests.
 *
 * @source examples/basic/register-activity.js
 * @params req {Object} Request object.
 * @params res {Object} Response object.
 */
require( 'rabbit-client' ).registerActivity( 'api/generate-pdf:v1', function generatePDF( req, res ) {

  // Get Header Fields
  this.debug( 'Processing PDF Generation request #[%s] for [%s].', req.get( 'job' ), req.get( 'session' ) );

  // Get a parameter. In practice, this validation should occur on the producer end.
  if( !req.param( 'name' ) ) {
    return res.send( new Error( 'The name field is not specified.' ) );
  }

  // Set some response fields.
  res.set({
    size: 234323,
    template: req.param( 'template', 'default-template' )
  });

  // Send progress update...
  res.send({
    progress: 0.2,
    message: util.format( 'Generating PDF named [%s].', req.param( 'name' )  )
  });

  // Send progress update.
  res.send({
    progress: 0.2,
    message: util.format( 'Generation complete; uploading to GS Bucket [%s].', req.param( 'bucket' ) )
  });

  // Test if we are passed the timeout limit - meaning the client is no longer expected to be online
  if( this.time > req.get( 'timeout' ) ) {
    this.debug( 'PDF Generation request for #[%s] took too long...', req.get( 'job' ) );
  }

  // Send final response.
  res.send({
    progress: 1,
    message: "PDF File generated.",
    url: "http://commondatastorage.googleapis.com/static.saas.usabilitydynamics.com/sample.pdf"
  });

});
```

## Processing Distributed Jobs
The registered activities may then be started from any Rabbit Client that is connected to the broker where an activity was registered.

```js
/**
 * Job Handler
 *
 * @source examples/basic/job-job-handler.js
 */
function jobHandler( req, res ) {
  this.debug( 'Starting PDF Generation job.' );

  // Receive a message from Activity Worker on the other side of the world.
  this.on( 'message', function message( error, data ) {
    this.debug( 'PDF Generation job complete in [s].', this.time );
    console.log( 'Job Message: [%s]', error ? error.message : data.message );
  });

  // Completion event - could be an error
  this.on( 'complete', function complete( error, data ) {
    this.debug( 'PDF Generation job complete in [s].', this.time );
    console[ error ? 'error' : 'log' ]( error || data );
  });

}

client.processJob( 'api/generate-pdf:v1', {
  name: "My Invoice",
  template: "invoice",
  amount: 50
}, jobHandler );

```

```js
/**
 * Instantiate Express
 *
 * @source examples/basic/express-middleware.js
 * @type {*|configure|app}
 */
var app = require( 'express' ).call().configure( function() {

  // Create Rabbit Client instance
  var client = require( 'rabbit-client' ).create( 'amqp://user:password@localhost:11300/my-vhost' );

  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.logger() );
  app.use( express.static( 'public' ) );

  // Add Rabbit Client task handlers as middleware.
  app.use( '/api/generate-pdf', client.processJob( 'api/generate-pdf:v1' ) );
  app.use( '/api/validate-key', client.processJob( 'api/validate-key:v2' ) );
  app.use( '/api/analyze-site', client.processJob( 'api/analyze-site:v1' ) );

  app.use( app.router );
  app.use( express.errorHandler() );

  app.listen( 3000 );

  module.exports = this;

});
```

## Exchanges
In AMQP protocol, specifically RabbitMQ, all messages are published to an exchange.
Once in the Exchange various rules route messages to a queue or another exchange.
If the broker is unable to route a message it will be dropped.

  - Activity Exchange: Routes Work Requests to appropriate queue(s).
  - Session Exchange: Routes Job Progress and Session messages to appropriate queue(s).
  
## Queue Types

  - Work Requests Queue: Queues created for each activity type and monitored by worker nodes.
  - Job Correlation Queue: Temporary queue for messages pertaining to a specific Job ID.
  - Session Queue: Created for each persistent session. Job correlation messages are routed here if client is not available.

## Message Types

  - Work Request: Send to Activity Exchange and routed to an Activity Work Requests Queue.
  - Job Progress: Sent to Session Exchange and routed to a temporary Job Correlation Queue.
  - Session: Sent to Session Exchange and routed to a persistent Session Queue.

## Developing and Debuging

  - All objects have get/set methods; all instance properties should be stored via these methods.
  - The environment variable RABBIT_URL can be used as a default URL. e.g. "amqp://guest:guest@localhost:5672/"
  - The module uses the debug module and emits logs in the "rabbit:client" namespace.

## Resources
  - [AMQP Concepts](http://www.rabbitmq.com/tutorials/amqp-concepts.html)

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
