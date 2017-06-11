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
            token: 'xoxp-196638845590-195928722629-195884368228-83cc2a6ddce12b68d0352e1eb0da96a5',
            icon_emoji: config('ICON_EMOJI'),
            channel: channel,
            username: 'Insta-Data',
            text: msg
        }, (err, data) => {
            console.log(err);
            if (err) throw err;

            let txt = _.truncate(data.message.text);

            console.log(`Message sent: "${txt}"`);
        });
    }
};