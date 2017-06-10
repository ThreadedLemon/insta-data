
'use strict'

const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('./config');
const commands = require('./commands');
const helpCommand = require('./commands/help');
const Horseman = require('node-horseman');

let bot = require('./bot');

let app = express();

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => { 
  
   console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
  

  res.send('\n 👋 🌍 Test \n') 
})

app.post('/commands/unfollow-list', (req, res) => {
  let payload = req.body;

  console.log(payload);

  const horseman = new Horseman();

  horseman
      .open(`https://api.instagram.com/oauth/authorize/?client_id=eb2a475895d74b7fb0611dfd918e99c2&redirect_uri=https://insta-data.herokuapp.com/&response_type=token`)
      .value('input[name="username"]', 'integrationuser')
      .value('input[name="password"]', 'Ub5pzn79Ej')
      .click('input[value="Log in"]')
      .waitForNextPage()
      .log('yes')
      .close();

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
