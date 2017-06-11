/**
 * Simple Express server for handling Slack / commands 
 * 
 * @author    Slade Solobay
 * @date      2017-06-10 
 */
'use strict'

const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('./config');
const commands = require('./commands');
const helpCommand = require('./commands/help');
const Horseman = require('node-horseman');
const url = require('url');

let bot = require('./bot');

let app = express();

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
};

/**
 * Generates an Instagram access token based on the configured integration user.
 * 
 * @author    Slade Solobay
 * @date      2017-06-10
 */
let generateAccessToken = function(res, req, next) {
  let horseman = new Horseman();

  horseman.open(`https://api.instagram.com/oauth/authorize/?client_id=eb2a475895d74b7fb0611dfd918e99c2&redirect_uri=https://insta-data.herokuapp.com/&response_type=token`)
      .on('urlChanged', (targetUrl) => {
        console.log(url.parse(targetUrl).hash);
      })
      .value('input[name="username"]', 'integrationuser')
      .value('input[name="password"]', 'Ub5pzn79Ej')
      .click('input[value="Log in"]')
      .waitForNextPage()      
      .close();

  next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(generateAccessToken);

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })

app.post('/commands/unfollow-list', (req, res) => {
  let payload = req.body;

  console.log(payload);

  if (!payload || payload.token !== config('SLACK_TOKEN')) {
    let err = '✋  Insta—what? An invalid slash token was provided\n' +
              '   Is your Slack slash token correctly configured?';
    console.log(err);
    res.status(401).end(err);
    return;
  }

  let cmd = _.reduce(commands, (a, cmd) => {
    return payload.text.match(cmd.pattern) ? cmd : a
  }, helpCommand);

  cmd.handler(payload, res);
});

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n📷  Insta-Data LIVES on PORT ${config('PORT')} 📷`);
});
