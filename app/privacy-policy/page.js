"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, EyeOff, FileText, CheckCircle2,
  ArrowLeft, Sparkles, Menu, X, ChevronLeft,
  Home, Mail, User, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasHistory(window.history.length > 1);
    }
  }, []);

  const handleBackNavigation = (e) => {
    e.preventDefault();
    
    if (typeof window !== 'undefined') {
      if (hasHistory) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  const handleSignIn = () => {
    // Add your sign in logic here
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
     {/* DESKTOP NAVBAR - UNCHANGED */}
          <nav className="hidden md:flex h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <Sparkles size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
            </div>
    
            <div className="hidden md:flex">
              <button 
                onClick={handleBackNavigation}
                className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to tool
              </button>
            </div>
          </nav>

      {/* MOBILE HEADER - With 3-line menu button */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        {/* Left: Back Button */}
        <button 
          onClick={handleBackNavigation}
          className="flex items-center gap-2 text-blue-600 font-medium text-sm"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        
        {/* Center: Page Title */}
        <span className="font-bold text-gray-900 text-sm">Privacy Policy</span>
        
        {/* Right: 3-line Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-600"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN - UPDATED WITH ICONS */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-14 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
          <div className="flex flex-col">
            {/* Home Link */}
            <Link 
              href="/" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <Home size={18} />
              </div>
              <span className="font-medium">Home</span>
            </Link>
            
            {/* About Link */}
            <Link 
              href="/about" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="font-medium">About</span>
            </Link>
            
            {/* Contact Link */}
            <Link 
              href="/contact" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <Mail size={18} />
              </div>
              <span className="font-medium">Contact</span>
            </Link>
            
            {/* Terms Link */}
            <Link 
              href="/terms" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="font-medium">Terms</span>
            </Link>
            
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          
          {/* LEFT SIDE - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* HERO SECTION */}
            <div className="space-y-3 sm:space-y-4 text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm sm:text-base">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white">
                  <ShieldCheck size={12} className="sm:size-4" />
                </div>
                Privacy First
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                Your Privacy is <br />
                <span className="text-blue-600">Our Top Priority</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                We built Enhance Me with privacy by design. Your images never leave your device.
              </p>
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* POLICY CARD */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
              <div className="space-y-6 sm:space-y-8">
                <section>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">1. Information We Don't Collect</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm">No Personal Information</h4>
                        <p className="text-gray-600 text-xs">We don't collect names, emails, or any personal data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm">Images Stay Local</h4>
                        <p className="text-gray-600 text-xs">All processing happens in your browser, images never leave your device</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm">No Tracking</h4>
                        <p className="text-gray-600 text-xs">We don't track your behavior or use analytics cookies</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">2. How It Works</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white mb-2 sm:mb-3">
                        1
                      </div>
                      <h4 className="font-bold text-sm">Upload Locally</h4>
                      <p className="text-xs text-gray-600">Your image stays on your device</p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white mb-2 sm:mb-3">
                        2
                      </div>
                      <h4 className="font-bold text-sm">Process in Browser</h4>
                      <p className="text-xs text-gray-600">Using your device's resources</p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white mb-2 sm:mb-3">
                        3
                      </div>
                      <h4 className="font-bold text-sm">Download & Clear</h4>
                      <p className="text-xs text-gray-600">Image removed from memory after processing</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">3. Third-Party Services</h2>
                  <p className="text-gray-600 text-sm mb-3 sm:mb-4">
                    We use minimal services to keep Enhance Me running:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <FileText size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Vercel</h4>
                        <p className="text-gray-600 text-xs">Hosting and deployment platform</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Cloudflare</h4>
                        <p className="text-gray-600 text-xs">DNS and security services</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">4. Your Rights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-2 sm:mb-3">
                        <Lock size={14} className="sm:size-4" />
                      </div>
                      <h4 className="font-bold text-sm">Privacy by Design</h4>
                      <p className="text-gray-600 text-xs">Built from the ground up for your privacy</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-2 sm:mb-3">
                        <EyeOff size={14} className="sm:size-4" />
                      </div>
                      <h4 className="font-bold text-sm">Transparency</h4>
                      <p className="text-gray-600 text-xs">We show exactly what happens to your images</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">5. Contact Us</h2>
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                        <Sparkles size={16} className="sm:size-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Have Questions?</h4>
                        <p className="text-gray-600 text-xs">We're here to help with any privacy concerns</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Email: help.enhanceme@gmail.com</p>
                      <p className="text-xs text-gray-600">We typically respond within 48 hours</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Sidebar Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* PRIVACY HIGHLIGHTS */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 sm:mb-6">Privacy Highlights</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <ShieldCheck size={14} className="sm:size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">100% Local</h4>
                      <p className="text-xs text-gray-600">No server uploads ever</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                      <Lock size={14} className="sm:size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">No Data Storage</h4>
                      <p className="text-xs text-gray-600">Images deleted after processing</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                      <EyeOff size={14} className="sm:size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">No Tracking</h4>
                      <p className="text-xs text-gray-600">Zero analytics or cookies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-3 sm:mb-4">Privacy Tips</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                    1
                  </div>
                  <span className="text-xs">All processing happens in your browser - no data leaves your device</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                    2
                  </div>
                  <span className="text-xs">Close the browser tab to completely clear all temporary data</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                    3
                  </div>
                  <span className="text-xs">We don't require accounts, so there's no data to protect</span>
                </li>
              </ul>
            </div>

            {/* SMART BACK BUTTON */}
            <button 
              onClick={handleBackNavigation}
              className="w-full bg-gradient-to-r from-gray-900 to-black text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <ArrowLeft size={14} className="sm:size-6 rotate-180" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">
                      {hasHistory ? 'Return to Previous' : 'Back to Tools'}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {hasHistory ? 'Go back to where you were' : 'Continue editing your images'}
                    </p>
                  </div>
                </div>
                <ArrowLeft size={14} className="sm:size-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles size={18} className="sm:size-[22px]" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold">Enhance Me</span>
                </Link>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Simple and Fast Image Tool
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Company</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">About</Link>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Privacy</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Contact</Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Terms</Link>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">FAQ</Link>
              </div>
            </div>

            {/* Popular Tools */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/remove-bg" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Remove Background</Link>
                <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Resize</Link>
                <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Format Engine</Link>
              </div>
            </div>

            {/* More Tools */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">More Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Compress</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Privacy Guard</Link>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              All rights reserved. Enhance Me © {new Date().getFullYear()}
            </p>
            <p className="text-gray-600 text-xs mt-1 sm:mt-2">
              AI-powered image processing platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}