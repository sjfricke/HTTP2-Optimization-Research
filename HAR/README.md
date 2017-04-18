# HAR Headless Parser
This tool is used to automatically grab the HAR files from Chromium and then send them off to a database where they will be queried and analise after. 

> DISCLAIMER: None of this was ran on Windows, everything was done on Ubuntu 16.04, be advise with other unix enviroments

* - [What you need installed](#what-you-need-installed)
* - [How to run](#how-to-run)
* - [How to use](#how-to-use)
* - [About HAR files](#about-har-files)

## What you need installed
* You will need to make sure you have a **MySQL Database** to send the data too
  * **NOTE:** the machine running this parser doesn't need to have the database, you can enter database IP address
  * We may add support for more DB options in future
  * We are also assuming you can manage getting a MySQL Database up to use
* You will need [Node.js](https://nodejs.org/en/) which is used to run the main script
  * **YOU NEED VERSION 6 or greater for node for [ES6 support!](https://nodejs.org/en/docs/es6/)**
  * Use [these instructions](http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/) for install the newer version
    * `curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -`
    * `sudo apt install nodejs`
    * `node -v` to verify
* With Node.js installed run `npm install` in this directory to load all the packages needed
* You will need Chromium
  * Ubuntu and Raspbian use `sudo apt install chromium-browser`
    * make sure to do a `sudo apt update` and `sudo apt upgrade` first
  * **Note:** We have tried this on `google-chrome` but until we can verify the `--headless` feature works for sure use chromium if possible 
* You will need Xvfb to simulate a graphical screen in a terminal as Chromium only runs headless with a place to put the graphical memory data
  * `sudo apt install xvfb`
  * **Note:** the program when run is a captial X for `Xvfb` (NOT `xvfb`)
    * `xvfb-run` is a different program used to run xvfb which is **not** how we kick it off

## How to run
* First off you will need to setup Xvfb (Thanks to [Serrie for these instruction](http://askubuntu.com/questions/754382/how-do-i-start-chromium-browser-in-headless-mode-extension-randr-missing-on-d))
  * Making sure the display we want to use isn't present yet
    * `DISPLAY=:1 xset q`
    * you should see `xset:  unable to open display ":1"`
  * We will need to start Xvfb on buffer 1 and run it in the background
    * `Xvfb :1 -screen 0 '1280x1024x16' -ac &> /dev/null &`
  * Make sure it is running
    * `ls -l /tmp/.X11-unix/X1`
    * you should see something like `srwxrwxrwx 1 pi pi 0 Mar  9 21:57 /tmp/.X11-unix/X1`
  * Export current display to the :1 we just created.
    * `export DISPLAY=:1`
      * We can also add DISPLAY=:1 before every command we want to run on the display. However exporting makes sure this will be saved for the current session so you don't have to provide it for every command.
  * Check to make sure the screen is present and is working
    * `xset q`
* Now we can run chrome in headless debug mode
  * `chromium-browser --remote-debugging-port=9222 --enable-benchmarking --enable-net-benchmarking --incognito &`
	* `--remote-debugging-port=9222` is essentially chrome's API to dev tools stuff - [more details here](https://developer.chrome.com/devtools/docs/debugger-protocol)
	* `--enable-benchmarking` and  `--enable-net-benchmarking` to enable the Javascript interface that allows `chrome-har-capturer` to flush the DNS cache and the socket pool before loading each URL.
	* `--incognito` to help prevent any unwanted caching
	* `&` at the end tells it to run in background
  * To make sure the chrome headless is up and running run
	* `curl http://localhost:9222/json`
	* You should see some json printed which means you are all ready to go
* Now we run our script
  * `node HAR_Headless_Parser.js`

## How to use

```
Usage: node HAR_Headless_Parser [options]...

Options:

  -h, --help           Output usage information
      --dbhost <IP>    IP address for database [Will prompt otherwise] [Default: 127.0.0.1]
      --dbport <port>  Port on machine to access database [Will prompt otherwise] [Default: 3306]
      --dbuser <user>  User of database [Will prompt otherwise]
      --dbpass <pass>  Password of database [Will prompt otherwise]
      --dbname <name>  Name of database to store data [Will prompt otherwise]
  -i, --input <file>   File of website input list in line-by-line fashion [Will prompt otherwise]
  -p, --port <port>    Remote Debugging Protocol port [Default: 9222]
  -v, --verbose        Enable verbose output on stdout
```

#### Some Examples:
* `node HAR_Headless_Parser.js --dbhost 127.0.0.1 --dbuser admin --dbname har_db -i ../website_gen/website_lists/web_list`
  * Here we save time from it having to prompt us and pass it the IP, user, and database
  * We also pass it the file location where the list of website is to run against
* `node HAR_Headless_Parser.js -p 3000 -v`
  * If we are running our browser in debug mode on port 3000 we can set it here
  * Verbose mode will display extra information about the status of script

## About HAR Files
* [Offical HAR Spec Sheet](https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/HAR/Overview.html)
* [What is a HAR file](https://blog.stackpath.com/glossary/har-file/)
* [How to user the HAR Viewer](http://www.softwareishard.com/blog/har-viewer/)
* [HAR Viewer](http://www.softwareishard.com/har/viewer/)
* [Explanation of HAR objects](http://www.softwareishard.com/blog/har-12-spec/)
