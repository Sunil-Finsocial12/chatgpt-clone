import React, { useState, useEffect } from "react";
import { login, register } from "../services/sessionService";
import { useSession } from "../context/SessionContext";
import "../styles/auth.css";

interface SlidingAuthFormProps {
  isOpen: boolean;
  onClose: () => void;
  isLogin: boolean;
  isDarkMode: boolean;
  setIsLogin: (isLogin: boolean) => void;
  isAnimated?: boolean;
}

const SlidingAuthForm: React.FC<SlidingAuthFormProps> = ({
  isOpen,
  onClose,
  isLogin,
  isDarkMode,
  setIsLogin,
  isAnimated = false
}) => {
  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [animation, setAnimation] = useState(false);
  const [formTransition, setFormTransition] = useState(false);

  // Form validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  // Get session context with setter functions
  const { setAuthenticated, setUserProfile } = useSession();

  // Initialize animation state based on isAnimated prop
  useEffect(() => {
    if (isOpen && isAnimated) {
      setAnimation(true);
      const timer = setTimeout(() => {
        setAnimation(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAnimated]);

  // Handle form transition animation when switching between login/register
  useEffect(() => {
    if (isOpen) {
      setFormTransition(true);
      const timer = setTimeout(() => {
        setFormTransition(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLogin, isOpen]);

  // Reset form when opened or mode changes
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setError(undefined);
      setSuccess(undefined);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, isLogin]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'username':
        return !value.trim() ? 'Username is required' : '';
      case 'email':
        return !value.trim() 
          ? 'Email is required' 
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
            ? 'Invalid email format'
            : '';
      case 'password':
        return !value ? 'Password is required' : value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'firstName':
        return !value.trim() ? 'First name is required' : '';
      case 'lastName':
        return !value.trim() ? 'Last name is required' : '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched({...touched, [field]: true});
    setErrors({...errors, [field]: validateField(field, value)});
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {
      username: validateField('username', username),
      password: validateField('password', password),
    };

    if (!isLogin) {
      newErrors.email = validateField('email', email);
      newErrors.firstName = validateField('firstName', firstName);
      newErrors.lastName = validateField('lastName', lastName);
    }

    setErrors(newErrors);
    setTouched({
      username: true,
      password: true,
      email: !isLogin,
      firstName: !isLogin,
      lastName: !isLogin
    });

    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(undefined);
    setSuccess(undefined);

    try {
      if (isLogin) {
        // Handle login
        const response = await login(username, password);
        setSuccess("Login successful!");
        
        // Set user profile and mark as authenticated
        setUserProfile({ 
          name: username,
          email: email || undefined
        });
        setAuthenticated(true);
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Handle signup
        try {
          await register(username, email, password, firstName, lastName);
          setSuccess("Account created successfully! You can now log in.");
          
          // Switch to login form after successful registration
          setTimeout(() => {
            setIsLogin(true);
          }, 1500);
        } catch (error: any) {
          console.error("Registration error:", error);
          // Check for specific constraint error message
          if (error.detail && typeof error.detail === 'string' && 
              error.detail.includes("UNIQUE constraint failed") && 
              error.detail.includes("username")) {
            setError("A user is already registered with this username. Please choose another username.");
          } else if (error.detail && typeof error.detail === 'string' && 
              error.detail.includes("UNIQUE constraint failed") && 
              error.detail.includes("email")) {
            setError("This email address is already registered. Please use a different email or log in.");
          } else {
            setError(error.detail || "Registration failed. Please try again.");
          }
          return;
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Better error handling with user-friendly messages
      if (error.status === 401) {
        setError("Incorrect username or password. Please try again.");
      } else if (error.detail && typeof error.detail === 'string') {
        // Parse API error messages to more user-friendly format
        if (error.detail.includes("UNIQUE constraint failed")) {
          if (error.detail.includes("username")) {
            setError("A user is already registered with this username. Please choose another username.");
          } else if (error.detail.includes("email")) {
            setError("This email address is already registered. Please use a different email.");
          } else {
            setError(error.detail);
          }
        } else {
          setError(error.detail);
        }
      } else {
        setError(isLogin ? "Login failed. Please check your credentials and try again." : 
                           "Registration failed. Please check your information and try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } rounded-xl shadow-lg p-6 overflow-hidden ${
          animation ? "animate-wiggle" : ""
        }`}
      >
        {/* Animated form container */}
        <div className={`relative w-full transform transition-all duration-300 ease-in-out ${
          formTransition ? (isLogin ? "translate-x-full opacity-0" : "-translate-x-full opacity-0") : "translate-x-0 opacity-100"
        }`}>
          {/* Attention grabber element - only shows during animation */}
          {animation && (
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Please login to continue
            </div>
          )}
          
          <button
            className={`absolute top-2 right-2 rounded-full p-1 transition-colors ${
              isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold mb-2 transition-colors ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {isLogin ? "Sign in to continue" : "Sign up to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className={`block text-sm font-medium transition-colors ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Username*
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => handleBlur('username', username)}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                } ${touched.username && errors.username ? "border-red-500" : ""}`}
                placeholder="Enter your username"
                aria-invalid={touched.username && errors.username ? "true" : "false"}
              />
              {touched.username && errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className={`block text-sm font-medium transition-colors ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Email*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email', email)}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                    } ${touched.email && errors.email ? "border-red-500" : ""}`}
                    placeholder="Enter your email"
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="flex justify-between space-x-2">
                  <div className="w-1/2 space-y-2">
                    <label className={`block text-sm font-medium transition-colors ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      First Name*
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => handleBlur('firstName', firstName)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        isDarkMode 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                      } ${touched.firstName && errors.firstName ? "border-red-500" : ""}`}
                      placeholder="First Name"
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="w-1/2 space-y-2">
                    <label className={`block text-sm font-medium transition-colors ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Last Name*
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => handleBlur('lastName', lastName)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        isDarkMode 
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                          : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                      } ${touched.lastName && errors.lastName ? "border-red-500" : ""}`}
                      placeholder="Last Name"
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium transition-colors ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Password*
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password', password)}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                      : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                  } ${touched.password && errors.password ? "border-red-500" : ""}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {error && (
              <div className={`p-3 rounded-lg ${
                isDarkMode ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-800"
              }`}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className={`p-3 rounded-lg ${
                isDarkMode ? "bg-green-900/50 text-green-200" : "bg-green-50 text-green-800"
              }`}>
                <p className="text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg text-white font-medium transition-all ${
                loading 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>

            <div className="text-center mt-4">
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SlidingAuthForm;
