-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2026 at 03:56 PM
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
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `isNew` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `release_date`, `genre`, `poster_url`, `isNew`) VALUES
(1, 'Mátrix', 'Egy hacker rájön, hogy a valóság, amit ismer, csak egy számítógépes szimuláció.', '1999-03-31', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 0),
(2, 'Dűne: Második rész', 'Paul Atreides egyesíti erőit a fremenekkel, hogy bosszút álljon a családja elpusztítóin.', '2024-02-28', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/files/dune-part-two_tidfhvjl.jpg?v=1762975408&width=500', 1),
(3, 'Eredet', 'Tolvajok egy csoportja behatol az emberek álmaiba, hogy titkokat lopjanak el.', '2010-07-16', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', 0),
(4, 'A Gyűrűk Ura: A Gyűrű Szövetsége', 'Egy ifjú hobbit feladata, hogy megsemmisítsen egy nagy hatalmú gyűrűt, mielőtt az a sötét úr kezébe kerül.', '2001-12-19', 'Fantasy', 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 0),
(5, 'A sötét lovag', 'Batmannek egy új, kaotikus gonosztevővel, Jokerrel kell szembenéznie Gotham városában.', '2008-07-18', 'Action', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 0),
(6, 'Csillagok között', 'Egy űrhajóscsapat egy féreglyukon keresztül utazik, hogy új otthont találjon a pusztuló Föld helyett.', '2014-11-07', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/files/interstellar-139399.jpg?v=1762974876&width=1680', 0),
(7, 'Gladiátor II', 'Évekkel Maximus halála után Luciusnak a Colosseumban kell küzdenie a birodalom túléléséért.', '2024-11-22', 'Action', 'https://www.movieposters.com/cdn/shop/files/scan_2269aed4-cfa4-4787-93af-6cc03143c55d.jpg?v=1762977632&width=1680', 1),
(8, 'Deadpool & Rozsomák', 'A nagyszájú zsoldos és a morcos mutáns kénytelen összefogni a multiverzum megmentéséért.', '2024-07-26', 'Action', 'https://www.movieposters.com/cdn/shop/files/deadpool-wolverine_866a70e7-fb48-4f35-a44b-41594691ac76.jpg?v=1762977021&width=1680', 1),
(9, 'Oppenheimer', 'J. Robert Oppenheimer fizikus története és az első atombomba kifejlesztése.', '2023-07-21', 'Drama', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 0),
(10, 'Vissza a jövőbe', 'Egy tinédzser véletlenül visszautazik 1955-be egy plutóniummal hajtott DeLorean időgéppel.', '1985-07-03', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/files/backtofuture.mpw.jpg?v=1762467212&width=1680', 0),
(11, 'Alien: Romulus', 'Fiatal űrkolonizálók egy elhagyatott űrállomáson a világegyetem legfélelmetesebb életformájával találkoznak.', '2024-08-16', 'Horror', 'https://www.movieposters.com/cdn/shop/files/alien_romulus.jpg?v=1762976144&width=1680', 1),
(12, 'Agymanók 2', 'Riley eléri a tinédzserkort, és az elméjében új, váratlan érzelmek veszik át az irányítást.', '2024-06-14', 'Animation', 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', 1),
(13, 'Jurassic Park', 'Egy tudósokból álló csoport egy klónozott dinoszauruszokkal teli szigeten reked.', '1993-06-11', 'Adventure', 'https://www.movieposters.com/cdn/shop/files/jurassicpark.mpw.jpg?v=1762464743&width=1680', 0),
(14, 'Ponyvaregény', 'Két bérgyilkos, egy bokszoló és egy gengszter feleségének sorsa fonódik össze Los Angelesben.', '1994-10-14', 'Crime', 'https://www.movieposters.com/cdn/shop/files/PulpFiction.Ver1.jpg?v=1762475243&width=1680', 0),
(15, 'Avatar: A víz útja', 'Jake Sully és családja új veszélyekkel és ellenségekkel néz szembe Pandora óceánjain.', '2022-12-16', 'Sci-Fi', 'https://www.movieposters.com/cdn/shop/products/avatar-the-way-of-water_sncuhzap.jpg?v=1762971780&width=1680', 0),
(16, 'Barbie', 'Barbie egy nap rájön, hogy a tökéletes élete nem is annyira tökéletes, ezért a való világba utazik.', '2023-07-21', 'Comedy', 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', 0),
(17, 'A Keresztapa', 'Egy New York-i maffiacsalád öregedő vezetője átadja a hatalmat vonakodó fiának.', '1972-03-24', 'Crime', 'https://www.movieposters.com/cdn/shop/products/b5282f72126e4919911509e034a61f66_6ce2486d-e0da-4b7a-9148-722cdde610b8.jpg?v=1762507445&width=1680', 0),
(18, 'Furiosa: Történet a Mad Maxből', 'A fiatal Furiosa elrablása után megpróbál hazajutni a posztapokaliptikus pusztaságon át.', '2024-05-24', 'Action', 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', 1),
(19, 'Harcosok klubja', '', '1999-10-15', 'Drama', 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 0),
(20, 'Terminátor 2. - Az ítélet napja', 'Egy jövőből küldött kiborg feladata, hogy megvédjen egy fiút a még fejlettebb, folyékony fémből készült géptől.', '1991-07-03', 'Action', 'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg', 0),
(21, 'Pókember: A Pókverzumon át', 'Miles Morales a multiverzumban találkozik más Pókemberekkel, de egy nehéz döntés miatt szembe is kerül velük.', '2023-06-02', 'Animation', 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', 0),
(22, 'Mentőexpedíció', 'Egy űrhajóst halottnak hisznek, és a Marson hagyják. Egyedül kell túlélnie, míg a Földről mentőcsapatot küldenek.', '2015-10-02', 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(30) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`) VALUES
(1, 'valami1', 'valami@gmail.com'),
(2, 'Valami2', 'valami2@gmail.com'),
(3, 'valami3', 'valami3@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
