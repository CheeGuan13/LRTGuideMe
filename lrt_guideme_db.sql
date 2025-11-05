-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2025 at 01:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lrt_guideme_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `name`, `email`, `created_at`) VALUES
(1, 'admin', '$2b$12$xYVnFA9lUnFXAsugN5CY.elA1W.ajaZJ5Vigksby6rDXUdDWf.KQK', 'admin', 'b2400843@helplive.edu.my', '2025-11-03 10:18:06');

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `w` int(11) NOT NULL,
  `h` int(11) NOT NULL,
  `fill_color` varchar(20) DEFAULT '#e7eaf0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `areas`
--

INSERT INTO `areas` (`id`, `level_id`, `label`, `x`, `y`, `w`, `h`, `fill_color`) VALUES
(1, 1, 'KL CAT / Info', 90, 180, 260, 150, '#fdeef2'),
(2, 1, 'Kelana Jaya Hall', 370, 160, 360, 190, '#fff6cc'),
(3, 1, 'KLIA Transit / Express', 760, 180, 180, 150, '#efe7ff'),
(4, 1, 'Shops (West)', 120, 360, 350, 110, '#d9f7f5'),
(5, 1, 'Shops (East)', 560, 360, 320, 110, '#d9f7f5'),
(6, 2, 'Platform 1 / 2', 160, 130, 700, 90, '#e8f5e9'),
(7, 2, 'Concourse Bridge', 160, 220, 700, 90, '#f0fdf4'),
(8, 2, 'Platform 3 / 4', 160, 310, 700, 90, '#e3f2fd');

-- --------------------------------------------------------

--
-- Table structure for table `cross_links`
--

CREATE TABLE `cross_links` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `from_poi_id` varchar(100) NOT NULL,
  `to_poi_id` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cross_links`
--

INSERT INTO `cross_links` (`id`, `station_id`, `from_poi_id`, `to_poi_id`, `type`) VALUES
(1, 1, 'l1-escW', 'l2-escN', 'escalator'),
(2, 1, 'l1-escS', 'l2-escS', 'escalator'),
(3, 1, 'l1-liftW', 'l2-liftN', 'elevator'),
(4, 1, 'l1-liftS', 'l2-liftS', 'elevator'),
(5, 1, 'l1-rampA', 'l2-liftN', 'accessible'),
(6, 1, 'l1-rampB', 'l2-liftS', 'accessible');

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `map_width` int(11) DEFAULT 1000,
  `map_height` int(11) DEFAULT 540,
  `background_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`id`, `station_id`, `level_name`, `map_width`, `map_height`, `background_image`) VALUES
(1, 1, 'L1', 1000, 540, NULL),
(2, 1, 'L2', 1000, 540, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pois`
--

CREATE TABLE `pois` (
  `id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `poi_id_string` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `x_coord` int(11) NOT NULL,
  `y_coord` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pois`
--

INSERT INTO `pois` (`id`, `level_id`, `poi_id_string`, `name`, `type`, `x_coord`, `y_coord`) VALUES
(1, 1, 'l1-info', 'Customer Service', 'service', 170, 230),
(2, 1, 'l1-ticket', 'Ticket Counter', 'ticket', 230, 270),
(3, 1, 'l1-toiletW', 'Toilet (West)', 'toilet', 110, 340),
(4, 1, 'l1-toiletC', 'Toilet (Center)', 'toilet', 500, 210),
(5, 1, 'l1-serviceC', 'Information Desk', 'service', 600, 250),
(6, 1, 'l1-klia-tix', 'KLIA Ticketing', 'ticket', 820, 270),
(7, 1, 'l1-prayerE', 'Prayer Room', 'prayer', 900, 230),
(8, 1, 'l1-retailW1', 'Cafe', 'retail', 170, 395),
(9, 1, 'l1-liftS', 'Elevator (South)', 'elevator', 420, 420),
(10, 1, 'l1-liftW', 'Elevator (North)', 'elevator', 420, 300),
(11, 1, 'l1-escS', 'Escalator (South)', 'escalator', 620, 420),
(12, 1, 'l1-escW', 'Escalator (North)', 'escalator', 620, 300),
(13, 1, 'l1-retailE1', 'Bakery', 'retail', 300, 440),
(14, 1, 'l1-retailE2', 'Pharmacy', 'retail', 750, 420),
(15, 1, 'l1-exitA', 'Pintu A (NU Sentral)', 'exit', 240, 505),
(16, 1, 'l1-exitB', 'Pintu B (Brickfields)', 'exit', 820, 505),
(17, 1, 'l1-rampA', 'Ramp A', 'accessible', 130, 505),
(18, 1, 'l1-rampB', 'Ramp B', 'accessible', 950, 505),
(19, 2, 'l2-escN', 'Escalator (North)', 'escalator', 520, 175),
(20, 2, 'l2-liftN', 'Elevator (North)', 'elevator', 220, 175),
(21, 2, 'l2-toiletN', 'Toilet (North)', 'toilet', 820, 175),
(22, 2, 'l2-info', 'Platform Info', 'service', 520, 265),
(23, 2, 'l2-escS', 'Escalator (South)', 'escalator', 520, 345),
(24, 2, 'l2-liftS', 'Elevator (South)', 'elevator', 220, 345),
(25, 2, 'l2-toiletS', 'Toilet (South)', 'toilet', 820, 345),
(26, 2, 'l2-exit', 'Exit to Concourse', 'exit', 220, 265);

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `default_level` varchar(20) DEFAULT 'L1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `name`, `default_level`) VALUES
(1, 'KL Sentral', 'L1');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` varchar(255) DEFAULT 'assets/images/user-icon.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `avatar`) VALUES
(1, 'Darryl', 'b2400857@helplive.edu.my', '$2y$10$x4Pw1LObfZxc.e8j/mCHxeLf13.LP61R/oepAgHGXDrgPXz4nNnuK', '2025-10-22 20:00:00', 'uploads/avatar_690793ade4a09_user-icon.png'),
(3, 'Bin', 'Zhiquan@gmail.com', '$2y$10$mIRGvZwWqhMojibwO/E03uHf3T4WtUn/FIEPukHhDE790XMEt78ZS', '2025-11-03 13:44:18', 'uploads/avatar_6909c426eb2f0_WhatsApp Image 2025-10-30 at 21.42.00_a276cbe2.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `cross_links`
--
ALTER TABLE `cross_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `station_id` (`station_id`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `station_id` (`station_id`);

--
-- Indexes for table `pois`
--
ALTER TABLE `pois`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `poi_id_string_unique` (`poi_id_string`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cross_links`
--
ALTER TABLE `cross_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pois`
--
ALTER TABLE `pois`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `areas`
--
ALTER TABLE `areas`
  ADD CONSTRAINT `areas_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cross_links`
--
ALTER TABLE `cross_links`
  ADD CONSTRAINT `cross_links_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `levels`
--
ALTER TABLE `levels`
  ADD CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pois`
--
ALTER TABLE `pois`
  ADD CONSTRAINT `pois_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
