# Simple TODO List Application

A full-stack TODO list application built with React.js (frontend), Node.js/Express (backend), and MongoDB (database).

## Screenshots

![image](https://github.com/user-attachments/assets/5ba1905f-eab1-4a6e-960d-736b27527a65)


## Features

- Create new TODO items
- List all TODO items
- Update existing TODO items
- Delete TODO items

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Version Control: Git

## Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js**: You need Node.js and npm installed on your machine. [Download Node.js](https://nodejs.org/)
- **MongoDB**: A MongoDB instance is required either locally or via MongoDB Atlas. [Install MongoDB](https://docs.mongodb.com/manual/installation/)

## Installation & Setup

1. Navigate into the backend folder:
      cd backend
2. Install the server dependencies:
      npm install
3. Create a .env file for environment variables:
      touch .env
4. Inside the .env file, add the following:
      MONGODB_URI=mongodb://localhost:27017/app_crud_db
      PORT=5000
5. Start the backend server:
      npm start
The server will be available at `http://localhost:5000`

6. Navigate into the frontend folder:
      cd frontend
7. Install the server dependencies:
      npm install
8. Start the frontend server:
      npm start
The server will be available at `http://localhost:3000`

## Git Commands Used

```bash
git init
git add .
git commit -m "message"
git push
```
