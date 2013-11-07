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

```js
// On a Worker node.
client.registerActivity( 'generate-pdf', function generatePDF() {


});
```
## Processing Distributed Jobs
The registered activities may then be started from any Rabbit Client that is connected to the broker where an activity was registered.
client.startActivity( 'generate-pdf', function generatePDF() {


});


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

## Environment Variables

  - RABBIT_URL - e.g. amqp://guest:guest@localhost:5672/

## Debugging
The module uses the debug module and emits logs in the "rabbit:client" namespace.

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
