/**
 * Various Slack API callout function used throughout the app.
 * 
 * @author    Slade Solobay
 * @date      2017-06-10 
 */
'use strict'

const slack = require('slack');
const _ = require('lodash');
const config = require('./config');
const instagramCallouts = require('./instagram-callouts');

/**
 * Process an array of messages from a given Slack channel and find Instagram 
 * shortcodes. 
 * 
 * @author    Slade Solobay
 * @date      2017-06-10 
 */
function processShortCodes(data) {
  let shortcodes = [];
  
  if (data && data.messages)
    for(let message of data.messages) {
        let regexResult = message.text.match(/<https:\/\/www.instagram.com\/p\/(.*)\/>/);
        if (message.type === 'message' && regexResult)
            shortcodes.push(regexResult[1]);
    }

  return shortcodes;
}

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
            if (err) throw err;
            let txt = _.truncate(data.message.text);
            console.log(`Message sent: "${txt}"`);
        });
    },

    getHistory: function(channel, limit) {
        slack.channels.history({
            token: 'xoxp-196638845590-195928722629-195884368228-83cc2a6ddce12b68d0352e1eb0da96a5', 
            channel: channel
        }, (err, data) => {
            if (err) throw err;
            console.log(processShortCodes(data));
        });
    }
};

