-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 24, 2024 at 10:35 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

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

CREATE TABLE `addproducts` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `quantity_in_stock` int DEFAULT '0',
  `unit` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `addproducts`
--

INSERT INTO `addproducts` (`id`, `name`, `description`, `price`, `imageUrl`, `quantity_in_stock`, `unit`) VALUES
(1, 'Okinawa', 'Milktea', '85.00', '/uploads/dvlx9u7plgi31.webp', 1975, 'grams'),
(4, 'Wintermelon', 'Milktea', '89.00', '/uploads/pngtree-pearl-milk-tea-pearl-drink-transparent-png-image_9059833.png', 2000, 'grams'),
(7, 'Red Velvet', 'Milktea', '68.00', '/uploads/2b578ea8-bc37-444e-b40e-2f5dc46dd5a2.jpg', 945, 'grams'),
(11, 'Selecta Fram Fresh', 'Milk', '89.00', '/uploads/image-removebg-preview (9).png', 1550, 'ml'),
(12, 'Cup', 'Small', '5.00', '/uploads/image-removebg-preview (7).png', 961, 'pieces'),
(13, 'Straw', 'Straw', '1.00', '/uploads/image-removebg-preview (8).png', 99, 'pieces'),
(14, 'Cup', 'Medium', '6.00', '/uploads/image-removebg-preview (7).png', 169, 'pieces'),
(15, 'Cup', 'Large', '7.00', '/uploads/image-removebg-preview (7).png', 54, 'pieces'),
(16, 'Cup', 'XL', '8.00', '/uploads/image-removebg-preview (7).png', 97, 'pieces'),
(17, 'Straw', 'Straw', '0.00', '/uploads/image-removebg-preview (8).png', 957, 'pieces');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `size`, `quantity`, `price`) VALUES
(66, 21, 4, 'medium', 1, '69.00'),
(67, 22, 4, 'medium', 1, '69.00'),
(68, 22, 7, 'large', 1, '79.00'),
(69, 21, 4, 'medium', 1, '69.00'),
(95, 23, 1, 'small', 2, '59.00'),
(96, 23, 7, 'medium', 8, '69.00'),
(98, 23, 7, 'small', 1, '59.00');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(3, 'huhou', 'uhu@gmail.com', 'wugdu', 'gvk', '2024-10-06 00:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `korders`
--

CREATE TABLE `korders` (
  `id` int NOT NULL,
  `ktotal_amount` decimal(10,2) NOT NULL,
  `kdine_out` varchar(50) DEFAULT NULL,
  `korder_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `korders`
--

INSERT INTO `korders` (`id`, `ktotal_amount`, `kdine_out`, `korder_date`) VALUES
(1, '59.00', 'Dine-in', '2024-11-22 06:20:31'),
(2, '59.00', 'Take-out', '2024-11-22 06:20:31'),
(3, '118.00', 'Dine-in', '2024-11-22 06:21:23'),
(4, '118.00', 'Take-out', '2024-11-22 06:21:23'),
(5, '59.00', 'Take Out', '2024-11-22 14:37:33'),
(6, '118.00', 'Take Out', '2024-11-22 14:41:33'),
(7, '118.00', 'Take Out', '2024-11-22 14:42:16'),
(8, '217.00', 'Take Out', '2024-11-22 14:43:34'),
(9, '59.00', 'Take Out', '2024-11-22 14:43:58'),
(10, '59.00', 'Take Out', '2024-11-22 14:52:03'),
(11, '59.00', 'Take Out', '2024-11-23 04:56:38'),
(12, '118.00', 'Take Out', '2024-11-23 05:42:14'),
(13, '118.00', 'Take Out', '2024-11-23 05:42:51'),
(14, '59.00', 'Take Out', '2024-11-23 06:09:44'),
(15, '59.00', 'Take Out', '2024-11-23 06:10:13'),
(16, '59.00', 'Take Out', '2024-11-23 06:13:11'),
(17, '59.00', 'Take Out', '2024-11-23 06:13:33'),
(18, '59.00', 'Take Out', '2024-11-23 06:33:22'),
(19, '59.00', 'Take Out', '2024-11-23 06:34:08'),
(20, '59.00', 'Take Out', '2024-11-23 07:11:09'),
(21, '118.00', 'Take Out', '2024-11-23 07:11:21'),
(22, '59.00', 'Take Out', '2024-11-23 07:15:07'),
(23, '59.00', 'Take Out', '2024-11-23 07:17:32'),
(24, '59.00', 'Take Out', '2024-11-23 07:22:33'),
(25, '59.00', 'Take Out', '2024-11-23 07:23:06'),
(26, '59.00', 'Take Out', '2024-11-23 07:25:39'),
(27, '59.00', 'Take Out', '2024-11-23 07:25:46'),
(28, '59.00', 'Take Out', '2024-11-23 07:26:09'),
(29, '59.00', 'Take Out', '2024-11-23 07:26:15'),
(30, '59.00', 'Take Out', '2024-11-23 07:26:40'),
(31, '59.00', 'Take Out', '2024-11-23 07:28:01'),
(32, '59.00', 'Take Out', '2024-11-23 08:11:07'),
(33, '148.00', 'Take Out', '2024-11-23 08:13:35'),
(34, '118.00', 'Take Out', '2024-11-23 08:19:02'),
(35, '89.00', 'Take Out', '2024-11-23 08:57:59'),
(36, '89.00', 'Take Out', '2024-11-23 08:58:58'),
(37, '69.00', 'Take Out', '2024-11-23 09:27:09'),
(38, '59.00', 'Take Out', '2024-11-23 13:09:02'),
(39, '118.00', 'Take Out', '2024-11-23 13:09:32'),
(40, '59.00', 'Take Out', '2024-11-23 13:21:16'),
(41, '59.00', 'Take Out', '2024-11-23 13:56:36'),
(42, '59.00', 'Take Out', '2024-11-23 14:15:45'),
(43, '59.00', 'Take Out', '2024-11-23 14:19:36'),
(44, '59.00', 'Take Out', '2024-11-23 15:14:33'),
(45, '59.00', 'Take Out', '2024-11-23 15:24:49'),
(46, '59.00', 'Take Out', '2024-11-23 15:35:30'),
(47, '59.00', 'Take Out', '2024-11-23 15:37:22'),
(48, '89.00', 'Take Out', '2024-11-23 15:38:02'),
(49, '128.00', 'Take Out', '2024-11-23 15:38:56'),
(50, '59.00', 'Take Out', '2024-11-23 15:51:05'),
(51, '59.00', 'Take Out', '2024-11-23 16:02:20'),
(52, '59.00', 'Take Out', '2024-11-24 06:35:29'),
(53, '59.00', 'Take Out', '2024-11-24 06:36:51'),
(54, '59.00', 'Take Out', '2024-11-24 06:56:54'),
(55, '59.00', 'Take Out', '2024-11-24 07:38:06'),
(56, '89.00', 'Take Out', '2024-11-24 10:34:25');

-- --------------------------------------------------------

--
-- Table structure for table `korder_items`
--

CREATE TABLE `korder_items` (
  `id` int NOT NULL,
  `korder_id` int NOT NULL,
  `korder_num` int NOT NULL,
  `kproductname` varchar(255) NOT NULL,
  `ksize` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kquantity` int NOT NULL,
  `kprice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `korder_items`
--

INSERT INTO `korder_items` (`id`, `korder_id`, `korder_num`, `kproductname`, `ksize`, `kquantity`, `kprice`) VALUES
(1, 1, 3339, 'Okinawa', 'small', 1, '59.00'),
(2, 2, 8859, 'Okinawa', 'small', 1, '59.00'),
(3, 3, 7912, 'Wintermelon', 'small', 1, '59.00'),
(4, 3, 4068, 'Red Velvet', 'small', 1, '59.00'),
(5, 4, 4103, 'Wintermelon', 'small', 1, '59.00'),
(6, 4, 5875, 'Red Velvet', 'small', 1, '59.00'),
(7, 5, 3200, 'Okinawa', 'small', 1, '59.00'),
(8, 6, 1632, 'Okinawa', 'small', 1, '59.00'),
(9, 6, 1632, 'Wintermelon', 'small', 1, '59.00'),
(10, 7, 5317, 'Okinawa', 'small', 1, '59.00'),
(11, 7, 5317, 'Wintermelon', 'small', 1, '59.00'),
(12, 8, 5922, 'Red Velvet', 'large', 1, '79.00'),
(13, 8, 5922, 'Okinawa', 'medium', 2, '138.00'),
(14, 9, 2217, 'Wintermelon', 'small', 1, '59.00'),
(15, 10, 1963, 'Wintermelon', 'small', 1, '59.00'),
(16, 11, 562, 'Okinawa', 'small', 1, '59.00'),
(17, 12, 3675, 'Wintermelon', 'small', 2, '118.00'),
(18, 13, 6606, 'Wintermelon', 'small', 2, '118.00'),
(19, 14, 4723, 'Okinawa', 'small', 1, '59.00'),
(20, 15, 2797, 'Wintermelon', 'small', 1, '59.00'),
(21, 16, 8742, 'Wintermelon', 'small', 1, '59.00'),
(22, 17, 3942, 'Wintermelon', 'small', 1, '59.00'),
(23, 18, 9103, 'Wintermelon', 'small', 1, '59.00'),
(24, 19, 1919, 'Wintermelon', 'small', 1, '59.00'),
(25, 20, 6703, 'Okinawa', 'small', 1, '59.00'),
(26, 21, 9457, 'Okinawa', 'small', 1, '59.00'),
(27, 21, 9457, 'Wintermelon', 'small', 1, '59.00'),
(28, 22, 425, 'Wintermelon', 'small', 1, '59.00'),
(29, 23, 8025, 'Wintermelon', 'small', 1, '59.00'),
(30, 24, 2253, 'Okinawa', 'small', 1, '59.00'),
(31, 25, 6723, 'Okinawa', 'small', 1, '59.00'),
(32, 26, 9106, 'Okinawa', 'small', 1, '59.00'),
(33, 27, 5759, 'Wintermelon', 'small', 1, '59.00'),
(34, 28, 8039, 'Wintermelon', 'small', 1, '59.00'),
(35, 29, 1676, 'Wintermelon', 'small', 1, '59.00'),
(36, 30, 7503, 'Wintermelon', 'small', 1, '59.00'),
(37, 31, 3862, 'Okinawa', 'small', 1, '59.00'),
(38, 32, 6637, 'Okinawa', 'small', 1, '59.00'),
(39, 33, 9921, 'Okinawa', 'small', 1, '59.00'),
(40, 33, 9921, 'Red Velvet', 'xl', 1, '89.00'),
(41, 34, 4100, 'Okinawa', 'small', 2, '118.00'),
(42, 35, 9312, 'Wintermelon', 'xl', 1, '89.00'),
(43, 36, 1610, 'Okinawa', 'xl', 1, '89.00'),
(44, 37, 3822, 'Okinawa', 'medium', 1, '69.00'),
(45, 38, 7186, 'Wintermelon', 'small', 1, '59.00'),
(46, 39, 7106, 'Wintermelon', 'small', 1, '59.00'),
(47, 39, 7106, 'Wintermelon', 'small', 1, '59.00'),
(48, 40, 2012, 'Okinawa', 'small', 1, '59.00'),
(49, 41, 5575, 'Okinawa', 'small', 1, '59.00'),
(50, 43, 4398, 'Wintermelon', 'small', 1, '59.00'),
(51, 44, 8838, 'Okinawa', 'small', 1, '59.00'),
(52, 45, 302, 'Wintermelon', 'small', 1, '59.00'),
(53, 46, 771, 'Okinawa', 'small', 1, '59.00'),
(54, 47, 9551, 'Wintermelon', 'small', 1, '59.00'),
(55, 48, 3953, 'Red Velvet', 'xl', 1, '89.00'),
(56, 49, 8159, 'Okinawa', 'small', 1, '59.00'),
(57, 49, 8159, 'Wintermelon', 'medium', 1, '69.00'),
(58, 50, 5036, 'Okinawa', 'small', 1, '59.00'),
(59, 51, 512, 'Okinawa', 'small', 1, '59.00'),
(60, 52, 300, 'Okinawa', 'small', 1, '59.00'),
(61, 53, 4375, 'Okinawa', 'small', 1, '59.00'),
(62, 54, 6631, 'Okinawa', 'small', 1, '59.00'),
(63, 55, 2913, 'Red Velvet', 'small', 1, '59.00'),
(64, 56, 3315, 'Okinawa', 'xl', 1, '89.00');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_status` varchar(50) DEFAULT 'Pending',
  `payment_method` varchar(50) DEFAULT 'COD',
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `order_status`, `payment_method`, `order_date`) VALUES
(43, 5, '69.00', 'pending', 'COD', '2024-11-10 05:43:24'),
(44, 5, '59.00', 'delivered', 'COD', '2024-11-10 10:12:45'),
(45, 5, '79.00', 'Pending', 'COD', '2024-11-11 02:33:41'),
(46, 5, '187.00', 'pending', 'COD', '2024-11-11 02:34:36'),
(47, 5, '69.00', 'Pending', 'COD', '2024-11-11 16:54:18'),
(48, 5, '79.00', 'pending', 'COD', '2024-11-11 16:54:55'),
(49, 5, '138.00', 'pending', 'COD', '2024-11-15 07:39:42'),
(50, 5, '59.00', 'Pending', 'COD', '2024-11-16 02:38:52'),
(51, 5, '69.00', 'Pending', 'COD', '2024-11-16 02:40:10'),
(52, 5, '79.00', 'Pending', 'COD', '2024-11-16 02:45:15'),
(53, 6, '69.00', 'Pending', 'COD', '2024-11-16 02:47:59'),
(54, 5, '69.00', 'Pending', 'COD', '2024-11-16 02:54:48'),
(55, 6, '158.00', 'Pending', 'COD', '2024-11-16 02:55:47'),
(56, 6, '79.00', 'Pending', 'COD', '2024-11-16 02:56:28'),
(57, 6, '79.00', 'Pending', 'COD', '2024-11-16 03:01:23'),
(58, 5, '69.00', 'Pending', 'COD', '2024-11-17 01:45:35'),
(59, 5, '69.00', 'Pending', 'COD', '2024-11-17 01:47:56'),
(60, 5, '69.00', 'Pending', 'COD', '2024-11-17 04:52:39'),
(61, 23, '138.00', 'Pending', 'COD', '2024-11-23 10:04:46'),
(62, 23, '138.00', 'Pending', 'COD', '2024-11-23 10:06:07');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `size` varchar(50) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `size`, `quantity`, `price`) VALUES
(22, 43, 4, 'medium', 1, '69.00'),
(23, 44, 1, 'small', 1, '59.00'),
(24, 45, 4, 'large', 1, '79.00'),
(25, 46, 1, 'small', 2, '59.00'),
(26, 46, 1, 'medium', 1, '69.00'),
(27, 47, 4, 'medium', 1, '69.00'),
(28, 48, 4, 'large', 1, '79.00'),
(29, 49, 1, 'medium', 2, '69.00'),
(30, 51, 1, 'medium', 1, '69.00'),
(31, 52, 1, 'large', 1, '79.00'),
(32, 53, 1, 'medium', 1, '69.00'),
(33, 54, 1, 'medium', 1, '69.00'),
(34, 55, 4, 'large', 2, '79.00'),
(35, 56, 4, 'large', 1, '79.00'),
(36, 57, 1, 'large', 1, '79.00'),
(37, 59, 4, 'medium', 1, '69.00'),
(38, 60, 4, 'medium', 1, '69.00'),
(39, 61, 4, 'medium', 2, '69.00'),
(40, 62, 4, 'medium', 2, '69.00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'jjj', 'jjj@gmail.com', '$2b$10$7PpsYzZkgfgNEDwAYHFbyezQLJK7uh7WlTGoSKkP2q21ifx2zeVWu', 'user'),
(2, 'jsjs', 'hssh@gmail.com', '$2b$10$dj/ZHfuQW2CZYjTF.Gs0suAk95myphqLAyqfQsF2LR1l.cmIVLjs2', 'user'),
(3, 'hhh', 'hgh@gmail.com', '$2b$10$3RpsfzlENC8crYhqCARwpOA/ZDo6A5IWZqJtYmJtst2pCmYAQOyXa', 'admin'),
(4, 'guikg', 'ugug@gmail.com', '$2b$10$.lip0Hgaf.0ctmGjnM0VkOriQgcodDJnc/FNmy3x4Zi7Xx1GAvf0C', 'user'),
(5, 'gwyneth', 'gwyneth@gmail.com', '$2b$10$YE1kXg..9r8Y6hubOB/Cn.2uW1uURiwYvkuJYWXGvEAu5EanS3tUa', 'user'),
(6, 'valerie', 'val@gmail.com', '$2b$10$MERw21XyCGccbo5g.eApEuW2IAzMTl39D3hVNhRkBHqft1TpzXRA2', 'admin'),
(7, 'brucal', 'brucal@gmail.com', '$2b$10$TgwIyWNHVmrOZ0Q9IszCa.0SEI9kPd2mSFgKgdAdjvQclhGzZ7O4i', NULL),
(8, 'baek', 'baek@gmail.com', '$2b$10$y0stYaUGh1HOHGKcsLm3C.WQ3KmRKz93JHEZVp0QqfAWbmNPLdzay', NULL),
(9, 'tres', 'ftf@gmail.com', '$2b$10$ZvDGanFWKfOOBQOtOpogOu4fVp/VPZ5tTVftXIL6eM23kQlRzji.K', NULL),
(10, 'nar', 'nar@gmail.com', '$2b$10$8XgQMTe0k5lwn55YIcKkYuk3ptudkIHgN7RLVPXRMTG6A35.0n2Mu', 'user'),
(11, 'wert', 'hg@gmail.com', '$2b$10$VEx1h0CZqU.azHd.Xplhz.LIJpCla33v..1ldOzM9mRpNrTQQsqGK', NULL),
(12, 'ygu', 'gyg@gmail.com', '$2b$10$fD62dXlDEXprus.zc1.bTuDUQMBD2dpOo4H.ToRSAZV7f33Ju1SuW', NULL),
(13, 'air', 'air@gmail.com', '$2b$10$055DNCsKpqdGdjbUP/QnfO9NVy2EfcT4WClEyDDV56tt/mQQkavPC', 'user'),
(14, 'nicole', 'iuo@gmail.com', '$2b$10$PrGbxJctWEHiAm1.T93bquOmEe.MUuzJwkwir.Tn5AVmV7iYlYrAW', 'user'),
(15, 'jnj', 'ioi@hhai.sniw', '$2b$10$v8lhOLh.kat6iEz6Y/YfQubCMC0huGSwqrcMBePQZ88Adxj4TAEr6', 'user'),
(16, 'i29', 'ijij@hhd.com', '$2b$10$yZZTPDgx1PS8bYFILyxGCeoFyZAVn0yLKGbvg2.ypc3.b4cW9X0Vi', 'user'),
(17, 'gwojo', 'gwojo@gmail.com', '$2b$10$twInFY747qGzjbQqOtFfbOthBYZkUmWBS2sRs225qkcCJ7/pdRT16', 'user'),
(18, 'reymel', 'reymel@gmail.com', '$2b$10$OPyEfJBYlJ4odz0fRyofmu2dMbJyBhrql4CQMYWN5zWio2GS7JWYm', 'user'),
(19, 'maria', 'maria@gmail.com', '$2b$10$WLEGY5b/IlGCJ.eCXOBDH.ll/trFAM9h73JGYf5x7lxe4EnTk2RAW', 'user'),
(20, 'hanah', 'hanah@gmail.com', '$2b$10$VTUK3xjT2R1P6fquqAdk9.6cEXLKRcUEpFAdNI7.nSPHx9l/ULpQO', 'user'),
(21, 'chloe', 'chloe@gmail.com', '$2b$10$3qfx3ac/nXaa2aMztMNMB.L9ieJ9wkKieFKmtzUShhpit0he9tzSy', 'user'),
(22, 'gina', 'gina@gmail.com', '$2b$10$.nD92vYe6jTt.cQUosTyE.8dk8P45OwODNFsfjhXB18dKHnRfqsQ6', 'user'),
(23, 'deng', 'deng@gmail.com', '$2b$10$8FV3hw7uESX8j4GVwPob8.RrrUf.IdPIlWSoGS.O.c2R0S.dY2lt6', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

CREATE TABLE `user_profile` (
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `age` int DEFAULT '0',
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `street_name` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`user_id`, `name`, `phone`, `gender`, `birthday`, `age`, `profile_picture`, `created_at`, `street_name`, `city`, `barangay`, `zip_code`) VALUES
(5, 'Gwyneth Valerie Brucal', '0998282829', 'male', '2005-02-16', 19, '/uploads/photo-1507525428034-b723cf961d3e.jpg', '2024-11-04 08:03:04', 'Sitio Silangans', 'pola', 'Minasds', '5200'),
(6, 'Valerie', '0972727727', 'female', '2003-06-18', 21, '/uploads/5641077a8bb21e742a9b11767e57ebd4.jpg', '2024-11-16 02:47:26', 'Sitio Kanluran', 'calapan', 'Calero', '5200'),
(8, 'Valerie', '029808203', 'female', '2003-12-01', 0, '/uploads/2b578ea8-bc37-444e-b40e-2f5dc46dd5a2.jpg', '2024-11-02 14:04:56', NULL, NULL, NULL, NULL),
(14, 'Nicole', '0983838923', 'female', '2003-12-04', 0, '/uploads/71581729_244836983134320_3264554682630012928_n.jpg', '2024-11-04 15:23:23', NULL, NULL, NULL, NULL),
(21, 'Chloe', '09829202929', 'female', '2004-03-24', 20, '/uploads/457376907_1031368765282933_2359674016339035573_n.jpg', '2024-11-09 04:13:08', 'Sitio Centro', 'calapan', 'Balingayan', '5200'),
(22, 'Gina Castillo', '09217923737', 'female', '2003-02-20', 21, '/uploads/dvlx9u7plgi31.webp', '2024-11-09 04:16:01', 'Sitio Centro', 'calapan', 'Batino', '5200'),
(23, 'Maria Hanah G. Mendoza', '0999999999', 'female', '2003-08-09', 21, NULL, '2024-11-23 10:03:51', 'Mag-asawang Parang', 'calapan', 'Parang', '5200');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addproducts`
--
ALTER TABLE `addproducts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id2` (`user_id`),
  ADD KEY `fk_product_id` (`product_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `korders`
--
ALTER TABLE `korders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `korder_items`
--
ALTER TABLE `korder_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `korder_id` (`korder_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_items_ibfk_1` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_profile`
--
ALTER TABLE `user_profile`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addproducts`
--
ALTER TABLE `addproducts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `korders`
--
ALTER TABLE `korders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `korder_items`
--
ALTER TABLE `korder_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `addproducts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_id2` FOREIGN KEY (`user_id`) REFERENCES `user_profile` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `korder_items`
--
ALTER TABLE `korder_items`
  ADD CONSTRAINT `korder_items_ibfk_1` FOREIGN KEY (`korder_id`) REFERENCES `korders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `addproducts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profile`
--
ALTER TABLE `user_profile`
  ADD CONSTRAINT `user_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
