CREATE TABLE `har_db`.`Entries` (
  `EntryID` INT(11) NOT NULL AUTO_INCREMENT,
  `WebsiteID` INT NOT NULL,
  `Domain` VARCHAR(100) NOT NULL COMMENT '	',
  `StartedDateTime` DATETIME NOT NULL COMMENT '		',
  `TotalTime` FLOAT NOT NULL,
  `RequestCacheControl` VARCHAR(45) NULL DEFAULT NULL,
  `RequestDate` DATETIME NULL DEFAULT NULL COMMENT '	',
  `RequestUserAgent` VARCHAR(512) NULL DEFAULT NULL,
  `RequestHeaderSize` INT(11) NULL DEFAULT NULL,
  `RequestBodySize` INT(11) NULL DEFAULT NULL,
  `ResponseDate` DATETIME NULL DEFAULT NULL,
  `ResponseLastModified` DATETIME NULL DEFAULT NULL,
  `ResponseServer` VARCHAR(128) NULL DEFAULT NULL,
  `ResponseLength` INT(11) NULL DEFAULT NULL,
  `ResponseStatus` INT(11) NULL DEFAULT NULL,
  `ResponseHeaderSize` INT(11) NULL DEFAULT NULL,
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
  `ComputerType` INT NULL DEFAULT NULL,
  `ConnectionPath` INT NULL,
  PRIMARY KEY (`EntryID`),
  INDEX `WebsiteID_idx` (`WebsiteID` ASC),
  CONSTRAINT `WebsiteID`
    FOREIGN KEY (`WebsiteID`)
    REFERENCES `har_db`.`Website` (`WebsiteID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

