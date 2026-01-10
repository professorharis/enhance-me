"use client";
import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, EyeOff, FileText, CheckCircle2,
  ArrowLeft, Sparkles, Menu, X
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* NAVBAR  */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
        </div>

        {/* DESKTOP MENU - "BACK TO TOOLS" */}
        <div className="hidden md:flex">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Tools
          </Link>
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
            <Link 
              href="/"
              className="py-3 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium flex items-center justify-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ArrowLeft size={18} />
              Back to Tools
            </Link>
            
            {/* Terms Page ka Link */}
            <Link 
              href="/terms-of-service"
              className="mt-4 py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors font-medium border-t border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium mb-6">
            <ShieldCheck size={16} />
            Privacy Policy
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Your Privacy is <span className="text-blue-600">Our Priority</span>
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-12">
          {/* KEY POINTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Processing</h3>
              <p className="text-gray-600">
                All image processing happens directly in your browser. Your images never leave your device.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <EyeOff size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">No Data Collection</h3>
              <p className="text-gray-600">
                We don't collect, store, or share any personal information or uploaded images.
              </p>
            </div>
          </div>

          {/* POLICY DETAILS */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Information We Don't Collect</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                    <span>We do not collect any personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                    <span>We do not collect or store uploaded images</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                    <span>We do not track user behavior or analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                    <span>We do not use cookies for tracking</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How It Works</h2>
                <p className="text-gray-600 mb-4">
                  Enhance Me operates entirely in your web browser. When you upload an image:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold">Local Processing</h4>
                      <p className="text-sm text-gray-600">Images are processed using your device's resources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold">No Server Upload</h4>
                      <p className="text-sm text-gray-600">Files never leave your computer or phone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold">Immediate Deletion</h4>
                      <p className="text-sm text-gray-600">Images are removed from memory after processing</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Third-Party Services</h2>
                <p className="text-gray-600">
                  We use a few essential services to keep Enhance Me running:
                </p>
                <ul className="space-y-3 mt-3">
                  <li className="flex items-start gap-3">
                    <FileText size={20} className="text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">Vercel:</span> Hosting and deployment platform
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText size={20} className="text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">Cloudflare:</span> DNS and security services
                    </div>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have complete control over your data:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                    <span>Right to privacy by design</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                    <span>Right to complete data deletion (it was never stored)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                    <span>Right to transparency (we show you exactly what happens)</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">Email: help.enhanceme@gmail.com</p>
                  <p className="text-sm text-gray-600 mt-1">
                    We typically respond within 48 hours.
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    This is the same email address used in our contact page. You can also use our contact form.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* BACK TO HOME */}
          <Link href="/">
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-2xl hover:shadow-xl transition-all group text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ArrowLeft size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Return to Tools</h3>
                  <p className="text-sm text-gray-300">Continue editing your images</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* FOOTER  */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles size={22} />
                  </div>
                  <span className="text-2xl font-bold">Enhance Me</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Free Image Editing Tools
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Company</h4>
              <div className="flex flex-col gap-2">
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors no-underline">About</Link>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors no-underline">Privacy</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors no-underline">Contact</Link>
               <Link href="/terms" className="text-gray-400 hover:text-white transition-colors no-underline">Terms</Link>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors no-underline">FAQ</Link>
              </div>
            </div>

            {/* Popular Tools */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-2">
                <Link href="/remove-bg" className="text-gray-400 hover:text-white transition-colors no-underline">Remove Background</Link>
                <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline">Smart Resize</Link>
                <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline">Format Converter</Link>
              </div>
            </div>

            {/* More Tools */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">More Tools</h4>
              <div className="flex flex-col gap-2">
                <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline">Image Compressor</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors no-underline">Privacy Guard</Link>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              All rights reserved. Enhance Me © {new Date().getFullYear()}
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Free image processing platform - No subscriptions, no limits
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}