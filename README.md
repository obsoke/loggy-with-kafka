# Loggy with Kafka

## Prerequisites
* At least Ubuntu 14.04
* Node/NPM 0.12
* Git

If you're using Vagrant, you can use `scripts/bootstrap.sh` as a provisionng script to get a box ready to go.
If you're on OS X or a distro not based on Debian, you'll have to install Zookeeper,
Kafka and PostgreSQL manually.

## Installation
1. Clone repo
2. `cd` into repo & run `[sudo] npm install`. This should also install additional dependencies such as Apache Kafka and PostgreSQL so `sudo` may be required for this step.

## Usage
Start the API server with `[sudo] npm start`.

You can run tests with `npm test`.

Run the linter with `npm run lint`.


