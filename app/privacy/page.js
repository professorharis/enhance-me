"use client";
import React, { useState } from 'react';
import { 
  ShieldCheck, Download, Upload, X, Sparkles, User, 
  EyeOff, FileText, Zap, CheckCircle2, Menu,
  ArrowRight, Info, Lock, Shield, Maximize,
  Crop, Eraser, FileMinus, Layers, LayoutGrid
} from 'lucide-react';
import Link from 'next/link';

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
      };
      reader.readAsDataURL(file);
    }
  };

  const cleanImage = () => {
    if (!uploadedImage) return;
    
    setProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Draw image without EXIF data
      ctx.drawImage(img, 0, 0);
      
      // This simulates metadata removal
      const cleanedImage = canvas.toDataURL('image/jpeg', 0.9);
      setProcessedImage(cleanedImage);
      setProcessing(false);
      setMetadataRemoved(true);
    };
    img.src = uploadedImage;
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setImageName('');
    setMetadataRemoved(false);
  };

  // Original tools for footer
  const originalTools = [
    { name: "Remove Background", icon: <Eraser size={16} />, link: "/remove-bg", color: "from-green-500 to-emerald-600" },
    { name: "Smart Resize", icon: <Maximize size={16} />, link: "/resize", color: "from-blue-500 to-cyan-600" },
    { name: "AI Cropper", icon: <Crop size={16} />, link: "/crop", color: "from-purple-500 to-pink-600" },
    { name: "Smart Compress", icon: <FileMinus size={16} />, link: "/compress", color: "from-orange-500 to-red-600" },
    { name: "Format Engine", icon: <Layers size={16} />, link: "/convert", color: "from-yellow-500 to-amber-600" },
    { name: "Privacy Guard", icon: <ShieldCheck size={16} />, link: "/privacy", color: "from-gray-700 to-gray-900" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
     {/* NAVBAR */}
<nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={22} />
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight no-underline">Enhance Me</Link>
        </div>

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
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <Link href="/" className="block text-gray-600 hover:text-gray-700 transition-colors font-medium no-underline py-2 border-b border-gray-100">Home</Link>
            <Link href="/about" className="block text-gray-600 hover:text-gray-700 transition-colors font-medium no-underline py-2 border-b border-gray-100">About</Link>
            <Link href="/contact" className="block text-gray-600 hover:text-gray-700 transition-colors font-medium no-underline py-2 border-b border-gray-100">Contact</Link>
            <Link 
              href="/signin" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors font-medium py-2 text-left no-underline"
            >
              <User size={18} />
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT SIDE - TOOL INTERFACE */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">
                  <ShieldCheck size={16} />
                </div>
                Image Privacy Protector
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Remove Hidden <br />
                <span className="text-gray-800">Image Metadata</span>
              </h1>
              <p className="text-gray-600">
                Strip EXIF data, GPS location, camera info, and personal metadata from your images before sharing.
              </p>
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {!uploadedImage ? (
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Upload Image</h3>
                  <p className="text-gray-500 mb-6">Remove metadata before sharing</p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                    <Upload size={18} />
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
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <img src={uploadedImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium truncate max-w-[200px]">{imageName}</div>
                        <div className="text-sm text-gray-500">Ready for cleaning</div>
                      </div>
                    </div>
                    <button onClick={removeUploadedImage} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* PRIVACY OPTIONS */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Remove Information</h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={gpsRemoved}
                          onChange={(e) => setGpsRemoved(e.target.checked)}
                          className="w-5 h-5 text-gray-800 rounded"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                            <EyeOff size={16} />
                          </div>
                          <div>
                            <div className="font-medium">GPS Location</div>
                            <div className="text-sm text-gray-500">Remove location coordinates</div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={cameraInfoRemoved}
                          onChange={(e) => setCameraInfoRemoved(e.target.checked)}
                          className="w-5 h-5 text-gray-800 rounded"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <FileText size={16} />
                          </div>
                          <div>
                            <div className="font-medium">Camera Information</div>
                            <div className="text-sm text-gray-500">Remove make, model, settings</div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={true}
                          readOnly
                          className="w-5 h-5 text-gray-800 rounded"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                            <Shield size={16} />
                          </div>
                          <div>
                            <div className="font-medium">All EXIF Data</div>
                            <div className="text-sm text-gray-500">Remove all metadata</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    onClick={cleanImage}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-gray-800 to-black text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Cleaning Metadata...
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        Clean & Protect Image
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-green-600">
                      ✓ Privacy Protected
                    </h3>
                    <button onClick={removeUploadedImage} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 h-64 flex items-center justify-center p-4">
                    <img src={processedImage} alt="Result" className="max-w-full max-h-full object-contain" />
                  </div>
                  
                  {metadataRemoved && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <div className="font-medium">All Metadata Removed</div>
                          <div className="text-sm text-gray-600">Your image is now safe to share</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = processedImage;
                        link.download = `private-${imageName.split('.')[0] || 'image'}.jpg`;
                        link.click();
                      }}
                      className="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-3"
                    >
                      <Download size={20} />
                      Download Safe Image
                    </button>
                    
                    <button 
                      onClick={() => setProcessedImage(null)}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                    >
                      <Upload size={20} />
                      Clean Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW & INFO */}
          <div className="space-y-8">
            {/* INFO CARD */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-6">What We Remove</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      <EyeOff size={20} />
                    </div>
                    <div>
                      <div className="font-medium">GPS Location Data</div>
                      <div className="text-sm text-gray-600">Exact coordinates where photo was taken</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="font-medium">Camera Information</div>
                      <div className="text-sm text-gray-600">Make, model, settings, date</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      <Shield size={20} />
                    </div>
                    <div>
                      <div className="font-medium">Personal Metadata</div>
                      <div className="text-sm text-gray-600">Author, copyright, software used</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WHY PROTECT */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Why Protect Your Images?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <span className="text-sm">Prevent location tracking from shared photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <span className="text-sm">Protect camera fingerprint and serial numbers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <span className="text-sm">Remove timestamps and editing history</span>
                </li>
              </ul>
            </div>

            {/* BACK TO TOOLS */}
            <Link href="/" className="block no-underline">
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-2xl hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <ArrowRight size={24} className="rotate-180" />
                    </div>
                    <div>
                      <h3 className="font-bold">More AI Tools</h3>
                      <p className="text-sm text-gray-300">Explore all our image editing tools</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
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
     
                 {/* Popular Tools - Only original tools */}
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