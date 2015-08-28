module.exports = (function (deps) {
    'use strict';

    var fs = require('fs'),
        kafka = require('kafka-node'),
        Producer = kafka.Producer,
        Consumer= kafka.Consumer,
        prodClient = new kafka.Client('localhost:2181/'),
        consClient = new kafka.Client('localhost:2181/'),
        producer = new Producer(prodClient),
        consumer = new Consumer(consClient, [{topic: 'logs'}]);

    var log = function (logData) {
        var message = {};

        // add data to log
        message.actionId = logData.actionId;
        if (logData.userId) message.userId = logData.userId;
        if (logData.data) message.data = logData.data;

        // send log message off to be packed up for kafka
        logProducer(message);
    };

    var logProducer = function (message) {
        // send payload to 'logs' topic
        var payload = [{
            topic: 'logs',
            messages: JSON.stringify(message)
        }];

        producer.send(payload, function (err, data) {
            if (err) throw new Error('[loggy.js] Unable to send log to Kafka.');
        });
    };

    var logConsumer = function (message) {
        // get log data from kafka
        var rawLogData = message.value;

        try {
            if (!rawLogData) throw Error('[loggy.js] No log data found!');
            var logData = JSON.parse(rawLogData);

            // build string to be logged
            var logString = logData.actionId;
            if (logData.userId) logString += '::' + logData.userId;
            if (logData.data) logString += '->' + JSON.stringify(logData.data);
            logString += '\n';

            // where the magic happens
            fs.appendFile('./app.log', logString, function(err) {
                if (err) throw Error('[loggy.js] Error writing log to file!');
            });
        } catch(e) {
            console.log('[loggy.js] Error writing to log:');
            console.log(e);
        }
    };

    // set up consumer to listen to messages from kafka
    consumer.on('message', logConsumer);

    // return public facing stuff
    return {
        log: log
    };
})();
