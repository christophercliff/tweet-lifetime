# Tweet Lifetime

A self-hosted service that continuously monitors your Twitter account and deletes old tweets. Read more [here](https://christophercliff.com/tweet-lifetime).

## Setup Guide

### 1. Obtain Twitter access tokens

The application uses the "[Tokens from dev.twitter.com](https://dev.twitter.com/oauth/overview/application-owner-access-tokens)" authorization scheme. To obtain keys:

1. Sign in to the Twitter account you want to monitor.
2. Navigate to [apps.twitter.com](https://apps.twitter.com/) and click "Create New App". Enter a Name, Description, Website (these values are arbitrary) and agree to the terms. Then click "Create your Twitter Application".
3. Click the "Permissions" tab and select "Read and Write". Click "Update Settings" to save your selection.
4. Click the "Keys and Access Tokens" tab. Click "Create my access token".
5. Take note of your "Consumer Key (API Key)", "Consumer Secret (API Secret)", "Access Token" and "Access Token Secret".

### 2. Deploy to Heroku

The appliction is designed to run on a free Heroku dyno.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/christophercliff/tweet-lifetime)

1. Click "Deploy to Heroku".
2. Name your app and enter the configuration variables.
3. Click "Deploy for Free" and the service will begin monitoring your account.

## Contributing

See [CONTRIBUTING](https://github.com/christophercliff/tweet-lifetime/blob/master/CONTRIBUTING.md).

## License

See [LICENSE](https://github.com/christophercliff/tweet-lifetime/blob/master/LICENSE.md).
