## Campusly Platform

Is my graduation project built for Al-Zaytoonah University (ZUJ) to manage student societies, organize events, and foster community engagement.
This platform includes a React-based frontend and a Node.js + MongoDB backend, offering a comprehensive system for both students and administrators.

## Overview

### Frontend (React)

A modern React-based frontend for managing university societies and events. It provides a seamless and interactive experience for students to create, join, and manage societies, organize events, and stay updated on campus activities.

### Backend (Node.js)

A secure and scalable Node.js API that handles all business logic, data storage, authentication, and event management using MongoDB, Express.js, and JWT authentication.

## Features

- User Authentication & Authorization – Secure login and registration system
- Society Management – Create, join, and manage university societies
- Event Management – Organize and participate in events
- Member Management – Manage society memberships and roles
- Social Features – Posts, comments, likes, and community interactions
- Notifications & Activity Feed – Stay updated with real-time updates
- Analytics & Recommendations – Track engagement and get tailored suggestions
- Support System – Ticket-based help and feedback system

## Frontend Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Docker (optional)

### Installation

Clone the repository
```
git clone <frontend-repo-url>
```
```
cd Campusly-Frontend
```
Install dependencies
```
npm install
```
Run locally
```
npm start
```
Then visit: http://localhost:3000
Build for production
```
npm run build
```

### Docker Deployment

```
docker build -t campusly-frontend .
docker run -p 80:80 campusly-frontend
```

### Environment Variables

Create a .env file:
or using Docker Compose:
```
REACT_APP_API_URL=your_backend_api_url
REACT_APP_ENVIRONMENT=production
```

## Backend Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Docker (optional)

### Installation

Clone the repository
```
git clone https://github.com/Ahmadalmuhidat/Campusly.git
```
```
cd Campusly-Backend
```
Install dependencies
```
npm install
```
Create .env file
```
PORT=4000
SECRET=your_jwt_secret_here
MONGO_URI=mongodb://localhost:27017/campusly
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
Run the backend
```
npm start
```
API available at: http://localhost:4000

### Docker Deployment

```
docker build -t campusly-backend .
docker run -d --name campusly-backend \
  -p 4000:4000 \
  -e SECRET=your_jwt_secret \
  -e MONGO_URI=your_mongodb_uri \
  -e EMAIL_USER=your_email \
  -e EMAIL_PASS=your_password \
  campusly-backend
```

## Security Features

- JWT-based Authentication
- Password Hashing (bcrypt)
- Input Validation & Sanitization
- CORS Enabled
- Centralized Error Handling
- Non-root Docker User

## DevOps & Deployment

### Jenkins CI/CD Pipeline

The included Jenkinsfile automates:
- Code checkout
- Docker build & image push
- Container deployment
- Environment variable setup

### Jenkins Credentials:

- campusly-jwt-secret
- campusly-mongo-uri
- campusly-email-user
- campusly-email-pass

### Nginx Configuration

The React app is served via Nginx, configured for optimal caching and routing for SPAs.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Ahmad Almuhidat**

- Email: ahmad.almuhidat@gmail.com
