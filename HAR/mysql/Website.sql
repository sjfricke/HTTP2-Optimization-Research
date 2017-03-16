CREATE TABLE `har_db`.`Website` (
  `WebsiteID` INT NOT NULL AUTO_INCREMENT,
  `Domain` VARCHAR(100) NOT NULL,
  `NumberOfFiles` INT NOT NULL,
  `StartedDateTime` DATETIME NOT NULL,
  `OnContentLoad` FLOAT NOT NULL,
  `OnLoad` FLOAT NOT NULL,
  `ObjectType` VARCHAR(8) NOT NULL,
  `Size` VARCHAR(8) NOT NULL,
  `Count` VARCHAR(8) NOT NULL,
  `Structure` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`WebsiteID`));
