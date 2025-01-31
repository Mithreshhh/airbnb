WanderLust is a simple and easy-to-use Airbnb clone built with Node.js, Express, and MongoDB. It allows users to list, browse, and review rental properties.

Features ✨:
🏠 Add, edit, and delete property listings
🔐 Secure user authentication with Passport.js
💬 Users can leave reviews and ratings
🖼️ Upload property images using Multer
🛡️ JWT authentication for secure API access

Tech Stack 🛠️-
Backend: Node.js, Express.js, MongoDB
Authentication: Passport.js, JWT
Image Uploads: Multer
Other Libraries: dotenv, bcryptjs, express-session

Installation:
Clone the repository:
git clone https://github.com/yourusername/wanderlust.git
cd wanderlust

Install dependencies:
npm install

Create a .env file:
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

Run the server:
npm start

API Endpoints :
GET /listings → Get all property listings
POST /listings → Add a new property
GET /listings/:id → Get details of a specific property
POST /auth/signup → User signup
POST /auth/login → User login

Contributing 🤝-
Want to improve WanderLust? Fork the repo, make changes, and submit a pull request
