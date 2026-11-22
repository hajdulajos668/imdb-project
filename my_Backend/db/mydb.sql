-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2026 at 08:28 AM
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
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `added_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`user_id`, `movie_id`, `added_at`) VALUES
(7, 1, '2026-11-16 10:36:57'),
(7, 2, '2026-11-16 10:37:42'),
(7, 11, '2026-11-16 10:17:30'),
(10, 1, '2026-11-17 12:39:01'),
(10, 2, '2026-11-17 12:39:11'),
(10, 3, '2026-11-17 12:39:12'),
(10, 4, '2026-11-17 12:39:13'),
(10, 5, '2026-11-17 12:39:14'),
(10, 6, '2026-11-17 12:39:15'),
(10, 7, '2026-11-17 12:39:16'),
(10, 8, '2026-11-17 12:39:17');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `isNew` tinyint(1) DEFAULT 0,
  `duration` int(11) DEFAULT 120
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `release_date`, `genre`, `poster_url`, `isNew`, `duration`) VALUES
(1, 'Mátrix', 'Egy hacker rájön, hogy a valóság, amit ismer, csak egy számítógépes szimuláció.', '1999-03-31', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 0, 120),
(2, 'Dűne: Második rész', 'Paul Atreides egyesíti erőit a fremenekkel, hogy bosszút álljon a családja elpusztítóin.', '2024-02-28', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/files/dune-part-two_tidfhvjl.jpg?v=1762975408&width=500', 1, 120),
(3, 'Eredet', 'Tolvajok egy csoportja behatol az emberek álmaiba, hogy titkokat lopjanak el.', '2010-07-16', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', 0, 120),
(4, 'A Gyűrűk Ura: A Gyűrű Szövetsége', 'Egy ifjú hobbit feladata, hogy megsemmisítsen egy nagy hatalmú gyűrűt, mielőtt az a sötét úr kezébe kerül.', '2001-12-19', 'Fantasy', 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 0, 120),
(5, 'A sötét lovag', 'Batmannek egy új, kaotikus gonosztevővel, Jokerrel kell szembenéznie Gotham városában.', '2008-07-18', 'Action', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 0, 120),
(6, 'Csillagok között', 'Egy űrhajóscsapat egy féreglyukon keresztül utazik, hogy új otthont találjon a pusztuló Föld helyett.', '2014-11-07', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/files/interstellar-139399.jpg?v=1762974876&width=1680', 0, 120),
(7, 'Gladiátor II', 'Évekkel Maximus halála után Luciusnak a Colosseumban kell küzdenie a birodalom túléléséért.', '2024-11-22', 'Action', 'https://www.movieposters.com/cdn/shop/files/scan_2269aed4-cfa4-4787-93af-6cc03143c55d.jpg?v=1762977632&width=1680', 1, 120),
(8, 'Deadpool & Rozsomák', 'A nagyszájú zsoldos és a morcos mutáns kénytelen összefogni a multiverzum megmentéséért.', '2024-07-26', 'Action', 'https://www.movieposters.com/cdn/shop/files/deadpool-wolverine_866a70e7-fb48-4f35-a44b-41594691ac76.jpg?v=1762977021&width=1680', 1, 120),
(9, 'Oppenheimer', 'J. Robert Oppenheimer fizikus története és az első atombomba kifejlesztése.', '2023-07-21', 'Drama', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 0, 120),
(10, 'Vissza a jövőbe', 'Egy tinédzser véletlenül visszautazik 1955-be egy plutóniummal hajtott DeLorean időgéppel.', '1985-07-03', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/files/backtofuture.mpw.jpg?v=1762467212&width=1680', 0, 120),
(11, 'Alien: Romulus', 'Fiatal űrkolonizálók egy elhagyatott űrállomáson a világegyetem legfélelmetesebb életformájával találkoznak.', '2024-08-16', 'Horror', 'https://www.movieposters.com/cdn/shop/files/alien_romulus.jpg?v=1762976144&width=1680', 1, 120),
(12, 'Agymanók 2', 'Riley eléri a tinédzserkort, és az elméjében új, váratlan érzelmek veszik át az irányítást.', '2024-06-14', 'Animation', 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', 1, 120),
(13, 'Jurassic Park', 'Egy tudósokból álló csoport egy klónozott dinoszauruszokkal teli szigeten reked.', '1993-06-11', 'Adventure', 'https://www.movieposters.com/cdn/shop/files/jurassicpark.mpw.jpg?v=1762464743&width=1680', 0, 120),
(14, 'Ponyvaregény', 'Két bérgyilkos, egy bokszoló és egy gengszter feleségének sorsa fonódik össze Los Angelesben.', '1994-10-14', 'Crime', 'https://www.movieposters.com/cdn/shop/files/PulpFiction.Ver1.jpg?v=1762475243&width=1680', 0, 120),
(15, 'Avatar: A víz útja', 'Jake Sully és családja új veszélyekkel és ellenségekkel néz szembe Pandora óceánjain.', '2022-12-16', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/products/avatar-the-way-of-water_sncuhzap.jpg?v=1762971780&width=1680', 0, 120),
(16, 'Barbie', 'Barbie egy nap rájön, hogy a tökéletes élete nem is annyira tökéletes, ezért a való világba utazik.', '2023-07-21', 'Comedy', 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', 0, 120),
(17, 'A Keresztapa', 'Egy New York-i maffiacsalád öregedő vezetője átadja a hatalmat vonakodó fiának.', '1972-03-24', 'Crime', 'https://www.movieposters.com/cdn/shop/products/b5282f72126e4919911509e034a61f66_6ce2486d-e0da-4b7a-9148-722cdde610b8.jpg?v=1762507445&width=1680', 0, 120),
(18, 'Furiosa: Történet a Mad Maxből', 'A fiatal Furiosa elrablása után megpróbál hazajutni a posztapokaliptikus pusztaságon át.', '2024-05-24', 'Action', 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', 1, 120),
(19, 'Harcosok klubja', '', '1999-10-15', 'Drama', 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 0, 120),
(20, 'Terminátor 2. - Az ítélet napja', 'Egy jövőből küldött kiborg feladata, hogy megvédjen egy fiút a még fejlettebb, folyékony fémből készült géptől.', '1991-07-03', 'Action', 'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg', 0, 120),
(21, 'Pókember: A Pókverzumon át', 'Miles Morales a multiverzumban találkozik más Pókemberekkel, de egy nehéz döntés miatt szembe is kerül velük.', '2023-06-02', 'Animation', 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', 0, 120),
(22, 'Mentőexpedíció', 'Egy űrhajóst halottnak hisznek, és a Marson hagyják. Egyedül kell túlélnie, míg a Földről mentőcsapatot küldenek.', '2015-10-02', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg', 0, 120);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `review_text` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `user_id`, `movie_id`, `rating`, `created_at`, `review_text`, `updated_at`, `is_deleted`) VALUES
(6, 8, 1, 5, '2026-11-13 11:14:30', NULL, '2026-11-22 07:26:35', 1),
(7, 8, 2, 5, '2026-11-13 11:33:16', NULL, '2026-11-16 09:43:31', 0),
(10, 7, 2, 4, '2026-11-16 09:59:42', 'Nagyon tetszett, jó film!', '2026-11-16 09:59:42', 0),
(12, 10, 1, 5, '2026-11-17 12:39:07', 'asdasdasdasdasdasdas', '2026-11-17 12:39:07', 0),
(13, 10, 2, 5, '2026-11-17 12:42:17', 'dawdawdawd', '2026-11-17 12:42:17', 0),
(14, 10, 3, 5, '2026-11-17 12:42:25', 'dawdawdaawdawd', '2026-11-17 12:42:25', 0),
(15, 10, 4, 5, '2026-11-17 12:42:33', 'awdawdawdawdaw', '2026-11-17 12:42:33', 0),
(17, 11, 1, 5, '2026-11-22 07:27:32', 'welkfnaonwfoiawfawf', '2026-11-22 07:27:32', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(30) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `is_admin`) VALUES
(1, 'valami1', 'valami@gmail.com', '', 0),
(2, 'Valami2', 'valami2@gmail.com', '', 0),
(3, 'valami3', 'valami3@gmail.com', '', 0),
(5, 'eeeeeee', 'valami123@gmail.com', '$2b$10$0jCzMubgtxC/ndc/v3hRAe4Fk8FqjwpW7v4dUgwaRyXR3aJPztKp2', 0),
(6, 'eeeeeeeeeee', 'valami1234@gmail.com', '$2b$10$8Cnv.ctOQVzl/zQ3gaedVOShucBEBwbkhgZ8yRT/A75xA9dkInnPu', 0),
(7, 'user', 'user@user.com', '$2b$10$t9Q8DXylmUTzcX/GWwxpLuJqYxmSinoXjM2d8xFC62zKIabrdF5I.', 0),
(8, 'teszt13', 'teszt@teszt.com', '$2b$10$JJv3/KZbabFxwnpSqcE2vuogKoZteUFt.S3RYcb2V9yFlFT.ZWAdm', 0),
(9, 'Teszt123', 'teszt@gmail.com', '$2b$10$9wop4Dqu/AMabu9cR./zfO2wf2vNiWYjSkTt9VL.Xtr4hC8G3lM.a', 0),
(10, 'valaki', 'valaki@gmail.com', '$2b$10$iKMANA/vo9mYHk9ubskMzOYdNJE8RJb11jkhvw4A/s.bbJJNhLGGi', 0),
(11, 'valakiadmin', 'valaki@admin.com', '$2b$10$UrXuzZlL1NRwBGcYzTWRiun45NfC/A6ktqVwZ9wgQBIPjC0TiJ8W.', 1),
(12, 'valaki', 'valaki@nem.com', '$2b$10$k30Zsbuipt.yFgyp6t0YpOecyHoTUwXgc94YcAHjoMuI9tO3sNkRS', 0);

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`id`, `user_id`, `movie_id`, `added_at`) VALUES
(14, 6, 1, '2026-11-12 14:25:45'),
(18, 7, 5, '2026-11-16 10:17:23'),
(24, 9, 2, '2026-11-17 12:02:43'),
(25, 9, 3, '2026-11-17 12:02:46'),
(26, 9, 8, '2026-11-17 12:02:49'),
(27, 9, 11, '2026-11-17 12:04:04'),
(28, 9, 1, '2026-11-17 12:04:10'),
(29, 9, 21, '2026-11-17 12:04:37'),
(30, 10, 1, '2026-11-17 12:39:00'),
(31, 10, 2, '2026-11-17 12:39:18'),
(32, 10, 3, '2026-11-17 12:39:21'),
(33, 10, 4, '2026-11-17 12:39:23'),
(34, 10, 7, '2026-11-17 12:42:37'),
(35, 10, 9, '2026-11-17 12:42:40'),
(36, 10, 19, '2026-11-17 12:42:45'),
(37, 10, 16, '2026-11-17 12:42:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`movie_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_movie` (`user_id`,`movie_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_movie` (`user_id`,`movie_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `watchlist`
--
ALTER TABLE `watchlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `watchlist_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
