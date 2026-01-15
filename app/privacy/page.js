"use client";
import React, { useState } from 'react';
import { 
  ShieldCheck, Download, Upload, X, Sparkles, User, 
  EyeOff, FileText, Zap, CheckCircle2, Menu,
  ArrowRight, Info, Lock, Shield, Maximize,
  Crop, Eraser, FileMinus, Layers, LayoutGrid,Home,Mail
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyGuard() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [metadataRemoved, setMetadataRemoved] = useState(false);
  const [gpsRemoved, setGpsRemoved] = useState(true);
  const [cameraInfoRemoved, setCameraInfoRemoved] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setProcessedImage(null);
        setMetadataRemoved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const cleanImage = () => {
    if (!uploadedImage) return;
    
    setProcessing(true);
    
    setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const cleanedImage = canvas.toDataURL('image/jpeg', 0.9);
        setProcessedImage(cleanedImage);
        setProcessing(false);
        setMetadataRemoved(true);
      };
      img.src = uploadedImage;
    }, 1500);
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setImageName('');
    setMetadataRemoved(false);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `private-${imageName.split('.')[0] || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* NAVBAR - MOBILE OPTIMIZED */}
      <nav className="h-16 sm:h-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={18} className="sm:size-[22px]" />
          </div>
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight no-underline">
            Enhance Me
          </Link>
        </div>

        {/* Desktop Navigation - UNCHANGED */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition-colors no-underline">Home</Link>
          <Link href="/about" className="hover:text-orange-600 transition-colors no-underline">About</Link>
          <Link href="/contact" className="hover:text-orange-600 transition-colors no-underline">Contact</Link>
          
          <Link 
            href="/signin" 
            className="flex items-center gap-2 hover:text-orange-600 transition-colors no-underline"
          >
            <User size={18} /> Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* UPDATED MOBILE MENU - Simple & Clean */}
{mobileMenuOpen && (
  <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-16 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
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
            
      
      {/* Sign In Button with Icon Box */}
      <Link 
        href="/signin" 
        className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline"
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
          <User size={18} />
        </div>
        <span className="font-medium">Sign In</span>
      </Link>
    </div>
  </div>
      )}

      {/* MAIN CONTENT - MOBILE OPTIMIZED */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          
          {/* LEFT SIDE - TOOL INTERFACE */}
          <div className="space-y-6 sm:space-y-8">
            {/* HERO SECTION - MOBILE CENTERED */}
            <div className="space-y-3 sm:space-y-4 text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm sm:text-base">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">
                  <ShieldCheck size={12} className="sm:size-4" />
                </div>
                Image Privacy Protector
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Remove Hidden <br />
                <span className="text-gray-800">Image Metadata</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Strip EXIF data, GPS location, camera info, and personal metadata from your images before sharing.
              </p>
            </div>

            {/* UPLOAD BOX - MOBILE OPTIMIZED */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
              {!uploadedImage ? (
                <div className="text-center p-4 sm:p-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 mx-auto">
                    <Upload size={24} className="sm:size-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Upload Image</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                    Remove metadata before sharing
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    <Upload size={16} className="sm:size-[18px]" />
                    Select Image
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              ) : !processedImage ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <img src={uploadedImage} alt="Preview" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-sm sm:text-base">{imageName}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Ready for cleaning</div>
                      </div>
                    </div>
                    <button onClick={removeUploadedImage} className="p-1.5 sm:p-2 text-gray-500 ml-2 flex-shrink-0">
                      <X size={18} className="sm:size-5" />
                    </button>
                  </div>
                  
                  {/* PRIVACY OPTIONS - MOBILE OPTIMIZED */}
                  <div className="space-y-4 sm:space-y-5">
                    <h4 className="font-bold text-sm sm:text-base">Remove Information</h4>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <label className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer active:bg-gray-50">
                        <input 
                          type="checkbox" 
                          checked={gpsRemoved}
                          onChange={(e) => setGpsRemoved(e.target.checked)}
                          className="w-5 h-5 sm:w-5 sm:h-5 text-gray-800 rounded focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        />
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                            <EyeOff size={16} className="sm:size-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-base">GPS Location</div>
                            <div className="text-xs sm:text-sm text-gray-500">Remove location coordinates</div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer active:bg-gray-50">
                        <input 
                          type="checkbox" 
                          checked={cameraInfoRemoved}
                          onChange={(e) => setCameraInfoRemoved(e.target.checked)}
                          className="w-5 h-5 sm:w-5 sm:h-5 text-gray-800 rounded focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        />
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                            <FileText size={16} className="sm:size-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-base">Camera Information</div>
                            <div className="text-xs sm:text-sm text-gray-500">Remove make, model, settings</div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer active:bg-gray-50">
                        <input 
                          type="checkbox" 
                          checked={true}
                          readOnly
                          className="w-5 h-5 sm:w-5 sm:h-5 text-gray-800 rounded"
                        />
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                            <Shield size={16} className="sm:size-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-base">All EXIF Data</div>
                            <div className="text-xs sm:text-sm text-gray-500">Remove all metadata</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    onClick={cleanImage}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-gray-800 to-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Cleaning Metadata...
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="sm:size-5" />
                        Clean & Protect Image
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle2 size={18} className="sm:size-6" />
                      ✓ Privacy Protected
                    </h3>
                    <button onClick={removeUploadedImage} className="p-1.5 sm:p-2 text-gray-500">
                      <X size={18} className="sm:size-5" />
                    </button>
                  </div>
                  
                  {/* IMAGE PREVIEW - MOBILE ADJUSTED */}
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 h-48 sm:h-56 md:h-64 flex items-center justify-center p-4">
                    <img src={processedImage} alt="Result" className="max-w-full max-h-full object-contain" />
                  </div>
                  
                  {metadataRemoved && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <ShieldCheck size={16} className="sm:size-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm sm:text-base">All Metadata Removed</div>
                          <div className="text-xs sm:text-sm text-gray-600">Your image is now safe to share</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* DOWNLOAD BUTTONS - MOBILE OPTIMIZED */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={downloadImage}
                      className="bg-gradient-to-r from-gray-800 to-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Download size={16} className="sm:size-[18px]" />
                      Download Safe Image
                    </button>
                    
                    <button 
                      onClick={() => setProcessedImage(null)}
                      className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Upload size={16} className="sm:size-[18px]" />
                      Clean Another
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FEATURES - MOBILE OPTIMIZED */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-2 sm:mb-3">
                  <EyeOff size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">No Location</h4>
                <p className="text-xs text-gray-600">GPS coordinates removed</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-2 sm:mb-3">
                  <FileText size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">Camera Info</h4>
                <p className="text-xs text-gray-600">Make, model, settings removed</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-2 sm:mb-3">
                  <Shield size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">All EXIF Data</h4>
                <p className="text-xs text-gray-600">Complete metadata cleaning</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW & INFO */}
          <div className="space-y-6 sm:space-y-8">
            {/* INFO CARD - MOBILE ADJUSTED */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 sm:mb-6">What We Remove</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      <EyeOff size={16} className="sm:size-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base">GPS Location Data</div>
                      <div className="text-xs sm:text-sm text-gray-600">Exact coordinates where photo was taken</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <FileText size={16} className="sm:size-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base">Camera Information</div>
                      <div className="text-xs sm:text-sm text-gray-600">Make, model, settings, date</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      <Shield size={16} className="sm:size-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base">Personal Metadata</div>
                      <div className="text-xs sm:text-sm text-gray-600">Author, copyright, software used</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WHY PROTECT - MOBILE OPTIMIZED */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-3 sm:mb-4">Why Protect Your Images?</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    1
                  </div>
                  <span className="text-xs sm:text-sm">Prevent location tracking from shared photos</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    2
                  </div>
                  <span className="text-xs sm:text-sm">Protect camera fingerprint and serial numbers</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    3
                  </div>
                  <span className="text-xs sm:text-sm">Remove timestamps and editing history</span>
                </li>
              </ul>
            </div>

                  {/* BACK TO TOOLS */}
            <Link href="/" className="block no-underline">
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <ArrowRight size={18} className="sm:size-6 rotate-180" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">More AI Tools</h3>
                      <p className="text-xs sm:text-sm text-gray-300">Explore all our file conversion tools</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="sm:size-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
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