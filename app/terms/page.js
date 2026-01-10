"use client";
import React from 'react';
import { 
  FileText, Scale, Shield, CheckCircle2,
  ArrowLeft, Sparkles, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* NAVBAR */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
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

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium mb-6">
            <Scale size={16} />
            Terms of Service
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Terms & <span className="text-blue-600">Conditions</span>
          </h1>
          <p className="text-lg text-gray-600">
            By using Enhance Me, you agree to these terms.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <FileText size={24} className="text-blue-500" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600">
                By accessing and using Enhance Me, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Shield size={24} className="text-green-500" />
                2. Service Description
              </h2>
              <p className="text-gray-600 mb-4">
                Enhance Me provides browser-based image editing tools that operate locally on your device:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <span>All processing happens in your browser</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <span>No image data is transmitted to our servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <span>Free to use for personal and commercial purposes</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <AlertTriangle size={24} className="text-amber-500" />
                3. User Responsibilities
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-bold text-amber-700 mb-2">Prohibited Content</h4>
                  <p className="text-sm text-amber-600">
                    You agree not to upload content that is illegal, infringing, or violates the rights of others.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold text-blue-700 mb-2">Legal Compliance</h4>
                  <p className="text-sm text-blue-600">
                    You must comply with all applicable laws and regulations in your jurisdiction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold mb-2">Your Content</h4>
                  <p className="text-sm text-gray-600">
                    You retain all rights to images you upload and process through our service.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold mb-2">Our Technology</h4>
                  <p className="text-sm text-gray-600">
                    All software, algorithms, and technology powering Enhance Me are our intellectual property.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-gray-600 mb-4">
                The service is provided "as is" without any warranties:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>We don't guarantee 100% uptime or availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Results may vary based on image quality and content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>We're not liable for any data loss or damages</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  Enhance Me shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">For questions about these Terms:</p>
                <a href="mailto:legal@enhanceme.com" className="text-blue-600 hover:underline">
                  legal@enhanceme.com
                </a>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                By using Enhance Me, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* BACK TO HOME */}
        <div className="mt-8">
          <Link href="/">
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-2xl hover:shadow-xl transition-all group">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ArrowLeft size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Continue Using Enhance Me</h3>
                  <p className="text-sm text-gray-300">Return to image editing tools</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles size={22} />
            </div>
            <span className="text-2xl font-bold">Enhance Me</span>
          </div>
          <p className="text-gray-400 mb-8">Free image editing tools</p>
          <div className="border-t border-gray-800 pt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} Enhance Me. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}