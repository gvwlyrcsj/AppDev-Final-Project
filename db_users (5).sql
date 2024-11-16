-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 02, 2024 at 10:52 PM
-- Server version: 8.0.39
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_users`
--

-- --------------------------------------------------------

--
-- Table structure for table `addproducts`
--

DROP TABLE IF EXISTS `addproducts`;
CREATE TABLE IF NOT EXISTS `addproducts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `image` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `addproducts`
--

INSERT INTO `addproducts` (`id`, `name`, `description`, `price`, `imageUrl`, `image`) VALUES
(1, 'Okinawa', 'MilkTea', 87.00, '/uploads/dvlx9u7plgi31.webp', NULL),
(4, 'Wintermelon', 'MilkTea', 89.00, '/uploads/pngtree-pearl-milk-tea-pearl-drink-transparent-png-image_9059833.png', NULL),
(7, 'Red Velvel', 'Milktea', 68.00, '/uploads/2b578ea8-bc37-444e-b40e-2f5dc46dd5a2.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `quantity` int NOT NULL DEFAULT '1',
  `price` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `size`, `quantity`, `price`) VALUES
(8, 5, 1, 'medium', 1, 69),
(13, 5, 1, 'small', 1, 59),
(19, 5, 4, 'small', 1, 59),
(20, 5, 4, 'small', 2, 59),
(23, 5, 1, 'xl', 1, 89),
(25, 5, 1, 'small', 1, 59),
(26, 5, 4, 'small', 1, 59),
(27, 5, 1, 'small', 3, 59),
(28, 5, 1, 'small', 1, 59),
(29, 5, 4, 'small', 3, 59);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(3, 'huhou', 'uhu@gmail.com', 'wugdu', 'gvk', '2024-10-06 00:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'jjj', 'jjj@gmail.com', '$2b$10$7PpsYzZkgfgNEDwAYHFbyezQLJK7uh7WlTGoSKkP2q21ifx2zeVWu', 'user'),
(2, 'jsjs', 'hssh@gmail.com', '$2b$10$dj/ZHfuQW2CZYjTF.Gs0suAk95myphqLAyqfQsF2LR1l.cmIVLjs2', 'user'),
(3, 'hhh', 'hgh@gmail.com', '$2b$10$3RpsfzlENC8crYhqCARwpOA/ZDo6A5IWZqJtYmJtst2pCmYAQOyXa', 'admin'),
(4, 'guikg', 'ugug@gmail.com', '$2b$10$.lip0Hgaf.0ctmGjnM0VkOriQgcodDJnc/FNmy3x4Zi7Xx1GAvf0C', 'user'),
(5, 'gwyne', 'gwyneth@gmail.com', '$2b$10$YE1kXg..9r8Y6hubOB/Cn.2uW1uURiwYvkuJYWXGvEAu5EanS3tUa', 'user'),
(6, 'valerie', 'val@gmail.com', '$2b$10$MERw21XyCGccbo5g.eApEuW2IAzMTl39D3hVNhRkBHqft1TpzXRA2', 'admin'),
(7, 'brucal', 'brucal@gmail.com', '$2b$10$TgwIyWNHVmrOZ0Q9IszCa.0SEI9kPd2mSFgKgdAdjvQclhGzZ7O4i', NULL),
(8, 'baek', 'baek@gmail.com', '$2b$10$y0stYaUGh1HOHGKcsLm3C.WQ3KmRKz93JHEZVp0QqfAWbmNPLdzay', NULL),
(9, 'tres', 'ftf@gmail.com', '$2b$10$ZvDGanFWKfOOBQOtOpogOu4fVp/VPZ5tTVftXIL6eM23kQlRzji.K', NULL),
(10, 'nar', 'nar@gmail.com', '$2b$10$8XgQMTe0k5lwn55YIcKkYuk3ptudkIHgN7RLVPXRMTG6A35.0n2Mu', 'user'),
(11, 'wert', 'hg@gmail.com', '$2b$10$VEx1h0CZqU.azHd.Xplhz.LIJpCla33v..1ldOzM9mRpNrTQQsqGK', NULL),
(12, 'ygu', 'gyg@gmail.com', '$2b$10$fD62dXlDEXprus.zc1.bTuDUQMBD2dpOo4H.ToRSAZV7f33Ju1SuW', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE IF NOT EXISTS `user_profile` (
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `gender` enum('male','female','other') DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`user_id`, `name`, `phone`, `address`, `gender`, `birthday`, `profile_picture`, `created_at`) VALUES
(5, 'Valerie', '029808203', 'Calapan City', 'female', '2003-12-01', '/uploads/2b578ea8-bc37-444e-b40e-2f5dc46dd5a2.jpg', '2024-11-02 14:04:56');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `addproducts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_profile`
--
ALTER TABLE `user_profile`
  ADD CONSTRAINT `user_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
