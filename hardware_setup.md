# Hardware setup

* There are four Raspberry Pi model 3B hooked up to the local network
  * two are using the built in wifi
    * node1 and node2
      * Running `Ubuntu MATE 16.04.2 LTS`
      * 32GB SD card   
  * two are using CAT5 ethernet cables
    * node3 and nod4
    * all are running `Linux 4.4.38-v7+ #938 SMP Thu Dec 15 15:22:21 GMT 2016 armv7l GNU/Linux`
    * all have a 8GB microSD card as the hard drive
  
 * Servers
  * `node1` running Nginx 
    * [http2optimization.com:2001](http://http2optimization.com:2001)
  * `node2` running Apache 
    * [http2optimization.com:2002](http://http2optimization.com:2002)
  * To make things simpler routing the SSL Certificate, testing will be done on one server at a time, therefore [http2optimization.com](http://http2optimization.com) will bring you to node 1


