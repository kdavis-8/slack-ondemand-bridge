/**
    * @author Kevin Davis
    * @version 08/27/18
    * @updated v1.0 08/27/18
    */
'use strict';

const opsgenie = require('opsgenie-sdk');
const qs = require('querystring');

exports.handler = function (event, context, callback) {

    const slackToken = process.env.slackToken;
    const params = qs.parse(event.body);

    // token check to make sure that requests come from Slack
    if (params.token !== slackToken) {
        console.error(`Request token (${params.token}) does not match expected`);
        return callback('Invalid request token');
    }

    const opsgenieApiKey = process.env.opsgenieApiKey;

    opsgenie.configure({
        'api_key': opsgenieApiKey
    });

    var create_alert_json = {
        message: params.text,
        entity: "OnDemand Conference Bridge",
        responders: [
            {
            type: "team",
            name: "DGC"
        }
        ]
    };

    opsgenie.alertV2.create(create_alert_json, function (error, alert) {
        if (!error) {
            console.log("Alert creating response is a success!", alert);
            callback(null, "successful");
        } else {
            console.log("Error while trying to create an alert", error);
            callback(error);
        }
    });
};
