# raspberry-sl-status

## install it on the Raspberry PI

1. Install the _Blinkt!_ software pack: `curl https://get.pimoroni.com/blinkt | bash`
2. clone this repo and run `npm install`
3. Set up crontab. For example `*/5 7-19 * * * node /path/to/script` the trigger times should be synced with the script keep-alive time in config.js
