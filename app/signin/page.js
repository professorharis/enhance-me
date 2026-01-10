"use client";
import React, { useState } from 'react';
import { 
  Sparkles, Mail, Lock, User, ArrowLeft, 
  CheckCircle2, Eye, EyeOff, X, Menu,
  Github
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, just redirect to home
      router.push('/');
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Simulate Google sign in
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  const handleGithubSignIn = () => {
    setLoading(true);
    // Simulate GitHub sign in
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Redirect to forgot password page
    router.push('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* NAVBAR - SIMPLE */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
        </div>

        {/* DESKTOP MENU - BACK BUTTON */}
        <div className="hidden md:flex">
          <button 
            onClick={() => router.back()}
            className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-white border-t border-gray-200">
          <div className="flex flex-col py-4 px-6">
            <button 
              onClick={() => {
                router.back();
                setMobileMenuOpen(false);
              }}
              className="py-3 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            
            <Link 
              href="/"
              className="mt-4 py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors font-medium border-t border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </div>
        </div>
      )}

      {/* SIGN IN FORM */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="w-full max-w-md">
          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
            <p className="text-gray-600">
              Sign in to access your tools and preferences
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              </div>
              <span className="font-medium">Continue with Google</span>
            </button>

            {/* GITHUB SIGN IN BUTTON */}
            <button
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Github size={20} />
              <span className="font-medium">Continue with GitHub</span>
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">Or continue with email</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* EMAIL/PASSWORD FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* FEATURES */}
          <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" />
              Free Account Benefits
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-green-500 mt-0.5">✓</div>
                <span>Access all image editing tools</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-green-500 mt-0.5">✓</div>
                <span>Save your favorite settings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-green-500 mt-0.5">✓</div>
                <span>Higher resolution downloads</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-green-500 mt-0.5">✓</div>
                <span>Priority support</span>
              </li>
            </ul>
          </div>

          {/* SIGN UP LINK */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up for free
              </button>
            </p>
          </div>

          {/* TERMS & PRIVACY */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* DEMO CREDENTIALS */}
          <div className="mt-6 p-4 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Demo Credentials:</span>
            </p>
            <p className="text-xs text-gray-500">
              Use any email/password to test the form
            </p>
          </div>
        </div>
      </div>

      {/* SIMPLE FOOTER */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <span className="text-xl font-bold">Enhance Me</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors no-underline">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors no-underline">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors no-underline">
                Contact
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors no-underline">
                FAQ
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 mt-6 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Enhance Me. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}