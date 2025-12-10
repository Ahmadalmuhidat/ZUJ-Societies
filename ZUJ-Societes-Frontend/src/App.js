import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import PrivateRoute from './context/PrivateRoute';
import { ToastContainer } from "react-toastify";
import './index.css';
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home/page';
import Login from './pages/Auth/Login/page';
import Signup from './pages/Auth/Register/page';
import About from './pages/About/page';
import Account from './pages/Account/page';
import PublicProfile from './pages/Account/PublicProfile/page';
import Events from './pages/Events/page';
import Support from './pages/Support/page';
import Terms from './pages/Terms/page';
import Privacy from './pages/Privacy/page';
import MySocieties from './pages/Account/MySocieties/page';
import Societies from './pages/Societies/page';
import SocietyDetail from './pages/Societies/Timeline/page';
import SocietyEvents from './pages/Societies/Events/page';
import SocietyMembers from './pages/Societies/Members/page';
import SocietyJoinRequests from './pages/Societies/JoinRequests/page';
import SocietySettings from './pages/Societies/Settings/page';
import NewSociety from './pages/Societies/Create/page';
import NewEvent from './pages/Events/NewEvent/page';
import EventDetailsPage from './pages/Events/Details/page';
import TrendingPage from './pages/Trending/page';
import NotificationsPage from './pages/Notifications/page';
import Sidebar from './shared/layout/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MembershipProvider>
                  <div className="flex h-screen bg-gradient-to-br from-primary-50 via-white to-cyan-50 relative">
                    {/* Modern geometric background pattern */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50/40 via-transparent to-cyan-50/40"></div>
                      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute top-20 right-20 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                      <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                      <div className="absolute bottom-10 right-1/3 w-40 h-40 bg-primary-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4.5s' }}></div>
                      {/* Subtle grid pattern */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                      }}></div>
                    </div>
                    <Sidebar />
                    <main className="flex-1 overflow-auto lg:ml-0 relative z-10">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/users/:id" element={<PublicProfile />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventDetailsPage />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/my-societies" element={<MySocieties />} />
                        <Route path="/societies" element={<Societies />} />
                        <Route path="/societies/new" element={<NewSociety />} />
                        <Route path="/societies/:id" element={<SocietyDetail />} />
                        <Route path="/societies/:id/events" element={<SocietyEvents />} />
                        <Route path="/societies/:id/events/new" element={<NewEvent />} />
                        <Route path="/societies/:id/members" element={<SocietyMembers />} />
                        <Route path="/societies/:id/join-requests" element={<SocietyJoinRequests />} />
                        <Route path="/societies/:id/settings" element={<SocietySettings />} />
                        <Route path="/trending" element={<TrendingPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                      </Routes>
                    </main>
                  </div>
                </MembershipProvider>
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
          enableMultiContainer={false}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
