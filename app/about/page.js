"use client";
import React, { useState } from 'react';
import { 
  Sparkles, Zap, Lock, Globe, Users, Shield,
  CheckCircle2, ArrowRight, Heart, Code,
  Mail, Twitter, Github, Linkedin, Menu, X,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* NAVBAR - CONTACT/TERMS KI TARAH */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
        </div>

        {/* DESKTOP MENU - BROWSER HISTORY BACK */}
        <div className="hidden md:flex">
          <button 
            onClick={() => router.back()}
            className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to tool
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

      {/* HERO SECTION */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium mb-8">
              <Sparkles size={16} />
              About Our Mission
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
              Democratizing <span className="text-blue-600">Image Editing</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We believe professional image editing should be accessible to everyone. 
              No expensive software, no steep learning curve.
            </p>
          </div>
        </div>
      </div>

      {/* MISSION & VALUES */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To provide powerful, accessible image editing tools that anyone can use, 
              regardless of technical expertise or budget constraints.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Free & Accessible</h4>
                  <p className="text-gray-600">No subscription, no hidden fees</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Privacy First</h4>
                  <p className="text-gray-600">All processing happens locally</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold">AI Powered</h4>
                  <p className="text-gray-600">Advanced algorithms for perfect results</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold">Built with ❤️</h3>
              <p className="text-blue-100">
                We're passionate about making image editing simple, fast, and accessible 
                to everyone on the planet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powered by cutting-edge AI and modern web technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Fast Processing</h3>
              <p className="text-gray-600">
                Optimized algorithms that process images in seconds, not minutes.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Privacy Focused</h3>
              <p className="text-gray-600">
                Your images never leave your device. All processing happens locally.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Accessible Everywhere</h3>
              <p className="text-gray-600">
                Works on any device with a modern browser. No downloads required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Enhance Your Images?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our tools for their image editing needs.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Start Editing Free
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      {/* FOOTER - SAME */}
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