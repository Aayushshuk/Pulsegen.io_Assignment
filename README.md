How to Run the Project
1. Prerequisites

Make sure you have these installed:
Node.js (v18+ recommended)
npm (comes with Node)
MongoDB (local or MongoDB Atlas)
FFmpeg + FFprobe (required for video metadata)

2. Backend Setup
cd backend
cp .env.example .env
npm install
Edit your .env file if needed:
PORT=4000
MONGO_URI=mongodb://localhost:27017/video_app
JWT_SECRET=change_me
UPLOAD_DIR=./uploads
FFMPEG_PATH=ffmpeg
Start the backend:
npm run dev
You should see:
Backend listening on 4000
Seed an admin user (run once):
curl -X POST http://localhost:4000/api/auth/seed-admin
Now you can log in with:
email: admin@example.com
password: admin123

Frontend Setup
cd ../frontend
cp .env.example .env
npm install
npm run dev
Visit :http://localhost:5173
