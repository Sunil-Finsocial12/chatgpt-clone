import React, { useState, useEffect } from 'react';

interface AuthPageProps {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialMode?: 'signin' | 'signup';
  onSignupSuccess?: (userData: { name: string; email: string }) => void;
  onLoginSuccess?: (userData: { name: string; email: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ 
  onClose, 
  isDarkMode,
  onToggleDarkMode,
  initialMode = 'signin',
  onSignupSuccess,
  onLoginSuccess
}) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsRightPanelActive(initialMode === 'signup');
  }, [initialMode]);

  const handleSubmit = async (event: React.FormEvent, type: 'signin' | 'signup') => {
    event.preventDefault();
    setLoading(true);
    
    try {
      if (type === 'signup') {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (onSignupSuccess) {
          onSignupSuccess({ name, email });
        }
      } else {
        // Handle login
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (onLoginSuccess) {
          onLoginSuccess({
            name: email.split('@')[0], // Use email username as name for demo
            email: email
          });
        }
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formClasses = `h-full w-full flex flex-col items-center justify-center px-12 ${
    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  const inputClasses = `w-full px-4 py-3 mb-4 rounded-lg border ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-4xl mx-auto p-4">
        {/* Header with Dark Mode and Back Button */}
        <div className="absolute right-8 top-8 flex items-center gap-4 z-[101]">
          <button
            onClick={onToggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
          </button>
          
          <button
            onClick={onClose}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
        </div>

        {/* Brand Logo */}
        <div className="absolute left-8 top-8 z-[101]">
          <h1 
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{
              background: 'linear-gradient(135deg, #FF9933 25%, rgba(255,255,255,0.8) 50%, #138808 75%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            Hind AI
          </h1>
        </div>

        <div 
          className={`container ${isRightPanelActive ? 'right-panel-active' : ''} auth-card-glow mt-20`}
        >
          {/* Sign Up Container */}
          <div className="form-container sign-up-container">
            <form onSubmit={(e) => handleSubmit(e, 'signup')} className={formClasses}>
              <h1 className="text-2xl font-bold mb-6">Create Account</h1>
              
              <div className="w-full max-w-[320px] space-y-4">
                <input 
                  type="text" 
                  placeholder="Username" 
                  className={inputClasses} 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className={inputClasses} 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className={inputClasses} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button mt-8 w-full max-w-[320px]"
                disabled={loading}
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* Sign In Container */}
          <div className="form-container sign-in-container">
            <form onSubmit={(e) => handleSubmit(e, 'signin')} className={formClasses}>
              <h1 className="text-2xl font-bold mb-6">Sign in</h1>
              
              <button type="button" className="w-full max-w-[320px] flex items-center justify-center gap-3 px-4 py-3 mb-6 rounded-lg border transition-colors">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
              
              <div className="flex items-center w-full my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              <div className="w-full max-w-[320px] space-y-4">
                <input type="email" placeholder="Email" className={inputClasses} required />
                <input type="password" placeholder="Password" className={inputClasses} required />
              </div>
              
              <a 
                href="#" 
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                } mt-4 mb-6 transition-colors`}
              >
                Forgot your password?
              </a>
              
              <button 
                type="submit" 
                className="auth-button w-full max-w-[320px]"
                disabled={loading}
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Overlay Container */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                <p className="text-lg mb-6">Already have an account?</p>
                <button 
                  type="button"
                  className="ghost auth-button"
                  onClick={() => setIsRightPanelActive(false)}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="text-3xl font-bold mb-4">Hello, Friend!</h1>
                <p className="text-lg mb-6">Enter your details and start your journey with us</p>
                <button 
                  type="button"
                  className="ghost auth-button"
                  onClick={() => setIsRightPanelActive(true)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
