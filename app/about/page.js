"use client";
import React, { useState, useEffect } from 'react';
import {
  Sparkles, Zap, Lock, Globe, Users, Shield,
  CheckCircle2, ArrowRight, Heart, Code,
  Mail, Twitter, Github, Linkedin, Menu, X,
  ArrowLeft, ChevronLeft, Home, FileText, HelpCircle,
  GraduationCap, ShieldCheck, Cpu
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
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
      if (hasHistory) router.back();
      else router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">

      {/* MOBILE HEADER */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <button onClick={handleBackNavigation} className="flex items-center gap-2 text-blue-600 font-medium text-sm">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <span className="font-bold text-gray-900 text-sm">About</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-gray-600">
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <NextImage
            src="/logo.png"
            alt="Enhance Me Logo"
            width={40}
            height={40}
            className="rounded-xl object-contain"
            priority
          />
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

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-14 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center"><Home size={18} /></div>
              <span className="font-medium">Home</span>
            </Link>
            <Link href="/privacy-policy" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center"><Shield size={18} /></div>
              <span className="font-medium">Privacy</span>
            </Link>
            <Link href="/contact" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center"><Mail size={18} /></div>
              <span className="font-medium">Contact</span>
            </Link>
            <Link href="/terms" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center"><FileText size={18} /></div>
              <span className="font-medium">Terms</span>
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm sm:text-base mb-4 sm:mb-6">
            <Sparkles size={14} className="sm:size-4" />
            About This Project
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            A Simple <span className="text-blue-600">Image Editing</span> Tool
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-2">
            Enhance Me is an independent project built to make basic image editing —
            starting with background removal — quick and free to use, without needing
            an account or paid software.
          </p>
        </div>
      </div>

      {/* ABOUT THE DEVELOPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">About Me</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              I'm Muhammad Haris, a Computer Science student with a strong interest in
              Artificial Intelligence, Cybersecurity, and modern web development. I enjoy
              building practical projects that solve real problems and use them as a way
              to keep improving my technical skills through hands-on learning.
            </p>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              I've built and deployed a few web-based projects so far, including
              cybersecurity-related tools, image-processing utilities like this one, and
              file-conversion applications. My goal is to complete a Bachelor's degree in
              Computer Science and keep growing my skills in AI, cybersecurity, and
              software development while building useful things along the way.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                  <CheckCircle2 size={16} className="sm:size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base md:text-lg">Free to Use</h4>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">No subscription, no hidden fees</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <CheckCircle2 size={16} className="sm:size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base md:text-lg">Runs in Your Browser</h4>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Processing happens on your device, not on a server</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
                  <CheckCircle2 size={16} className="sm:size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base md:text-lg">Actively Improved</h4>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">A learning project that keeps getting refined over time</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 text-white mt-6 sm:mt-8 lg:mt-0">
            <div className="space-y-4 sm:space-y-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
                <GraduationCap size={20} className="sm:size-6 md:size-8" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Student-Built</h3>
              <p className="text-blue-100 text-sm sm:text-base">
                This is a personal project, built by a Computer Science student as a way
                to apply and practice real-world skills — not a large company product.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">How It's Built</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
              A modern web app that runs image processing directly in your browser
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6">
                <Zap size={16} className="sm:size-5 md:size-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 md:mb-4">Runs Locally</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                Background removal runs as a machine-learning model inside your browser —
                no image is uploaded to a server to be processed.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6">
                <Lock size={16} className="sm:size-5 md:size-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 md:mb-4">Privacy Friendly</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                Since processing happens on your device, your images stay with you.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6">
                <Globe size={16} className="sm:size-5 md:size-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 md:mb-4">Works in the Browser</h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                No installation needed — just open it in a modern browser on desktop or mobile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 text-center text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Try It Out</h2>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            No sign-up required — upload an image and see how it works.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-gray-900 px-4 sm:px-6 md:px-10 py-3 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all w-full sm:w-auto"
          >
            Start Editing
            <ArrowRight size={16} className="sm:size-5 md:size-6" />
          </button>
          <p className="text-xs sm:text-sm text-blue-200 mt-3 sm:mt-4">
            No sign-up required • No credit card needed
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline">
                  <NextImage
                    src="/logo.png"
                    alt="Enhance Me Logo"
                    width={40}
                    height={40}
                    className="rounded-xl object-contain"
                    loading="lazy"
                  />
                  <span className="text-xl sm:text-2xl font-bold">Enhance Me</span>
                </Link>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">Free image editing tools</p>
            </div>

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

            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/remove-bg" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Remove Background</Link>
                <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Resize</Link>
                <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Format Engine</Link>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">More Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Compress</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Privacy Guard</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              All rights reserved. Enhance Me © {new Date().getFullYear()}
            </p>
            <p className="text-gray-600 text-xs mt-1 sm:mt-2">
              An independent project by Muhammad Haris
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}