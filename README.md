# HTTP2-Optimization-Research
Series of test to collect and analysis data to find the best way to get peak performance from HTTP2 

# Gathering the data
After various methods I found that the best way to gather data is to automated the HAR file from the browsers.
* This desicion is made due to lack of support of headless browsers to collect the data that the network devtools offer
* A Chrome extension or Firefox add-on were attempted, but after finding the file permissions more cracking down I can say its not possible.
* Luckily people have already ran into this issue and have developed their own makeshift version of a HAR file getter
