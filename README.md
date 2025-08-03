# SocialHub - Community Platform

SocialHub is a vibrant community platform where users can connect, share their thoughts, and engage in meaningful conversations. It is a full-stack application with a React frontend and a Node.js/Express backend.

## Features

- **User Authentication**: Secure user registration and login using JWT.
- **User Profiles**: Users can view their own profile, edit their details (name, username, bio, password), and view other users' profiles.
- **Post Management**: Create, view, edit, and delete posts.
- **Interactive Feed**: The homepage displays a feed of all posts, which can be searched by content and author.
- **Social Interactions**: Users can like posts and add comments with nested replies.
- **Dark Mode**: A toggle for dark and light themes is available.

## Technologies

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool that provides a minimal setup for React.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Router DOM**: Declarative routing for React.
- **Axios**: A promise-based HTTP client for making API requests.
- **Lucide React**: A library for React icons.

### Backend
- **Node.js**: A JavaScript runtime environment.
- **Express.js**: A web framework for building RESTful APIs.
- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM library for MongoDB.
- **bcrypt**: A library to hash and compare passwords.
- **jsonwebtoken**: A library for creating and verifying JSON Web Tokens (JWT).

## Getting Started

### Prerequisites
- **Node.js** (>=18.0.0)
- **npm** or **Yarn**
- A **MongoDB** instance (local or remote)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kirtick28/community-platform.git
   cd community-platform
   ```

2. Setup the Server:
   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the `server` directory with the following variables:
   ```
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=7d
   PORT=5000
   ```

4. Setup the Client:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. Start the Backend Server:
   ```bash
   cd server
   npm start
   ```
   The server will run on the port specified in your `.env` file (default: 5000).

2. Start the Frontend Client:
   ```bash
   cd client
   npm run dev
   ```
   The client will be available at `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

The backend provides the following main API routes:

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **User**: `/api/user/profile`, `/api/user/:userId`, `/api/user/` (get all), `/api/user` (update/delete)
- **Posts**: `/api/posts`, `/api/posts/:postId`
- **Comments**: `/api/comments/:postId`, `/api/comments/:commentId` (update/delete)
- **Likes**: `/api/likes/:postId`