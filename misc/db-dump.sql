-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jul 03, 2020 at 03:07 PM
-- Server version: 8.0.20
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rasmin-test`
--
DROP DATABASE IF EXISTS `rasmin-test`;
CREATE DATABASE IF NOT EXISTS `rasmin-test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `rasmin-test`;

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE IF NOT EXISTS `Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdOn` datetime NOT NULL,
  `updatedOn` datetime NOT NULL,
  `userId` int NOT NULL,
  `role` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`id`, `createdOn`, `updatedOn`, `userId`, `role`) VALUES
(1, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 1, 'ADMIN'),
(2, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 2, 'USER'),
(3, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 2, 'OTHER');


-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdOn` datetime NOT NULL,
  `updatedOn` datetime NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `createdOn`, `updatedOn`, `name`, `email`) VALUES
(1, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 'yassir', 'yassir@mikrogo.com'),
(2, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 'meis', 'meis@mikrogo.com'),
(3, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 'ban', 'ban@mikrogo.com'),
(4, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 'saif', 'saif@mikrogo.com');


-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Todos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdOn` datetime NOT NULL,
  `updatedOn` datetime NOT NULL,
  `userId` int NOT NULL,
  `checked` int NOT NULL,
  `text` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Todos`
--

INSERT INTO `Todos` (`id`, `createdOn`, `updatedOn`, `userId`, `checked`, `text`) VALUES
(1, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 1, 1, 'todo yassir'),
(2, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 2, 0, 'todo meis'),
(3, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 3, 0, 'todo ban'),
(4, '2020-01-01 01:01:01', '2020-01-01 01:01:01', 4, 0, 'todo saif');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;