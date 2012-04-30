# ************************************************************
# Sequel Pro SQL dump
# Version 3408
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.20)
# Database: band
# Generation Time: 2012-03-25 01:26:47 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table jams
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jams`;

CREATE TABLE `jams` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `organizer` int(11) unsigned NOT NULL,
  `title` text NOT NULL,
  `artist` text,
  PRIMARY KEY (`id`),
  KEY `organizer` (`organizer`),
  CONSTRAINT `jams_ibfk_1` FOREIGN KEY (`organizer`) REFERENCES `band_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `jams` WRITE;
/*!40000 ALTER TABLE `jams` DISABLE KEYS */;

INSERT INTO `jams` (`id`, `organizer`, `title`, `artist`)
VALUES
	(1,1,'Beatles Jam','The Bealtes');

/*!40000 ALTER TABLE `jams` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table jams_needs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jams_needs`;

CREATE TABLE `jams_needs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `jam` int(11) unsigned NOT NULL,
  `type` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jam` (`jam`),
  KEY `type` (`type`),
  CONSTRAINT `jams_needs_ibfk_2` FOREIGN KEY (`type`) REFERENCES `user_types` (`id`),
  CONSTRAINT `jams_needs_ibfk_1` FOREIGN KEY (`jam`) REFERENCES `jams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `jams_needs` WRITE;
/*!40000 ALTER TABLE `jams_needs` DISABLE KEYS */;

INSERT INTO `jams_needs` (`id`, `jam`, `type`)
VALUES
	(1,1,1),
	(2,1,2);

/*!40000 ALTER TABLE `jams_needs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_types`;

CREATE TABLE `user_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `display_name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user_types` WRITE;
/*!40000 ALTER TABLE `user_types` DISABLE KEYS */;

INSERT INTO `user_types` (`id`, `display_name`)
VALUES
	(1,'Guitarist'),
	(2,'Bassist'),
	(3,'Pianist'),
	(4,'Drummer'),
	(5,'Harmonist'),
	(6,'Vocalist');

/*!40000 ALTER TABLE `user_types` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table band_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `band_users`;

CREATE TABLE `band_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `twitter_id` int(11) unsigned NOT NULL,
  `display_name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `band_users` WRITE;
/*!40000 ALTER TABLE `band_users` DISABLE KEYS */;

INSERT INTO `band_users` (`id`, `twitter_id`, `display_name`)
VALUES
	(1,123456,'Paul McCartney');

/*!40000 ALTER TABLE `band_users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table band_users_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `band_users_types`;

CREATE TABLE `band_users_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(11) unsigned NOT NULL,
  `type` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `type` (`type`),
  CONSTRAINT `band_users_types_ibfk_2` FOREIGN KEY (`type`) REFERENCES `user_types` (`id`),
  CONSTRAINT `band_users_types_ibfk_1` FOREIGN KEY (`user`) REFERENCES `band_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `band_users_types` WRITE;
/*!40000 ALTER TABLE `band_users_types` DISABLE KEYS */;

INSERT INTO `band_users_types` (`id`, `user`, `type`)
VALUES
	(2,1,1),
	(3,1,2),
	(5,1,3),
	(6,1,6);

/*!40000 ALTER TABLE `band_users_types` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
