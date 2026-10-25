# Movie Web Application

Egy webes alkalmazás filmek böngészésére, keresésére és értékelésére, felhasználói fiók kezeléssel.

---

## Használt Technológiák

- **Frontend:** React, HTML5, CSS3 / Tailwind, Axios
- **Backend:** Node.js, Express.js
- **Adatbázis:** MySQL
- **Verziókövetés & Projektmenedzsment:** Git, GitHub, Trello

---

## Helyi futtatási útmutató

A projekt futtatásához szükség van a [Node.js](https://nodejs.org/)és a [npm] telepítésére a gépeden. A [XAMPP](https://www.apachefriends.org/download.html) alkalmazásra is, az adatbázishoz. PhpMyAdmin oldalon kell majd az adatbázis lokálisan hosztolni.

### 1. Repository

A github repo (https://github.com/hajdulajos668/imdb-project.git)

### 2. környezeti változók beállítása a Backend-en

Hozz létre egy '.env' fájl a 'env.example' alapján és írd be a portokat, adatbázis nevét és ments rá.

### 3. Backend server futtatás

Lépj be a my_Backend mappába és nyiss egy terminált, add ki a 'npm install' parancsot. Majd az 'npm run dev' parancsot. Innen is látod a backend portját

### 4. Frontend futtatása

Lépj be a my_Frontend mappába és nyiss egy terminált, add ki a 'npm install' parancsot. Majd az 'npm run dev' parancsot. Innen is látod a Frontend portját

### 5. Adatbázis importálása
A xampp alkalmazáson belül  phpMyAdmin indítsd el az apache és MySQL szolgáltatásokat. Majd a phpMyAdmin weboldalán hozz létre egy 'mydb' nevű üres adatbázist és ebbe importáld be a táblákat amit a my_Backend/db mappában találsz