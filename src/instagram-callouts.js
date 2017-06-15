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
            .value('input[name="username"]', 'integrationuser')
            .value('input[name="password"]', 'Ub5pzn79Ej')
            .click('input[value="Log in"]').waitForNextPage().close();
    },
    getMediaIds: function(shortcodes) {
        let promises = []
        for (let shortcode in shortcodes) {
            promises.push(instagram.mediaByShortcode({shortcode: shortcode}));
        }
        
        Promise.all(promises).then(values => { 
            console.log(values)
        });

        // instagram.mediaByShortcode({
        //     shortcode: shortcode
        // }, (err, data) => {
        //     console.log(err);
        //     if (err) throw err;

        //     console.log(data);
        // });

    }
};