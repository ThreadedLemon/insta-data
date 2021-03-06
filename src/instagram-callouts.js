/**
 * Various Instagram API callout function used throughout the app.
 * 
 * @author    Slade Solobay
 * @date      2017-06-10 
 */
'use strict'

const config = require('./config');
const Horseman = require('node-horseman');
const url = require('url');
const Instagram = require('instagram-api');

var instagram;
var mediaMap = {}; // Map likes and comments to media Id

function getLikes(mediaId) {
    instagram.mediaLikes(mediaId).then((result => {
        var data = result.data;
        if (data) {
            for (var like of data) {
                mediaMap[mediaId].likes.add(like.username);
            }
        }
    }));
}

function getComments(mediaId) {
    instagram.mediaComments(mediaId).then((result => {
        var data = result.data;
        if (data) {
            for (var comment of data) {
                mediaMap[mediaId].comments.add(comment.from.username);
            }

            console.log(mediaMap);
        }
    }));
}


module.exports = {
    /**
     * Generates an Instagram access token based on the configuration integration user. Utilizes 
     * Horseman and phantomjs to execute a headless browser session.
     * 
     * @author    Slade Solobay
     * @date      2017-06-10
     */
    generateAccessToken: function() {
        var horseman = new Horseman();

        horseman.open(`https://api.instagram.com/oauth/authorize/?client_id=eb2a475895d74b7fb0611dfd918e99c2&redirect_uri=https://insta-data.herokuapp.com/&response_type=token`)
            .on('urlChanged', (targetUrl) => {
                instagram = new Instagram(url.parse(targetUrl).hash.slice(14))
            })
            .value('input[name="username"]', config.INSTAGRAM_INTEGRATION_USERNAME)
            .value('input[name="password"]', config.INSTAGRAM_INTEGRATION_PASSWORD)
            .click('input[value="Log in"]').waitForNextPage().close();
    },
    getMediaIds: function(shortcodes) {
        var promises = []
        // for (let shortcode in shortcodes) {
        //     promises.push(instagram.mediaByShortcode(shortcode));
        // }
        
        // Promise.all(promises).then(values => { 
        //     console.log(values)
        // });

        instagram.mediaByShortcode(shortcodes[0]).then((result) => {
           var data = result.data;

           if(data) {
               mediaMap[data.id] = { likes: new Set(), comments: new Set()};
               getLikes(data.id);
               getComments(data.id);
           }
        }); 
    }
};