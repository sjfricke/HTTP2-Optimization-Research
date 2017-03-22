# Querying the database for data
While there are infinite ways of gathering and viewing the data, here are the methods we went about

## Warnings and Notes
* If the `ResponseTransferSize` is zero then the file was cached
* `ResponseTransferSize` should be slightly higher then `ResponseContentLength`
  * If it is less then part of the file was cached
* `ResponseContentLength IS NOT NULL` will eliminate all html pages from query
  * `SSLTime != -1` also works as well

## Cleaning data
Sometimes data can be bad, here is the best method of finding bad data and getting rid of it prior to querying

### Load time by number of files all of same size
```
USE har_db; 
SELECT Website.WebsiteID, Website.Domain, NumberOfFiles, Size, Count, Structure, SUM(TotalTime), SUM(ResponseTransferSize), AVG(Blocked), AVG(Send), AVG(Wait), AVG(Receive)
	FROM Website INNER JOIN Entries ON Website.WebsiteID = Entries.WebsiteID 
	WHERE (ResponseContentLength IS NOT NULL) AND (Structure = "a") AND (ResponseTransferSize != 0) AND (Size = 0)
    GROUP BY WebsiteID;
```
* Change `Size = 0` to corresponding to the **Size** field in the [Website Table](https://github.com/sjfricke/HTTP2-Optimization-Research/tree/master/HAR/mysql/#website-table) for differnet sizes
