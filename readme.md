# Kibana Local

This allows to run Kibana locally, and proxying the calls through the Auth0 protected ElasticSearch proxy.

## Installation

1. Download Kibana 6.0.1 from [elastic.co's release page](https://www.elastic.co/downloads/past-releases/kibana-6-0-1).
   * **Important** - do not use another Kibana version than the backend. There might be negative side-effects. Especially do not do this when hitting production.
   * Mac users - you can install it with Homebrew if you follow this: https://gist.github.com/ro-tex/28b7f1d8e736c98683459993c65ae97c
1. Install dependencies: `yarn`

## Running kibana locally

1. Run Kibana locally: `node index.js <kibanaHome> <environment (prod | test)> <username> <password>`. For example, `node index.js ".\kibana-6.0.1" "test" "USERNAME" "PASSWORD"`.
1. Navigate to [http://localhost:5601](http://localhost:5601).
1. Once completed, hit `Ctrl + C` to interrupt the process.
   * **Important** - try not to keep it open for longer than needed. The Kibana server does constant polling to the backend to see whether it's up, and it's unnecessary usage of our services.
