/**
 * Various utility function used throughout the app.
 * 
 * @author    Slade Solobay
 * @date      2017-06-10 
 */
const config = require('./config');
const Horseman = require('node-horseman');
const url = require('url');

module.exports = {
    /**
     * Generates an Instagram access token based on the configured integration user.
     * 
     * @author    Slade Solobay
     * @date      2017-06-10
     */
    generateAccessToken: function() {
        var horseman = new Horseman();

        horseman.open(`https://api.instagram.com/oauth/authorize/?client_id=eb2a475895d74b7fb0611dfd918e99c2&redirect_uri=https://insta-data.herokuapp.com/&response_type=token`)
            .on('urlChanged', (targetUrl) => {
                config('INSTAGRAM_TOKEN', url.parse(targetUrl).hash.slice(14));
                console.log(config('INSTAGRAM_TOKEN'));
            })
            .value('input[name="username"]', 'integrationuser')
            .value('input[name="password"]', 'Ub5pzn79Ej')
            .click('input[value="Log in"]').waitForNextPage().close();
    }
};