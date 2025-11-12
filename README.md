# 📝 Task Manager

A full-stack **Task Manager** application built with **Node.js, Express, and MongoDB** for the backend, and plain **HTML, CSS, and JavaScript** for the frontend. This app allows users to register, log in, manage tasks (create, update, delete), and keep everything user-specific with JWT authentication.

---

## 🚀 Live Demo

- 🌐 **Frontend / API:** [taskmanagerapi-1-jmb2.onrender.com](https://taskmanagerapi-1-jmb2.onrender.com)  
- 📘 **Swagger Docs:** [taskmanagerapi-1-jmb2.onrender.com/api-docs](https://taskmanagerapi-1-jmb2.onrender.com/api-docs)

---

## 🚀 Features

- **User Authentication**
  - Register with username, email, and password
  - Login with email and password
  - JWT token-based authentication

- **Task Management**
  - Create new tasks
  - Update task completion status
  - Delete tasks
  - Tasks are private per user

- **Frontend**
  - Responsive UI
  - Tabs for login and registration
  - Dynamic task list rendering
  - LocalStorage support for persisting login session

- **Extras**
  - Keyboard Easter Egg: `Ctrl + Z` toggles "space mode"

---

## 🛠️ Technologies

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, bcrypt, JWT  
- **Frontend:** HTML, CSS, JavaScript (Vanilla JS)  
- **Dev Tools:** Nodemon, Postman / Thunder Client  

---

## 📁 Project Structure

task-manager/
│
├─ src/
│ ├─ models/
│ │ ├─ User.js
│ │ └─ Task.js
│ ├─ routes/
│ │ ├─ auth.js
│ │ └─ tasks.js
│ └─ middleware/
│ └─ authMiddleware.js
│
├─ public/
│ ├─ index.html
│ ├─ style.css
│ └─ app.js
│
├─ utils/
│ ├─ ApiError.js
│ └─ ApiResponse.js
│
├─ .env
├─ package.json
└─ README.md

---
## Getting Started

Follow these steps to set up the project locally:

### 1. Clone the repository 
 ```bash
 git clone https://github.com/AndriyAtWork25/TaskManagerAPI.git
 cd task-manager
 ```
 ### 2. Install dependencies
 ```bash
  npm install
 ```
 ### 3. Create an .env file in the root directory and add: 

 MONGO_URI=your_mongodb_connection_string
 JWT_SECRET=your_secret_key
 PORT=3000

 ### 4. Run the app
 ```bash
  npm start
 ```
 ### 5. Open in browser

 http://localhost:3000
 
 ## API Endpoints

 ## Authentication

- Register → POST /auth/register
- Login → POST /auth/login

 ## Tasks

- Create a task → POST /tasks
- Get all tasks → GET /tasks
- Update a task → PUT /tasks/:id
- Delete a task → DELETE /tasks/:id

 ## Future Improvements

 - Add password reset functionality
 - Implement task categories / priorities
 - Add pagination for tasks
 - Deploy the app to a cloud platform

 ## Author 
 
 Developed by Andriy — Junior Back End Developer passionate about building practical web applications with modern JavaScript technologies.
