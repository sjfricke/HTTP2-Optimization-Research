#About HAR Files:


What is a HAR file https://blog.stackpath.com/glossary/har-file/

How to user the HAR Viewer http://www.softwareishard.com/blog/har-viewer/
HAR Viewer http://www.softwareishard.com/har/viewer/

Explanation of HAR objects http://www.softwareishard.com/blog/har-12-spec/



##Dependecies
MySQL Connector for Python
https://dev.mysql.com/downloads/connector/python/2.1.html



##Python connect to DB
http://www.mysqltutorial.org/python-connecting-mysql-databases/


##Inserting into SQLdb usign mysql Connector
http://www.mysqltutorial.org/python-mysql-insert/

## Link to Report 
http://http2optimization.com/

##Json Lint
Useful in cleaning up HAR file collected through script
http://jsonlint.com/


DB Scheme:
* Website
 * Domain -- accessed websites domain
 * NumberOfFiles -- total number of files
 * RequestedOrder - 0-5, -1 for error 
 * FirstLoad - True if yes, else no


* Request
 * Domain
 * RequestURL
 * Blocked
 * DNS
 * Connected 
 * Send 
 * Wait
 * Receive
 * SSL
