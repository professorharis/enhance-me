"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize, Download, Upload, X, Sparkles, User, 
  FileImage, Zap, CheckCircle2, AlertCircle, ArrowRight,
  Smartphone, Monitor, Camera, Instagram, Facebook, 
  Twitter, Linkedin, Youtube, Globe, CreditCard,
  ShieldCheck, Crop, Flag, Menu, ChevronDown,
  Home, Mail, Info
} from 'lucide-react';

import Link from 'next/link';

export default function SmartResize() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resizedImage, setResizedImage] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('instagram');
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [resizeError, setResizeError] = useState('');
  const [quality, setQuality] = useState(90);
  const [scaleDirection, setScaleDirection] = useState('same');
  const [showPassportCountries, setShowPassportCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('standard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('upload'); // 'upload', 'settings', 'results'

  // Ref to prevent auto-scroll
  const mainContentRef = useRef(null);

  // Updated Passport sizes with more countries
  const passportSizes = [
    { country: 'Standard', code: 'standard', dimensions: { width: 600, height: 600 }, description: 'Universal size' },
    { country: 'USA', code: 'us', dimensions: { width: 600, height: 600 }, description: '2×2 inches' },
    { country: 'UK', code: 'uk', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'EU', code: 'eu', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Canada', code: 'ca', dimensions: { width: 420, height: 540 }, description: '50×70 mm' },
    { country: 'Australia', code: 'au', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'India', code: 'in', dimensions: { width: 350, height: 450 }, description: '3.5×4.5 cm' },
    { country: 'Pakistan', code: 'pk', dimensions: { width: 350, height: 450 }, description: '3.5×4.5 cm' },
    { country: 'Bangladesh', code: 'bd', dimensions: { width: 300, height: 400 }, description: 'Passport size' },
    { country: 'China', code: 'cn', dimensions: { width: 390, height: 567 }, description: '33×48 mm' },
    { country: 'Japan', code: 'jp', dimensions: { width: 354, height: 472 }, description: '35×45 mm' },
    { country: 'Saudi Arabia', code: 'sa', dimensions: { width: 400, height: 500 }, description: 'Official size' },
    { country: 'UAE', code: 'ae', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Qatar', code: 'qa', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Turkey', code: 'tr', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Russia', code: 'ru', dimensions: { width: 450, height: 600 }, description: '45×60 mm' },
    { country: 'Germany', code: 'de', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'France', code: 'fr', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Spain', code: 'es', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Italy', code: 'it', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
  ];

  // Presets organized by category
  const presets = {
    social: [
      { id: 'instagram', name: 'Instagram Post', icon: Instagram, dimensions: { width: 1080, height: 1080 }, color: 'from-pink-500 to-purple-600' },
      { id: 'instagram-story', name: 'Instagram Story', icon: Smartphone, dimensions: { width: 1080, height: 1920 }, color: 'from-purple-500 to-pink-600' },
      { id: 'facebook', name: 'Facebook Post', icon: Facebook, dimensions: { width: 1200, height: 630 }, color: 'from-blue-600 to-blue-800' },
      { id: 'twitter', name: 'Twitter Post', icon: Twitter, dimensions: { width: 1200, height: 675 }, color: 'from-sky-500 to-blue-500' },
      { id: 'linkedin', name: 'LinkedIn Post', icon: Linkedin, dimensions: { width: 1200, height: 627 }, color: 'from-blue-700 to-blue-900' },
      { id: 'youtube', name: 'YouTube Thumbnail', icon: Youtube, dimensions: { width: 1280, height: 720 }, color: 'from-red-600 to-red-700' },
    ],
    web: [
      { id: 'web-banner', name: 'Web Banner', icon: Monitor, dimensions: { width: 728, height: 90 }, color: 'from-green-500 to-emerald-600' },
      { id: 'website', name: 'Website Hero', icon: Globe, dimensions: { width: 1920, height: 1080 }, color: 'from-indigo-500 to-purple-600' },
      { id: 'mobile', name: 'Mobile App', icon: Smartphone, dimensions: { width: 1242, height: 2208 }, color: 'from-teal-500 to-cyan-600' },
      { id: 'tablet', name: 'Tablet', icon: Monitor, dimensions: { width: 2048, height: 1536 }, color: 'from-violet-500 to-purple-600' },
    ],
    documents: [
      { id: 'passport', name: 'Passport Photo', icon: Camera, dimensions: { width: 600, height: 600 }, color: 'from-amber-500 to-orange-600', hasCountries: true },
      { id: 'id-card', name: 'ID Card', icon: CreditCard, dimensions: { width: 1000, height: 600 }, color: 'from-gray-600 to-gray-800' },
    ]
  };

  // Function to prevent auto-scroll
  const preventAutoScroll = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setResizeError('Please upload an image file (JPG, PNG, WebP)');
        return;
      }

      setFileName(file.name);
      setImageFile(file);
      setResizeError('');
      setResizedImage(null);
      setShowPassportCountries(false);
      setViewMode('settings'); // Switch to settings view
      preventAutoScroll();

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setUploadedImage(e.target.result);
          setCustomWidth(img.width);
          setCustomHeight(img.height);
          updateScaleDirection(img.width, img.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentDimensions = () => {
    if (selectedPreset === 'custom') {
      return { width: customWidth, height: customHeight };
    }
    
    if (selectedPreset === 'passport' && showPassportCountries) {
      const countrySize = passportSizes.find(p => p.code === selectedCountry);
      return countrySize ? countrySize.dimensions : { width: 600, height: 600 };
    }
    
    let foundPreset;
    Object.values(presets).forEach(category => {
      const preset = category.find(p => p.id === selectedPreset);
      if (preset) foundPreset = preset;
    });
    
    return foundPreset ? foundPreset.dimensions : { width: 1080, height: 1080 };
  };

  const updateScaleDirection = (originalWidth, originalHeight) => {
    const target = getCurrentDimensions();
    const originalArea = originalWidth * originalHeight;
    const targetArea = target.width * target.height;
    
    if (targetArea > originalArea * 1.1) {
      setScaleDirection('increase');
    } else if (targetArea < originalArea * 0.9) {
      setScaleDirection('decrease');
    } else {
      setScaleDirection('same');
    }
  };

  const resizeImage = () => {
    if (!uploadedImage || !imageFile) return;

    setProcessing(true);
    setResizeError('');

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const targetDimensions = getCurrentDimensions();
        let targetWidth = targetDimensions.width;
        let targetHeight = targetDimensions.height;

        updateScaleDirection(img.width, img.height);

        if (maintainAspectRatio && selectedPreset === 'custom') {
          const aspectRatio = originalDimensions.width / originalDimensions.height;
          if (targetWidth / targetHeight > aspectRatio) {
            targetWidth = targetHeight * aspectRatio;
          } else {
            targetHeight = targetWidth / aspectRatio;
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const resizedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        setResizedImage(resizedDataUrl);
        setViewMode('results'); // Switch to results view
        preventAutoScroll();
      } catch (error) {
        setResizeError('Failed to resize image. Please try again.');
      } finally {
        setProcessing(false);
      }
    };
    img.src = uploadedImage;
  };

  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    
    if (presetId === 'passport') {
      setShowPassportCountries(true);
      setCustomWidth(600);
      setCustomHeight(600);
    } else {
      setShowPassportCountries(false);
      let foundPreset;
      Object.values(presets).forEach(category => {
        const preset = category.find(p => p.id === presetId);
        if (preset) {
          foundPreset = preset;
          setCustomWidth(preset.dimensions.width);
          setCustomHeight(preset.dimensions.height);
        }
      });
    }
    
    if (uploadedImage) {
      updateScaleDirection(originalDimensions.width, originalDimensions.height);
    }
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    const countrySize = passportSizes.find(p => p.code === countryCode);
    if (countrySize) {
      setCustomWidth(countrySize.dimensions.width);
      setCustomHeight(countrySize.dimensions.height);
      updateScaleDirection(originalDimensions.width, originalDimensions.height);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setResizedImage(null);
    setFileName('');
    setImageFile(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setResizeError('');
    setScaleDirection('same');
    setShowPassportCountries(false);
    setViewMode('upload'); // Switch back to upload view
    preventAutoScroll();
  };

  const downloadImage = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized-${fileName.split('.')[0] || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWidthChange = (value) => {
    const numValue = parseInt(value) || 1;
    setCustomWidth(numValue);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setCustomHeight(Math.round(numValue / aspectRatio));
    }
    setSelectedPreset('custom');
    setShowPassportCountries(false);
    updateScaleDirection(originalDimensions.width, originalDimensions.height);
  };

  const handleHeightChange = (value) => {
    const numValue = parseInt(value) || 1;
    setCustomHeight(numValue);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setCustomWidth(Math.round(numValue * aspectRatio));
    }
    setSelectedPreset('custom');
    setShowPassportCountries(false);
    updateScaleDirection(originalDimensions.width, originalDimensions.height);
  };

  const getScalePercentage = () => {
    const target = getCurrentDimensions();
    const originalArea = originalDimensions.width * originalDimensions.height;
    const targetArea = target.width * target.height;
    const percentage = (targetArea / originalArea) * 100;
    return Math.round(percentage);
  };

  const getScaleInfo = () => {
    switch(scaleDirection) {
      case 'increase':
        return {
          icon: '↗️',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Increasing size'
        };
      case 'decrease':
        return {
          icon: '↘️',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Decreasing size'
        };
      default:
        return {
          icon: '➡️',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Similar size'
        };
    }
  };

  useEffect(() => {
    if (selectedPreset !== 'custom' && selectedPreset !== 'passport') {
      let foundPreset;
      Object.values(presets).forEach(category => {
        const preset = category.find(p => p.id === selectedPreset);
        if (preset) {
          foundPreset = preset;
          setCustomWidth(preset.dimensions.width);
          setCustomHeight(preset.dimensions.height);
        }
      });
    }
  }, [selectedPreset]);

  const scaleInfo = getScaleInfo();

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
            
            {/* About Link */}
            <Link 
              href="/about" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <Info size={18} />
              </div>
              <span className="font-medium">About</span>
            </Link>
            
            {/* Contact Link */}
            <Link 
              href="/contact" 
              className="flex items-center gap=4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
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

      {/* MAIN CONTENT - WITH REF TO PREVENT AUTO-SCROLL */}
      <div ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          
          {/* LEFT SIDE - TOOL INTERFACE */}
          <div className="space-y-6 sm:space-y-8">
            {/* HERO SECTION - MOBILE CENTERED */}
            <div className="space-y-3 sm:space-y-4 text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm sm:text-base">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white">
                  <Maximize size={12} className="sm:size-4" />
                </div>
                AI-Powered Smart Resize
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Resize Images for <br />
                <span className="text-blue-600">Any Platform</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Smart neural scaling for social media, web, documents, and more. No cropping, just perfect resizing.
              </p>
            </div>

            {/* UPLOAD BOX - CONDITIONAL RENDERING BASED ON VIEW MODE */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
              {viewMode === 'upload' ? (
                <div className="text-center p-4 sm:p-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 mx-auto">
                    <Upload size={24} className="sm:size-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Upload Your Image</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                    Supports JPG, PNG, WebP formats
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    <Upload size={16} className="sm:size-[18px]" />
                    Select Image
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".png,.jpg,.jpeg,.webp"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              ) : viewMode === 'settings' ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* File Info */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <img src={uploadedImage} alt="Preview" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-sm sm:text-base">{fileName}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {originalDimensions.width} × {originalDimensions.height}px
                        </div>
                      </div>
                    </div>
                    <button onClick={removeUploadedImage} className="p-1.5 sm:p-2 text-gray-500 ml-2 flex-shrink-0">
                      <X size={18} className="sm:size-5" />
                    </button>
                  </div>
                  
                  {/* SIZE CHANGE INDICATOR */}
                  {uploadedImage && (
                    <div className={`p-3 sm:p-4 rounded-lg ${scaleInfo.bgColor} border ${scaleInfo.color.replace('text', 'border')} border-opacity-30`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-xl sm:text-2xl">{scaleInfo.icon}</div>
                        <div>
                          <div className="font-medium text-sm sm:text-base">{scaleInfo.text}</div>
                          <div className="text-xs sm:text-sm opacity-75">
                            Scaling to {getScalePercentage()}% of original size
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* PRESET SELECTION */}
                  <div className="space-y-4 sm:space-y-6">
                    <label className="font-medium text-sm sm:text-base">Select Platform Preset</label>
                    
                    {/* Social Media Presets */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          <Instagram size={12} className="sm:size-4" />
                        </div>
                        <h4 className="font-bold text-sm sm:text-base">Social Media</h4>
                      </div>
                      
                      {/* Mobile Scrollable */}
                      <div className="md:hidden">
                        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 space-x-3 scrollbar-hide">
                          {presets.social.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => handlePresetSelect(preset.id)}
                              className={`min-w-[120px] p-3 rounded-lg border transition-all flex-shrink-0 ${
                                selectedPreset === preset.id
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                  <preset.icon size={16} />
                                </div>
                              </div>
                              <div className="text-xs font-medium truncate mb-1">{preset.name}</div>
                              <div className="text-xs text-gray-500">
                                {preset.dimensions.width}×{preset.dimensions.height}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Desktop Grid */}
                      <div className="hidden md:grid md:grid-cols-2 gap-3">
                        {presets.social.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className={`p-4 rounded-lg border transition-all ${
                              selectedPreset === preset.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                <preset.icon size={20} />
                              </div>
                            </div>
                            <div className="font-medium text-sm mb-1">{preset.name}</div>
                            <div className="text-sm text-gray-500">
                              {preset.dimensions.width}×{preset.dimensions.height}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Web Presets */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                          <Globe size={12} className="sm:size-4" />
                        </div>
                        <h4 className="font-bold text-sm sm:text-base">Web & Display</h4>
                      </div>
                      
                      <div className="md:hidden">
                        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 space-x-3 scrollbar-hide">
                          {presets.web.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => handlePresetSelect(preset.id)}
                              className={`min-w-[120px] p-3 rounded-lg border transition-all flex-shrink-0 ${
                                selectedPreset === preset.id
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                  <preset.icon size={16} />
                                </div>
                              </div>
                              <div className="text-xs font-medium truncate mb-1">{preset.name}</div>
                              <div className="text-xs text-gray-500">
                                {preset.dimensions.width}×{preset.dimensions.height}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="hidden md:grid md:grid-cols-2 gap-3">
                        {presets.web.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className={`p-4 rounded-lg border transition-all ${
                              selectedPreset === preset.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                <preset.icon size={20} />
                              </div>
                            </div>
                            <div className="font-medium text-sm mb-1">{preset.name}</div>
                            <div className="text-sm text-gray-500">
                              {preset.dimensions.width}×{preset.dimensions.height}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Document Presets */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                          <Camera size={12} className="sm:size-4" />
                        </div>
                        <h4 className="font-bold text-sm sm:text-base">Documents & IDs</h4>
                      </div>
                      
                      <div className="md:hidden">
                        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 space-x-3 scrollbar-hide">
                          {presets.documents.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => handlePresetSelect(preset.id)}
                              className={`min-w-[120px] p-3 rounded-lg border transition-all flex-shrink-0 ${
                                selectedPreset === preset.id
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                  <preset.icon size={16} />
                                </div>
                              </div>
                              <div className="text-xs font-medium truncate mb-1">{preset.name}</div>
                              <div className="text-xs text-gray-500">
                                {preset.dimensions.width}×{preset.dimensions.height}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="hidden md:grid md:grid-cols-2 gap-3">
                        {presets.documents.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className={`p-4 rounded-lg border transition-all ${
                              selectedPreset === preset.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                <preset.icon size={20} />
                              </div>
                            </div>
                            <div className="font-medium text-sm mb-1">{preset.name}</div>
                            <div className="text-sm text-gray-500">
                              {preset.dimensions.width}×{preset.dimensions.height}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Passport Country Selection */}
                      {showPassportCountries && (
                        <div className="mt-4 p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Flag size={14} className="sm:size-4 text-amber-600" />
                            <h4 className="font-bold text-sm sm:text-base">Select Country Passport Size</h4>
                          </div>
                          
                          {/* Mobile Scrollable Countries */}
                          <div className="md:hidden">
                            <div className="flex overflow-x-auto pb-3 -mx-2 px-2 space-x-2 scrollbar-hide">
                              {passportSizes.map((country) => (
                                <button
                                  key={country.code}
                                  onClick={() => handleCountrySelect(country.code)}
                                  className={`min-w-[90px] p-2 rounded-lg border transition-all flex-shrink-0 ${
                                    selectedCountry === country.code
                                      ? 'border-amber-500 bg-amber-100 text-amber-700'
                                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                                  }`}
                                >
                                  <div className="font-medium text-xs truncate">{country.country}</div>
                                  <div className="text-[10px] text-gray-600 mt-1 truncate">
                                    {country.dimensions.width}×{country.dimensions.height}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Desktop Grid Countries */}
                          <div className="hidden md:grid md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2">
                            {passportSizes.map((country) => (
                              <button
                                key={country.code}
                                onClick={() => handleCountrySelect(country.code)}
                                className={`p-2 rounded-lg border transition-all text-left ${
                                  selectedCountry === country.code
                                    ? 'border-amber-500 bg-amber-100 text-amber-700'
                                    : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                                }`}
                              >
                                <div className="font-medium text-xs truncate">{country.country}</div>
                                <div className="text-[10px] text-gray-600 mt-1 truncate">
                                  {country.dimensions.width}×{country.dimensions.height}px
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          {/* Selected Country Info */}
                          {selectedCountry && (
                            <div className="mt-3 p-2 bg-white rounded-lg border border-amber-300">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs sm:text-sm font-medium">
                                    {passportSizes.find(c => c.code === selectedCountry)?.country} Passport
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {passportSizes.find(c => c.code === selectedCountry)?.description}
                                  </div>
                                </div>
                                <div className="text-sm font-bold text-amber-700">
                                  {getCurrentDimensions().width}×{getCurrentDimensions().height}px
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* CUSTOM DIMENSIONS */}
                  <div className="space-y-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-sm sm:text-base">Custom Dimensions</label>
                      <button
                        onClick={() => {
                          setSelectedPreset('custom');
                          setShowPassportCountries(false);
                        }}
                        className={`text-xs sm:text-sm px-3 py-1 rounded-full ${
                          selectedPreset === 'custom'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm text-gray-600 mb-1 block">Width (px)</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          min="1"
                          max="10000"
                          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-600 mb-1 block">Height (px)</label>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          min="1"
                          max="10000"
                          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 py-2">
                      <button
                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          maintainAspectRatio ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-label="Toggle aspect ratio"
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          maintainAspectRatio ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                      <span className="text-sm sm:text-base">Maintain aspect ratio</span>
                    </div>

                    {/* Quality Slider */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm sm:text-base text-gray-600">Quality: {quality}%</label>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {quality >= 80 ? 'High' : quality >= 60 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                      />
                    </div>
                  </div>
                  
                  {/* Error Display */}
                  {resizeError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={14} className="sm:size-5" />
                        <span className="font-medium text-sm sm:text-base">Resize Error</span>
                      </div>
                      <p className="text-xs sm:text-sm text-red-600 mt-1">{resizeError}</p>
                    </div>
                  )}
                  
                  {/* RESIZE BUTTON */}
                  <button 
                    onClick={resizeImage}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="sm:size-5" />
                        Smart Resize Now
                      </>
                    )}
                  </button>
                </div>
              ) : viewMode === 'results' ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle2 size={18} className="sm:size-6" />
                      Image Resized Successfully!
                    </h3>
                    <button onClick={removeUploadedImage} className="p-1.5 sm:p-2 text-gray-500">
                      <X size={18} className="sm:size-5" />
                    </button>
                  </div>
                  
                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                      <div className="text-sm font-medium text-gray-600 mb-2">Original</div>
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={uploadedImage} alt="Original" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        {originalDimensions.width} × {originalDimensions.height}px
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                      <div className="text-sm font-medium text-gray-600 mb-2">Resized</div>
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                        <img src={resizedImage} alt="Resized" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        {getCurrentDimensions().width} × {getCurrentDimensions().height}px
                      </div>
                    </div>
                  </div>
                  
                  {/* Download Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={downloadImage}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Download size={16} className="sm:size-[18px]" />
                      Download Image
                    </button>
                    
                    <button 
                      onClick={removeUploadedImage}
                      className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Upload size={16} className="sm:size-[18px]" />
                      Resize Another
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2 sm:mb-3">
                  <Maximize size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">Smart Scaling</h4>
                <p className="text-xs text-gray-600">See size increase/decrease visually</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2 sm:mb-3">
                  <Flag size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">Global Passport</h4>
                <p className="text-xs text-gray-600">20+ country specific sizes</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2 sm:mb-3">
                  <ShieldCheck size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">No Cropping</h4>
                <p className="text-xs text-gray-600">Maintains image composition</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW & INFO */}
          <div className="space-y-6 sm:space-y-8">
            {/* PLATFORM COMPARISON */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 sm:mb-6">Platform & Passport Sizes</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                      <Instagram size={16} className="sm:size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base">Social Media</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Optimized for engagement</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">Instagram</div>
                      <div className="text-xs text-gray-500">1080×1080</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">Facebook</div>
                      <div className="text-xs text-gray-500">1200×630</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                      <Globe size={16} className="sm:size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base">Global Passport Sizes</h4>
                      <p className="text-xs sm:text-sm text-gray-600">20+ countries including Pakistan, Saudi, UAE</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">Pakistan</div>
                      <div className="text-xs text-gray-500">350×450px</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">Saudi Arabia</div>
                      <div className="text-xs text-gray-500">400×500px</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">UAE</div>
                      <div className="text-xs text-gray-500">413×531px</div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <strong>Tip:</strong> Click the passport icon above to select from 20+ countries
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <Monitor size={16} className="sm:size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base">Web & Documents</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Banners, IDs, and displays</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">Web Hero</div>
                      <div className="text-xs text-gray-500">1920×1080</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">ID Card</div>
                      <div className="text-xs text-gray-500">1000×600</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">Banner</div>
                      <div className="text-xs text-gray-500">728×90</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-3 sm:mb-4">Resizing Tips</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    1
                  </div>
                  <span className="text-xs sm:text-sm">The arrow indicator shows if image size increases (↗) or decreases (↘)</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    2
                  </div>
                  <span className="text-xs sm:text-sm">Click passport icon for country-specific sizes (USA, UK, EU, Pakistan, Saudi, UAE etc.)</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    3
                  </div>
                  <span className="text-xs sm:text-sm">Use 70-80% quality for faster web loading</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    4
                  </div>
                  <span className="text-xs sm:text-sm">Maintain aspect ratio to avoid distortion</span>
                </li>
              </ul>
            </div>

            {/* FILE INFO */}
            {uploadedImage && viewMode === 'settings' && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold mb-3 sm:mb-4">Image Information</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">Original Size</span>
                    <span className="font-medium text-sm">{originalDimensions.width} × {originalDimensions.height}px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">Target Size</span>
                    <span className="font-medium text-sm">{getCurrentDimensions().width} × {getCurrentDimensions().height}px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">Scale Change</span>
                    <span className={`font-medium text-sm ${scaleInfo.color}`}>
                      {scaleDirection === 'increase' ? 'Increase' : scaleDirection === 'decrease' ? 'Decrease' : 'Minimal Change'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">Platform</span>
                    <span className="font-medium text-blue-600 text-sm">
                      {selectedPreset === 'passport' && showPassportCountries 
                        ? `Passport (${passportSizes.find(c => c.code === selectedCountry)?.country})`
                        : selectedPreset === 'custom' 
                          ? 'Custom' 
                          : selectedPreset
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

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