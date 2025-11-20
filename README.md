# Job Portal Application

A comprehensive job portal platform that connects students, employers, and administrators in a seamless job search and recruitment ecosystem.

## Features

### For Students
- Browse and search for job opportunities
- Apply to jobs with resume uploads
- Manage personal profiles and saved jobs
- Receive notifications for job matches and application updates
- Real-time chat with employers

### For Employers
- Post and manage job listings
- Review and manage job applications
- Access student resumes and profiles
- Communicate with applicants via chat
- View performance analytics and reports

### For Admins
- Manage user accounts (students, employers)
- Oversee job postings and applications
- Generate reports on platform usage
- Monitor system performance
- Handle contact messages and support

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Framer Motion for animations
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Socket.io for real-time chat
- CORS for cross-origin requests

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Client Setup
1. Navigate to the client directory:
   ```
   cd client
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The client will be available at `http://localhost:5173`

### Server Setup
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=your_jwt_secret_here
   ```
4. Start the server:
   ```
   npm run dev
   ```
   The server will be running at `http://localhost:5000`

## Usage

1. Ensure both client and server are running.
2. Open your browser and navigate to `http://localhost:5173`.
3. Register as a student, employer, or admin.
4. Explore the features based on your role.

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job (employers only)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (employers only)
- `DELETE /api/jobs/:id` - Delete job (employers only)

#### Applications
- `POST /api/applied` - Apply for a job
- `GET /api/applied` - Get user's applications

#### Saved Jobs
- `POST /api/saved` - Save a job
- `GET /api/saved` - Get saved jobs
- `DELETE /api/saved/:id` - Remove saved job

#### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/jobs` - Get all jobs
- `GET /api/admin/reports` - Get platform reports

#### Employer
- `GET /api/employer/dashboard` - Employer dashboard data
- `GET /api/employer/applications` - Get job applications

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

#### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/messages` - Send a message

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the ISC License.
