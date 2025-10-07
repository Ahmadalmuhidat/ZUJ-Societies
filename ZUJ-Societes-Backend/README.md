A comprehensive Node.js backend API for managing university societies, events, posts, and user interactions at Zarqa University (ZUJ).

## Features

- **User Management**: Registration, authentication, profile management
- **Society Management**: Create, join, and manage university societies
- **Event System**: Create, manage, and track event attendance
- **Social Features**: Posts, comments, likes, and interactions
- **Analytics**: Platform analytics and user recommendations
- **Support System**: Ticket-based support system

## Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Security**: bcrypt for password hashing
- **Containerization**: Docker

## Prerequisites

- Node.js 18 or higher
- MongoDB
- Docker (optional)

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ahmadalmuhidat/ZUJ-Societies-Backend.git
   cd ZUJ-Societies-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   JWT_SECRET=your_jwt_secret_here
   MONGO_URI=mongodb://localhost:27017/zuj_societies
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t zuj-societies-backend .
   ```

2. **Run the container**
   ```bash
   docker run -d --name zuj-societies-backend \
     -p 4000:4000 \
     -e JWT_SECRET=your_jwt_secret \
     -e MONGO_URI=your_mongodb_uri \
     -e EMAIL_USER=your_email \
     -e EMAIL_PASS=your_password \
     zuj-societies-backend
   ```

## Project Structure

```
src/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── analytics.js         # Analytics controller
│   ├── auth.js             # Authentication controller
│   ├── comments.js         # Comments controller
│   ├── events.js           # Events controller
│   ├── posts.js            # Posts controller
│   ├── societies.js        # Societies controller
│   ├── support.js          # Support controller
│   └── user.js             # User controller
├── helper/
│   ├── json_web_token.js   # JWT helper functions
│   ├── passwords.js        # Password utilities
├── middlewares/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── comments.js         # Comments model
│   ├── events.js           # Events model
│   ├── posts.js            # Posts model
│   ├── societies.js        # Societies model
│   ├── users.js            # Users model
│   └── ...                 # Other models
├── routes/
│   └── routes.js           # API routes
├── services/
│   └── mailer.js           # Email service
└── server.js               # Main server file
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled
- Input validation
- Error handling middleware
- Non-root Docker user

## Deployment

### Jenkins CI/CD

The project includes a Jenkinsfile for automated deployment:

1. **Credentials Setup**: Configure the following credentials in Jenkins:
   - `zuj-societies-jwt-secret`
   - `zuj-societies-mongo-uri`
   - `zuj-societies-email-user`
   - `zuj-societies-email-pass`

2. **Pipeline**: The Jenkins pipeline will:
   - Checkout code
   - Build Docker image
   - Stop existing container
   - Deploy new container with environment variables

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 4000) |
| `JWT_SECRET` | JWT signing secret | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `EMAIL_USER` | Email service username | Yes |
| `EMAIL_PASS` | Email service password | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

**Ahmad ALmuhidat**
- Email: ahmad.almuhidat@gmail.com
