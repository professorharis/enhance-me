"use client";
import React, { useState } from 'react';
import { 
  Mail, MessageCircle, Send, User, Globe,
  Phone, MapPin, Twitter, Github, Linkedin,
  Sparkles, CheckCircle2, X, Menu, Loader2,
  ArrowLeft // Added for back button
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Added for navigation

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter(); // Added router

  // Method 1: Direct Formspree Submission (Recommended)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Formspree API Call
      const response = await fetch('https://formspree.io/f/xykkgywz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `New Contact Form: ${formData.subject}`,
          _replyto: formData.email,
          _format: 'plain'
        })
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Auto reset after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your internet connection.');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Test function for development
  const testFormSubmission = () => {
    setFormData({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message to check if the contact form is working properly.'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* UPDATED NAVBAR - About Page की तरह */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
        </div>

        {/* DESKTOP MENU - About Page की तरह Back Button */}
        <div className="hidden md:flex">
          <button 
            onClick={() => router.back()}
            className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to tool
          </button>
        </div>

        {/* MOBILE MENU BUTTON - About Page की तरह */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU - About Page की तरह */}
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
            
            {/* Terms Page ka Link - About Page की तरह */}
            <Link 
              href="/terms-of-service"
              className="mt-4 py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors font-medium border-t border-gray-100 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              Terms of Service
            </Link>

            {/* Contact Page के लिए Additional Links */}
            <Link 
              href="/about"
              className="mt-4 py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors font-medium border-t border-gray-100 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            
            <Link 
              href="/privacy-policy"
              className="mt-4 py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors font-medium border-t border-gray-100 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              Privacy Policy
            </Link>

            <Link 
              href="/faq"
              className="mt-4 py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors font-medium border-t border-gray-100 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
          </div>
        </div>
      )}

      {/* REST OF THE CODE REMAINS EXACTLY SAME */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium mb-6">
            <MessageCircle size={16} />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We're here to help!
          </p>
          
          {/* Development Test Button - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={testFormSubmission}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm"
            >
              Fill Test Data
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* CONTACT INFO */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <a href="mailto:help.enhanceme@gmail.com" className="text-blue-600 hover:underline">
                      help.enhanceme@gmail.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Typically reply within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Help Center</h4>
                    <Link href="/faq" className="text-green-600 hover:underline no-underline">
                      FAQ Section
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Documentation & tutorials</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Location</h4>
                    <p className="text-gray-600">Remote Company</p>
                    <p className="text-sm text-gray-500 mt-1">Working from around the world</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  <p className="font-medium">Error: {error}</p>
                  <p className="text-sm mt-1">Please try again or email us directly at help.enhanceme@gmail.com</p>
                </div>
              )}
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-3">Message Sent Successfully!</h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                    <br />
                    <span className="text-sm">A confirmation email has been sent to {formData.email || 'your email'}.</span>
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  {/* OPTION 1: React + Fetch (Recommended) */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hidden fields for Formspree */}
                    <input type="hidden" name="_format" value="plain" />
                    <input type="hidden" name="_subject" value="New Contact Form Submission" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <User size={18} />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
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
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Tell us about your project or question..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* FAQ */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold mb-6">Frequently Asked</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold mb-2">Is Enhance Me really free?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! All our tools are completely free with no usage limits. No subscriptions or hidden charges.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold mb-2">How do you handle my images?</h4>
                  <p className="text-sm text-gray-600">
                    All image processing happens locally in your browser. Your images never leave your device.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold mb-2">Can I use this for commercial projects?</h4>
                  <p className="text-sm text-gray-600">
                    Absolutely! You can use processed images for any purpose, commercial or personal. No attribution required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
           <footer className="bg-gray-900 text-white py-12 px-6">
             <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                 {/* Brand */}
                 <div>
                   <div className="flex items-center gap-3 mb-4">
                     <Link href="/" className="flex items-center gap-3 no-underline">
                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                         <Sparkles size={22} />
                       </div>
                       <span className="text-2xl font-bold">Enhance Me</span>
                     </Link>
                   </div>
                   <p className="text-gray-400 text-sm">
                     Simple and Fast Image Tool
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
     
                 {/* Popular Tools  */}
                 <div>
                   <h4 className="text-white font-bold mb-4 text-lg">Popular Tools</h4>
                   <div className="flex flex-col gap-2">
                     <Link href="/" className="text-gray-400 hover:text-white transition-colors no-underline">Remove Background</Link>
                     <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline">Smart Resize</Link>
                     <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline">Format Engine</Link>
                   </div>
                 </div>
     
                 {/* More Tools */}
                 <div>
                   <h4 className="text-white font-bold mb-4 text-lg">More Tools</h4>
                   <div className="flex flex-col gap-2">
                     <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline">Smart Compress</Link>
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
                   AI-powered image processing platform
                 </p>
               </div>
             </div>
           </footer>
         </div>
       );
     }