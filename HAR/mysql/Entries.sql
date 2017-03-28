CREATE TABLE `har_db`.`Entries` (
  `EntryID` INT(11) NOT NULL AUTO_INCREMENT,
  `WebsiteID` INT NOT NULL,
  `Domain` VARCHAR(512) NOT NULL,
  `StartedDateTime` DATETIME NOT NULL,
  `TotalTime` FLOAT NOT NULL,
  `RequestCacheControl` VARCHAR(45) NULL DEFAULT NULL,
  `RequestDate` DATETIME NULL DEFAULT NULL,
  `RequestUserAgent` VARCHAR(512) NULL DEFAULT NULL,
  `RequestHeadersSize` INT(11) NULL DEFAULT NULL,
  `RequestBodySize` INT(11) NULL DEFAULT NULL,
  `RequestUrl` VARCHAR(512) NOT NULL,
  `ResponseDate` DATETIME NULL DEFAULT NULL,
  `ResponseLastModified` DATETIME NULL DEFAULT NULL,
  `ResponseServer` VARCHAR(128) NULL DEFAULT NULL,
  `ResponseContentLength` INT(11) NULL DEFAULT NULL,
  `ResponseStatus` INT(11) NULL DEFAULT NULL,
  `ResponseHeadersSize` INT(11) NULL DEFAULT NULL,
  `ResponseBodySize` INT(11) NULL DEFAULT NULL,
  `ResponseHttpVersion` VARCHAR(45) NOT NULL,
  `ResponseTransferSize` INT(11) NULL DEFAULT NULL,
  `Blocked` FLOAT NOT NULL,
  `DNS` FLOAT NOT NULL,
  `Connect` FLOAT NOT NULL,
  `Send` FLOAT NOT NULL,
  `Wait` FLOAT NOT NULL,
  `Receive` FLOAT NOT NULL,
  `SSLTime` FLOAT NOT NULL,
  `ComputerType` INT(11) NULL DEFAULT NULL,
  `ConnectionPath` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`EntryID`),
  INDEX `WebsiteID_idx` (`WebsiteID` ASC),
  CONSTRAINT `WebsiteID`
    FOREIGN KEY (`WebsiteID`)
    REFERENCES `har_db`.`Website` (`WebsiteID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

