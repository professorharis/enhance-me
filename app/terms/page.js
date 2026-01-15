"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, Scale, Shield, CheckCircle2,
  ArrowLeft, Sparkles, AlertTriangle, Menu, X,
  Home, HelpCircle, MessageCircle, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TermsOfService() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* MOBILE HEADER - Only shows on mobile */}
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
        <span className="font-bold text-gray-900 text-sm">Terms</span>
        
        {/* Right: 3-line Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-600"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DESKTOP NAVBAR - Unchanged */}
      <nav className="hidden md:flex h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
        </div>

        <Link href="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Tools
        </Link>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-14 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
          <div className="flex flex-col">
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

            <Link 
              href="/contact" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <span className="font-medium">Contact</span>
            </Link>
            
             <Link 
              href="/privacy-policy" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <Shield size={18} />
              </div>
              <span className="font-medium">Privacy</span>
            </Link>
            
            
          </div>
        </div>
      )}

      {/* MAIN CONTENT - Adjusted padding for mobile */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm sm:text-base mb-4 sm:mb-6">
            <Scale size={14} className="sm:size-4" />
            Terms of Service
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 sm:mb-6">
            Terms & <span className="text-blue-600">Conditions</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            By using Enhance Me, you agree to these terms.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
          <div className="space-y-6 sm:space-y-8">
            
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <FileText size={18} className="sm:size-6 text-blue-500 flex-shrink-0" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                By accessing and using Enhance Me, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <Shield size={18} className="sm:size-6 text-green-500 flex-shrink-0" />
                2. Service Description
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                Enhance Me provides browser-based image editing tools that operate locally on your device:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 size={16} className="sm:size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">All processing happens in your browser</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 size={16} className="sm:size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">No image data is transmitted to our servers</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 size={16} className="sm:size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Free to use for personal and commercial purposes</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <AlertTriangle size={18} className="sm:size-6 text-amber-500 flex-shrink-0" />
                3. User Responsibilities
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-bold text-amber-700 text-sm sm:text-base mb-1 sm:mb-2">Prohibited Content</h4>
                  <p className="text-xs sm:text-sm text-amber-600">
                    You agree not to upload content that is illegal, infringing, or violates the rights of others.
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold text-blue-700 text-sm sm:text-base mb-1 sm:mb-2">Legal Compliance</h4>
                  <p className="text-xs sm:text-sm text-blue-600">
                    You must comply with all applicable laws and regulations in your jurisdiction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">4. Intellectual Property</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Your Content</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    You retain all rights to images you upload and process through our service.
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Our Technology</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    All software, algorithms, and technology powering Enhance Me are our intellectual property.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                The service is provided "as is" without any warranties:
              </p>
              <ul className="space-y-1 sm:space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span className="text-sm sm:text-base">We don't guarantee 100% uptime or availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span className="text-sm sm:text-base">Results may vary based on image quality and content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span className="text-sm sm:text-base">We're not liable for any data loss or damages</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">6. Limitation of Liability</h2>
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600">
                  Enhance Me shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">7. Changes to Terms</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">8. Contact Information</h2>
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-sm sm:text-base">For questions about these Terms:</p>
                <a href="mailto:legal@enhanceme.com" className="text-blue-600 hover:underline text-sm sm:text-base">
                  legal@enhanceme.com
                </a>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <p className="text-xs sm:text-sm text-gray-500">
                By using Enhance Me, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* BACK TO HOME - Mobile optimized */}
        <div className="mt-6 sm:mt-8">
          <Link href="/">
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all group">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <ArrowLeft size={18} className="sm:size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Continue Using Enhance Me</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Return to image editing tools</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* FOOTER - MOBILE OPTIMIZED */}
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
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Terms</Link>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">FAQ</Link>
              </div>
            </div>

            {/* Popular Tools */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Remove Background</Link>
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