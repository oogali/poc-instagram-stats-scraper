Instagram Scraper
=================
This is a PoC project written in Node.js that fetches a public Instagram profile and parses the JavaScript from the web page's `<script></script>` tags to read the relevant information.

### Ingredients

| Component | Purpose | Version | Source |
|-----------|---------|---------|--------|
| Node.js | JavaScript runtime built on Chrome's V8 JavaScript engine | v0.10.36 | https://nodejs.org/api/index.html |
| request | Simplified HTTP request client | [![](https://img.shields.io/npm/v/request.svg)](https://www.npmjs.com/package/request) | https://github.com/request/request|
| cheerio | Tiny, fast, and elegant implementation of core jQuery designed specifically for the server | [![](https://img.shields.io/npm/v/cheerio.svg)](https://www.npmjs.com/package/cheerio) | https://github.com/cheeriojs/cheerio |
| nock | HTTP Server mocking for Node.js | [![](https://img.shields.io/npm/v/nock.svg)](https://www.npmjs.com/package/nock) | https://github.com/pgte/nock |
| librato-node | Node.js client for Librato Metrics | [![](https://img.shields.io/npm/v/librato-node.svg)](https://www.npmjs.com/package/librato-node) | https://github.com/goodeggs/librato-node |
| statsd-client | Yet another Node.js client for Etsy's statsd | [![](https://img.shields.io/npm/v/statsd-client.svg)](https://www.npmjs.com/package/statsd-client) | https://github.com/msiebuhr/node-statsd-client |
| yargs | Lightweight option parsing with an argv hash. | [![](https://img.shields.io/npm/v/yargs.svg)](https://www.npmjs.com/package/yargs) | https://github.com/bcoe/yargs |

### How to Run

To get started.

```
git clone git@bitbucket.org:oogali/instagram-scraper.git
cd instagram-scraper
npm install
```

Configure scraper for sending stats.

```
cp config.json.example config.json
vi config.json
```

To send stats to Librato

```
./scrape.js --librato screenname1 screenname2 screenname3
```

To send stats to Statsd

```
./scrape.js --statsd screenname1 screenname2 screenname3
```

To send stats to both, use both of the `--librato` and `--statsd` arguments.
