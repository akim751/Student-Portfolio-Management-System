STUDENT PORTFOLIO MANAGEMENT SYSTEM
Beginner-friendly setup guide for Windows

REQUIREMENTS
1. Node.js LTS: https://nodejs.org/en/download
2. Visual Studio Code: https://code.visualstudio.com/download
3. MongoDB Community Server: https://www.mongodb.com/try/download/community
4. MongoDB Compass: https://www.mongodb.com/try/download/compass

IMPORTANT
Install MongoDB Community Server as a Windows Service. This project uses LOCAL MongoDB,
not MongoDB Atlas. Do not share your .env file or JWT secret.

SETUP
1. Extract this ZIP file.
2. Open the extracted Student_Portfolio_Management_System folder in VS Code.
3. Open Terminal > New Terminal.
4. Run: npm.cmd install
5. Copy the environment example:
   Copy-Item .env.example .env
6. Open .env and set:
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/student_portfolio
   JWT_SECRET=put_a_private_random_string_here
   NODE_ENV=development
7. Make sure MongoDB Server is running in Windows Services.
8. Run: npm.cmd run dev
9. Open: http://localhost:5000

MONGODB COMPASS
Connect using:
mongodb://127.0.0.1:27017

After you register and save information on the website, the database named
student_portfolio and collection named students should appear.

FEATURES
- Student registration and login
- Password hashing with bcryptjs
- JWT authentication stored in an HTTP-only cookie
- Profile create/update
- Education add/delete
- Skills add/delete
- Projects add/update/delete
- Achievements add/update/delete
- MongoDB storage

This is a learning/demo project. Before any public deployment, add production-grade
validation, rate limiting, CSRF protection, stronger error handling and security review.
