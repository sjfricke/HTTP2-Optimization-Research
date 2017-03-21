# HAR Headless Parser
This tool is used to automatically grab the HAR files from Chromium and then send them off to a database where they will be queried and analise after. 

* Headless == running without a graphical interface, like in a terminal
* - [What you need installed (your favorite part right!)](#what-you-need-installed-your-favorite-part-right)
* - [How to run](#how-to-run)

## How to use

```
Usage: node HAR_Headless_Parser [options]...

Options:

  -h, --help           Output usage information
      --dbhost <IP>    IP address for database *[Will prompt otherwise]* *[Default: 127.0.0.1]*
      --dbport <port>  Port on machine to access database *[Will prompt otherwise]* *[Default: 3306]*
      --dbuser <user>  User of database *[Will prompt otherwise]*
      --dbpass <pass>  Password of database *[Will prompt otherwise]*
      --dbname <name>  Name of database to store data *[Will prompt otherwise]*
  -i, --input <file>   File of website input list in line-by-line fashion *[Will prompt otherwise]*
  -p, --port <port>    Remote Debugging Protocol port *[Default: 9222]*
  -v, --verbose        Enable verbose output on stdout
```

## What you need installed (your favorite part right!)
* You will need to make sure you have a MySQL database to send the data too
  * **NOTE:** the machine running this parser doesn't need to have the database
  * We may add support for more DB options in future
  * We are also assuming you can manage getting a MySQL Database up to use
* First you will need python as the parsing tool is ran in python
* You will need the [HAR_parser.py](./HAR_parser/HAR_parser.py) script in this directory or in the [HAR Parser subfolder](./HAR_parser)
* You will need [Node.js](https://nodejs.org/en/) which is used to run the main script
  * **YOU NEED VERSION 6 or greater for node for es6 support!**
  * Use [these instructions](http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/) for install the newer version
    * `curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -`
    * `sudo apt install nodejs`
    * `node -v` to verify
* With Node.js installed run `npm install` in this directory to load all the packages needed
* You will need Chromium
  * Ubuntu and Raspbian use `sudo apt-get install chromium-browser`
    * make sure to do a `sudo apt-get update` and `sudo apt-get upgrade` first
* You will need Xvfb to simulate a graphical screen in a terminal as Chromium only runs headless with a place to put the graphical memory data
  * `sudo apt-get install xvfb`
  * note the program when run is a captial X for `Xvfb` (NOT `xvfb`)
    * `xvfb-run` is a different program used to run xvfb which is not how we kick it off

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
  * To make sure the chrome headless is up and running run
	* `curl http://localhost:9222/json`
* Now we run our script
  * `node HAR_Headless_Parser.js`
 
