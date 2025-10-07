## Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/registration system
- **Society Management** - Create, join, and manage university societies
- **Event Management** - Organize and participate in society events
- **Member Management** - Handle society memberships and roles
- **Real-time Notifications** - Stay updated with society activities
- **Activity Feed** - Track recent activities across societies
- **Personalized Recommendations** - Discover relevant societies and events

### Key Pages
- **Home Dashboard** - Personalized feed with quick actions
- **Societies** - Browse and manage societies
- **Events** - Discover and create events
- **Account Management** - Profile and society management
- **Support** - Help and FAQ sections

## Tech Stack

- **Frontend Framework**: React 19.1.1
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.11.0
- **Notifications**: React Toastify 11.0.5
- **Build Tool**: Create React App
- **Containerization**: Docker
- **Web Server**: Nginx

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ZUJ-Societeis-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Build CSS (if using Tailwind watch mode)**
   ```bash
   npm run build:css
   ```

## Docker Deployment

### Build and Run with Docker

1. **Build the Docker image**
   ```bash
   docker build -t zuj-societies-frontend .
   ```

2. **Run the container**
   ```bash
   docker run -p 80:80 zuj-societies-frontend
   ```

3. **Access the application**
   Navigate to `http://localhost`

### Docker Compose (if available)
```bash
docker-compose up -d
```

## Project Structure

```
src/
├── components/           # Reusable UI components
├── context/             # React Context providers
│   ├── AuthContext.js   # Authentication state
│   ├── MembershipContext.js # Society membership state
│   └── NavigationContext.js # Navigation state
├── pages/               # Page components
│   ├── Home/           # Dashboard and main feed
│   ├── Auth/           # Login and registration
│   ├── Societies/      # Society management
│   ├── Events/         # Event management
│   ├── Account/        # User account management
│   └── Support/        # Help and support
├── shared/             # Shared components and utilities
│   ├── components/     # Reusable UI components
│   ├── layout/         # Layout components
│   └── post/           # Post-related components
├── utils/              # Utility functions
└── config/             # Configuration files
    └── axios.js        # HTTP client configuration
```

## Styling

The application uses **Tailwind CSS** for styling with a custom design system:

- **Primary Colors**: Blue-based color palette
- **Design System**: Modern card-based layout
- **Responsive**: Mobile-first responsive design
- **Custom Components**: Reusable styled components

### Key Design Features
- Gradient backgrounds with geometric patterns
- Card-based layout with subtle shadows
- Smooth animations and transitions
- Modern typography and spacing

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_ENVIRONMENT=development
```

### API Configuration
The application connects to a backend API. Configure the API URL in `src/config/axios.js`.

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## Deployment

### Production Build
1. Run `npm run build` to create optimized production build
2. Deploy the `build` folder to your web server
3. Configure your web server to serve the React app

### Nginx Configuration
The included `nginx.conf` provides optimized configuration for serving the React application.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
