SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema wfms
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `wfms` ;

-- -----------------------------------------------------
-- Schema wfms
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `wfms` DEFAULT CHARACTER SET utf8 ;
USE `wfms` ;

-- -----------------------------------------------------
-- Table `wfms`.`login`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wfms`.`login` ;

create table if not exists `wfms`.`login` (
  `email` varchar(100) not null,
  `password_hash` varchar(45) null default null,
  `password_salt` varchar(45) null default null,
  `status` binary(2) null default null,
  `type` varchar(45) null default null,
  `created_date` datetime null default null,
  `last_login` datetime null default null,
  `idperson` int(11) not null auto_increment,
  primary key (`idperson`),
  unique index `email_unique` (`email` asc))
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`person`
-- -----------------------------------------------------
drop table if exists `wfms`.`person` ;

create table if not exists `wfms`.`person` (
  `idperson` int(11) not null,
  `fname` varchar(45) null default null,
  `lname` varchar(45) null default null,
  `address` varchar(45) null,
  `city` varchar(45) null default null,
  `zipcode` varchar(45) null default null,
  `email` varchar(45) null default null,
  `phonenumber` varchar(45) null default null,
  primary key (`idperson`),
  constraint `idperson`
    foreign key (`idperson`)
    references `wfms`.`login` (`idperson`)
    on delete no action
    on update no action)
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`gaurd`
-- -----------------------------------------------------
drop table if exists `wfms`.`gaurd` ;

create table if not exists `wfms`.`gaurd` (
  `idgaurd` int(11) not null,
  `start_date` date null default null,
  `end_date` date null default null,
  `weekly_working_set` varchar(45) null default null,
  `idperson` int(11) null default null,
  `bgstatus` varchar(45) null default null,
  primary key (`idgaurd`),
  index `personid_idx` (`idperson` asc),
  constraint `personid`
    foreign key (`idperson`)
    references `wfms`.`person` (`idperson`)
    on delete no action
    on update no action)
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`alert`
-- -----------------------------------------------------
drop table if exists `wfms`.`alert` ;

create table if not exists `wfms`.`alert` (
  `idalert` int(11) not null,
  `idgaurd` int(11) null default null,
  `date` datetime null default null,
  `heading` varchar(45) null default null,
  `descrption` varchar(1000) null default null,
  primary key (`idalert`),
  index `gaurd_id_idx1` (`idgaurd` asc),
  constraint `gaurd_id_alert`
    foreign key (`idgaurd`)
    references `wfms`.`gaurd` (`idgaurd`)
    on delete no action
    on update no action)
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`client`
-- -----------------------------------------------------
drop table if exists `wfms`.`client` ;

create table if not exists `wfms`.`client` (
  `idclient` varchar(25) not null,
  `idperson` int(11) null default null,
  `monthly_service` varchar(45) null default null,
  `balance` varchar(45) null default null,
  `start_date` date null default null,
  `end_date` date null default null,
  primary key (`idclient`),
  index `person_id_idx` (`idperson` asc),
  constraint `person_id`
    foreign key (`idperson`)
    references `wfms`.`person` (`idperson`)
    on delete no action
    on update no action)
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`building`
-- -----------------------------------------------------
drop table if exists `wfms`.`building` ;

create table if not exists `wfms`.`building` (
  `idbuilding` int(11) not null,
  `idclient` varchar(25) null default null,
  `address` varchar(300) null default null,
  `release_date` date null default null,
  `service_fees` float null default null,
  `checkpoint` varchar(300) null default null,
  primary key (`idbuilding`),
  index `clientid_idx` (`idclient` asc),
  constraint `clientid`
    foreign key (`idclient`)
    references `wfms`.`client` (`idclient`)
    on delete no action
    on update no action)
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`gaurdbuildingschedule`
-- -----------------------------------------------------
drop table if exists `wfms`.`gaurdbuildingschedule` ;

create table if not exists `wfms`.`gaurdbuildingschedule` (
  `idschedule` int(11) not null,
  `idgaurd` int(11) null default null,
  `idbuilding` int(11) null default null,
  `from` date null default null,
  `to` date null default null,
  primary key (`idschedule`),
  index `gaurd_id_idx` (`idgaurd` asc),
  index `building_id_idx` (`idbuilding` asc),
  constraint `building_id`
    foreign key (`idbuilding`)
    references `wfms`.`building` (`idbuilding`)
    on delete no action
    on update no action,
  constraint `gaurd_id`
    foreign key (`idgaurd`)
    references `wfms`.`gaurd` (`idgaurd`)
    on delete no action
    on update no action)
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`patrol`
-- -----------------------------------------------------
drop table if exists `wfms`.`patrol` ;

create table if not exists `wfms`.`patrol` (
  `idpatrol` int(11) not null,
  `date` datetime null default null,
  `description` varchar(1000) null default null,
  primary key (`idpatrol`))
engine = innodb
default character set = utf8;


-- -----------------------------------------------------
-- table `wfms`.`report`
-- -----------------------------------------------------
drop table if exists `wfms`.`report` ;

create table if not exists `wfms`.`report` (
  `idreport` int(11) not null,
  `idbuilding` int(11) null default null,
  `idgaurd` int(11) null default null,
  `idpatrol` int(11) null default null,
  `idalert` int(11) null default null,
  primary key (`idreport`),
  index `building_id_idx` (`idbuilding` asc),
  index `gaurd_id_idx` (`idgaurd` asc),
  index `patrol_id_idx` (`idpatrol` asc),
  index `alert_id_idx` (`idalert` asc),
  constraint `alert_id_report`
    foreign key (`idalert`)
    references `wfms`.`alert` (`idalert`)
    on delete no action
    on update no action,
  constraint `building_id_report`
    foreign key (`idbuilding`)
    references `wfms`.`building` (`idbuilding`)
    on delete no action
    on update no action,
  constraint `gaurd_id_report`
    foreign key (`idgaurd`)
    references `wfms`.`gaurd` (`idgaurd`)
    on delete no action
    on update no action,
  constraint `patrol_id_report`
    foreign key (`idpatrol`)
    references `wfms`.`patrol` (`idpatrol`)
    on delete no action
    on update no action)
engine = innodb
default character set = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
