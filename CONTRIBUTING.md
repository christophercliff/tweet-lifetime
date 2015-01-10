# Contributing

## Setup

Clone the project and install the dependencies:

```
$ git clone git@github.com:christophercliff/tweet-lifetime.git
$ cd ./tweet-lifetime/
$ npm install
```

## Tests

Create a `.env` file in the root of this project. It should resemble the following:

```
TWITTER_ACCESS_TOKEN_KEY=<your_access_token_key>
TWITTER_ACCESS_TOKEN_SECRET=<your_access_token_secret>
TWITTER_CONSUMER_KEY=<your_consumer_key>
TWITTER_CONSUMER_SECRET=<your_consumer_secret>
```

Then run:

```
$ npm test
```
