#!/usr/bin/env node

'use strict';

var argv = require('yargs')
            .boolean('librato')
            .boolean('statsd')
            .argv;

var librato = require('librato-node');
var statsd = require('statsd-client');
var cheerio = require('cheerio');
var request = require('request');
var nock = require('nock');
var fs = require('fs');
var config = require('./config.json');

if (argv._.length < 1) {
  console.log(process.argv[0] + ' <instagram screen name>');
  process.exit(-1);
}

var targets = argv._;
var send_to_librato = argv.librato;
var send_to_statsd = argv.statsd;
var sdc;

if (!send_to_librato && !send_to_statsd) {
  console.log('No stats collection method selected!');
  process.exit(-1);
}

if (send_to_librato && config.librato) {
  librato.configure({ email: config.librato.email, token: config.librato.api_key, period: 1 });
}

if (send_to_statsd) {
  sdc = new statsd({ host: config.statsd.host, port: config.statsd.port, debug: config.debug });
}

targets.forEach(function(target, index) {
  var _url = 'https://www.instagram.com/' + target;
  var _filename = target + '.html';
  var _metric_base = 'instagram.' + target;

  fs.exists(_filename, function(exists) {
    if (exists) {
      nock('https://www.instagram.com')
        .get('/' + target)
        .reply(200, fs.readFileSync(_filename));
    }
  });

  request(_url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var _scripts = $('script[type="text/javascript"]');
      _scripts.each(function(index, script) {
        var _script = $(this).text();
        if (_script.indexOf('window._sharedData') != -1) {
          var window = {};
          var _profile = eval(_script);
          var _user = window._sharedData.entry_data.ProfilePage[0].user;
          var _following = _user.follows.count;
          var _followers = _user.followed_by.count;
          var _posts = _user.media.count;

          console.log(_metric_base + '.followers: ' + _followers);

          if (send_to_librato) {
            librato.measure('instagram.followers', _followers, { source: _metric_base });
            librato.measure('instagram.follows', _following, { source: _metric_base });
            librato.measure('instagram.posts', _posts, { source: _metric_base });
            librato.flush();
          }

          if (send_to_statsd) {
            sdc.timing([ _metric_base, 'followers' ].join('.'), _followers);
            sdc.timing([ _metric_base, 'follows' ].join('.'), _following);
            sdc.timing([ _metric_base, 'posts' ].join('.'), _posts);
          }
        }
      });
    }
  });
});
