# HTTP2-Optimization-Research
There is a lot of data out there showing off HTTP/1.1 vs HTTP/2 but there isn't anything out there showing off how to actually get peak optimization from your HTTP/2 websites. **HTTP2-Optimization-Research** goal is to build a way of allow people help find what truly the optimized way is to adapt to HTTP/2!

# WE NEED YOUR HELP
The **biggest** issue we have ran into is the number of variations to websites is more than a group of three university students could handle and we decided to trade your help of getting data with a **super easy** way of gathering it.

# Our findings
We have posted all our findings at our [main site](https://http2optimization.com/)

## Step 1 - Generate Testing Websites
* We have created a [simple bash script](website_gen) that will go and generate various websites along different parameters.
* Since we care about the **transferring** of data using HTTP/2 only, we find it valid to fill a website with random data as the page's loading is independent of how files are sent across the network.
* The script is incredibly simple to use and more detail can be found in [the website generator folder](website_gen)

## Step 2 - Gather HTTP/2 Request Data
* After various methods we found that the best way to gather data is to automated the HAR file from the browsers.
  * This decision is made due to lack of support of headless browsers (currently) to collect the data that the network devtools offer
  * For Chrome we ended up using the [Chrome Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol) and the [NodeJS API](https://github.com/cyrus-and/chrome-remote-interface) for it and ended up grabbing the [HAR file](https://github.com/cyrus-and/chrome-har-capturer) to get the data from our request.
* Our [Headless HAR Parser](HAR) takes a database and the list of sites you want to run against (one is generated automatically in the website generator).
  * Each site it grabs and gets its HAR data where it then parses it and enters all the desired data to the database
  * This is designed to be run as often as you want to gather all the data needed.

## Step 3 - Auto Generate Results and Charts from Data
* **NOTE:** This part is still in the working, but still doesn't prevent you from getting your own data in step 1 and 2
* Once you have the data to make it super easy to analyze it we created a [result generator](results) that will take data from the database and create a series of Google Charts.
* The scripts creates each chart as its own html page which can be used to link for reference.
  * You can also easily take the inner data section and combine as please.

## Good Additional HTTP/2 Resources
  * Videos on what HTTP/2 is all about
	* [Slides from Ilya Grigorik](https://bit.ly/http2-opt)
	* [Ilya Grigorik's book](https://hpbn.co/http2/)
	* [Surma's Chrome Dev Video](https://www.youtube.com/watch?v=r5oT_2ndjms)
  * How to setup HTTP/2
	* [Nginx on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-with-http-2-support-on-ubuntu-16-04)
 