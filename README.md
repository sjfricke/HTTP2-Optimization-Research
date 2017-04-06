# HTTP2-Optimization-Research
The two goals of this project/research are to find the best way to get peak performance from HTTP/2 and to have it easy for others to repeat data in their enviroments

# How should you split up your files?
It became practice to "hack" HTTP/1.1 by creating a huge single concatenated file with your resource. This doesn't translate to performance in HTTP/2, so we are here to answer this question

## Step 1 - Genearte dummy testing sites
* We have created a [simple bash script](website_gen) that will go and generate various websites along different parameters.
* Since we care about the transfering of data using HTTP/2 we find it valid to fill a website with random data as the page's loading is independent of how files are sent across the wire
* The script is incredibly simple to use and more detail can be found in [the website generator folder](website_gen)

## Step 2 - Gather HTTP/2 request data
* After various methods we found that the best way to gather data is to automated the HAR file from the browsers.
  * This desicion is made due to lack of support of headless browsers to collect the data that the network devtools offer
  * For Chrome we ended up using the [Chrome Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol) and the [NodeJS API](https://github.com/cyrus-and/chrome-remote-interface) for it and ended up grabbing the [HAR file](https://github.com/cyrus-and/chrome-har-capturer) to get the data from our request.
* Our [Header HAR Parser](HAR) takes a database and text file with the list of sites you want to run against (one is generated automatically in the website generator)
  * Each site it grabs and gets its HAR data where it then parses it and enters all the desired data to the database
  * This is designed to be run as often as you want to gather all the data needed

## Step 3 - Genearte charts with data
* Once you have the data to make it super easy to analyze it we created a [result generator](results) that will take data from the database and create a series of Google Charts
* The scripts creates each chart as its own html page which can be used to link for reference
  * You can also easily take the inner data section and combine as please

# Good Additional HTTP2 Resources
  * [Slides from Ilya Grigorik](https://bit.ly/http2-opt)
  * [Ilya Grigorik's book](https://hpbn.co/http2/)
  * [Surma's Chrome Dev Video](https://www.youtube.com/watch?v=r5oT_2ndjms)
