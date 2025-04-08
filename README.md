# 🎵 QuizTune

**QuizTune** is a personalized music quiz app that connects to your **Spotify account** and generates trivia questions based on your favorite tracks. Test your knowledge of your own music taste and discover how well you really know the songs you love.

## 🚀 Features

- 🔐 **Spotify Login** – Sign in securely with your Spotify account  
- 🎧 **Personalized Quizzes** – Questions generated from your Spotify liked songs or top tracks  
- 🧠 **Multiple Question Types** – Guess the song from lyrics, album art, audio preview, or release year  
- 🗂️ **User History** – Keep track of your past scores and performances *(if enabled)*  
- 🌐 **Web-Based** – No installation needed, just log in and play

## 🖼️ Preview

<img src="https://imgur.com/a/2K0BDOC.jpeg" alt="QuizTune Screenshot" width="600"/>

## 🔧 Tech Stack

- **Frontend:** TypeScript, HTML, Vanilla CSS  
- **Backend:** Node.js with JavaScript (Express)  
- **Database:** PostgreSQL  
- **Authentication & Music Data:** Spotify Web API

## 📦 Installation

### 🔹 Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/quiztune.git
   cd quiztune
Set up your PostgreSQL database:

Create a database (e.g., quiztune)

Run migrations or SQL scripts if available

Set environment variables in a .env file inside the server/ folder:

env
Copy
Edit
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/callback

DB_HOST=localhost
DB_PORT=5432
DB_NAME=quiztune
DB_USER=your_db_user
DB_PASSWORD=your_db_password
Install backend dependencies and run the server:

bash
Copy
Edit
cd server
npm install
npm run dev
Set up and run the frontend:

bash
Copy
Edit
cd ../client
npm install
npm run dev
Visit http://localhost:3000 and start quizzing!

⚠️ Ensure your Spotify app's redirect URI matches REDIRECT_URI in your .env.


💬 Feedback
Have suggestions or found a bug? Open an issue or submit a pull request!

Made with ❤️ and 🎶 by Mustafa Tozman
