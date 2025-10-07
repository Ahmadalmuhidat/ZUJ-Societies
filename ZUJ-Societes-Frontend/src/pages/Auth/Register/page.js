import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AxiosClient from '../../../config/axios';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    student_id: '',
    photo: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const signup = async () => {
    try {
      const response = await AxiosClient.post('/auth/register', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        student_id: formData.student_id,
        photo: formData.photo,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Signup failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error_message || 'Registration failed. Please try again.' 
      };
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }
    if (!formData.student_id.trim()) {
      newErrors.student_id = 'Student ID is required';
      valid = false;
    }
    if (!formData.photo.trim()) {
      newErrors.photo = 'Photo URL is required';
      valid = false;
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const result = await signup();
      setIsLoading(false);

      if (result.success) {
        navigate('/login');
      } else {
        const errorMessage = result.error;
        
        
        if (errorMessage.includes('Email already exists')) {
          setErrors({ ...errors, email: errorMessage });
        } else if (errorMessage.includes('Student ID already exists')) {
          setErrors({ ...errors, student_id: errorMessage });
        }
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 relative overflow-hidden ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* Modern geometric background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/40 via-transparent to-cyan-50/40"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-10 right-1/3 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4.5s'}}></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Campusly</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-10">

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Photo URL */}
              <div>
                <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Photo URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="photo"
                    name="photo"
                    type="text"
                    value={formData.photo}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.photo ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm`}
                  />
                </div>
                {errors.photo && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.photo}
                </p>}
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={`block w-full px-3 py-3 border ${
                      errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm`}
                  />
                  {errors.firstName && <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.firstName}
                  </p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={`block w-full px-3 py-3 border ${
                      errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm`}
                  />
                  {errors.lastName && <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.lastName}
                  </p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm`}
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>}
              </div>

              {/* Student ID */}
              <div>
                <label htmlFor="student_id" className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <input
                    id="student_id"
                    name="student_id"
                    type="text"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="Enter your student ID"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.student_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm`}
                  />
                </div>
                {errors.student_id && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.student_id}
                </p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm`}
                  />
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 transition-colors"
                />
                <label htmlFor="agree-terms" className="ml-3 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">Terms and Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-600 flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.agreeToTerms}
              </p>}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
