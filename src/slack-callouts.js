/**
 * Various Slack callout function used throughout the app.
 * 
 * @author    Slade Solobay
 * @date      2017-06-10 
 */
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')

module.exports = {
    message: function(msg, channel) {
        if (!msg) return;

        slack.chat.postMessage({
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: channel,
            username: 'Insta-Data',
            text: msg
        }, (err, data) => {
            if (err) throw err;

            let txt = _.truncate(data.message.text);

            console.log(`Message sent: "${txt}"`);
        });
    }
};