# 🎵 QuizTune

**QuizTune** is a personalized music quiz app that connects to your **Spotify account** and generates trivia questions based on your favorite tracks. Test your knowledge of your own music taste and discover how well you really know the songs you love.

## 🚀 Features

- 🔐 **Spotify Login** – Sign in securely with your Spotify account  
- 🎧 **Personalized Quizzes** – Questions generated from your Spotify liked songs or top tracks  
- 🧠 **Multiple Question Types** – Guess the song from popularity, album art,artist name or release year  
- 🗂️ **User History** – Keep track of your past scores and performances *(if enabled)*  

## 🖼️ Preview


<img src="https://imgur.com/W6tGLKV.png" alt="QuizTune Home" width="500"/>	<img src="https://imgur.com/Do6fGc4.png" alt="QuizTune Quiz" width="500"/>
<img src="https://imgur.com/p6YTabC.png" alt="QuizTune Result" width="500"/>	<img src="https://imgur.com/KOMrHuD.png" alt="QuizTune Leaderboard" width="500"/>




## 🔧 Tech Stack

- **Frontend:** TypeScript, HTML, Vanilla CSS  
- **Backend:** Node.js with JavaScript (Express)  
- **Database:** PostgreSQL  
- **Authentication & Music Data:** Spotify Web API

## 📦 Installation

### 🔹 Run Locally
1. Clone the repo
2. Set environment variables in a .env file inside the /quiz_backend folder:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quiztune
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```
3. Install backend dependencies and run the server:

You can find the latest PostgreSQL backup in [/database/backups/quiztune_backup.backup](/backups/quiztune_backup.backup)

To restore the backup:

- Using pgAdmin: Right-click your database → Restore, select the .sql file, and run it.

- Using CLI:
psql -U your_username -d your_database -f path/to/quiztune_backup.sql

## Starting the app

```
cd quiz_backend
npm install
npm run dev
```
Set up and run the frontend:

```
cd quiz_frontend
npm install
npm run dev
```
Visit http://localhost:3000 and start quizzing!

⚠️ Spotify Access Required
   To log in to the app, your Spotify email and username must be added to the Spotify Developer Dashboard.
   You can either:

- Open an issue or leave a comment to request access.
- Or create your own Spotify app by following this [guide](https://developer.spotify.com/documentation/web-api/concepts/apps).
If you go this route, you'll need to replace the clientId in:
quiztune_frontend/pages/login.tsx

---

💬 Feedback
Have suggestions or found a bug? Open an issue or submit a pull request!

Made with ❤️ and 🎶 by Mustafa Tozman
