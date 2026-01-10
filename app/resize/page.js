"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize, Download, Upload, X, Sparkles, User, 
  FileImage, Zap, CheckCircle2, AlertCircle, ArrowRight,
  Smartphone, Monitor, Camera, Instagram, Facebook, 
  Twitter, Linkedin, Youtube, Globe, CreditCard,
  Image as ImageIcon, Lock, ShieldCheck, Crop,
  Flag, MapPin, Globe as GlobeIcon, Users
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

  // Original tools for footer
  const originalTools = [
    { name: "Remove Background", icon: <Maximize size={16} />, link: "/remove-bg", color: "from-green-500 to-emerald-600" },
    { name: "Smart Resize", icon: <Maximize size={16} />, link: "/resize", color: "from-blue-500 to-cyan-600" },
    { name: "AI Cropper", icon: <Crop size={16} />, link: "/crop", color: "from-purple-500 to-pink-600" },
    { name: "Smart Compress", icon: <FileImage size={16} />, link: "/compress", color: "from-orange-500 to-red-600" },
    { name: "Format Engine", icon: <Globe size={16} />, link: "/convert", color: "from-yellow-500 to-amber-600" },
    { name: "Privacy Guard", icon: <ShieldCheck size={16} />, link: "/privacy", color: "from-gray-700 to-gray-900" },
  ];

  // Passport sizes for different countries
  const passportSizes = [
    { country: 'Standard', code: 'standard', dimensions: { width: 600, height: 600 }, description: 'Universal size' },
    { country: 'United States', code: 'us', dimensions: { width: 600, height: 600 }, description: '2×2 inches' },
    { country: 'United Kingdom', code: 'uk', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'European Union', code: 'eu', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Canada', code: 'ca', dimensions: { width: 420, height: 540 }, description: '50×70 mm' },
    { country: 'Australia', code: 'au', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'India', code: 'in', dimensions: { width: 350, height: 450 }, description: '3.5×4.5 cm' },
    { country: 'China', code: 'cn', dimensions: { width: 390, height: 567 }, description: '33×48 mm' },
    { country: 'Japan', code: 'jp', dimensions: { width: 354, height: 472 }, description: '35×45 mm' },
    { country: 'Saudi Arabia', code: 'sa', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'UAE', code: 'ae', dimensions: { width: 413, height: 531 }, description: '35×45 mm' },
    { country: 'Pakistan', code: 'pk', dimensions: { width: 350, height: 450 }, description: '3.5×4.5 cm' },
  ];

  // Preset dimensions for different platforms
  const presets = [
    {
      id: 'instagram',
      name: 'Instagram Post',
      icon: <Instagram size={20} />,
      dimensions: { width: 1080, height: 1080 },
      color: 'from-pink-500 to-purple-600',
      category: 'social'
    },
    {
      id: 'instagram-story',
      name: 'Instagram Story',
      icon: <Smartphone size={20} />,
      dimensions: { width: 1080, height: 1920 },
      color: 'from-purple-500 to-pink-600',
      category: 'social'
    },
    {
      id: 'facebook',
      name: 'Facebook Post',
      icon: <Facebook size={20} />,
      dimensions: { width: 1200, height: 630 },
      color: 'from-blue-600 to-blue-800',
      category: 'social'
    },
    {
      id: 'twitter',
      name: 'Twitter Post',
      icon: <Twitter size={20} />,
      dimensions: { width: 1200, height: 675 },
      color: 'from-sky-500 to-blue-500',
      category: 'social'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Post',
      icon: <Linkedin size={20} />,
      dimensions: { width: 1200, height: 627 },
      color: 'from-blue-700 to-blue-900',
      category: 'social'
    },
    {
      id: 'youtube',
      name: 'YouTube Thumbnail',
      icon: <Youtube size={20} />,
      dimensions: { width: 1280, height: 720 },
      color: 'from-red-600 to-red-700',
      category: 'social'
    },
    {
      id: 'web-banner',
      name: 'Web Banner',
      icon: <Monitor size={20} />,
      dimensions: { width: 728, height: 90 },
      color: 'from-green-500 to-emerald-600',
      category: 'web'
    },
    {
      id: 'passport',
      name: 'Passport Photo',
      icon: <Camera size={20} />,
      dimensions: { width: 600, height: 600 },
      color: 'from-amber-500 to-orange-600',
      category: 'documents',
      hasCountries: true
    },
    {
      id: 'id-card',
      name: 'ID Card',
      icon: <CreditCard size={20} />,
      dimensions: { width: 1000, height: 600 },
      color: 'from-gray-600 to-gray-800',
      category: 'documents'
    },
    {
      id: 'website',
      name: 'Website Hero',
      icon: <Globe size={20} />,
      dimensions: { width: 1920, height: 1080 },
      color: 'from-indigo-500 to-purple-600',
      category: 'web'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: <Smartphone size={20} />,
      dimensions: { width: 1242, height: 2208 },
      color: 'from-teal-500 to-cyan-600',
      category: 'web'
    },
    {
      id: 'tablet',
      name: 'Tablet',
      icon: <Monitor size={20} />,
      dimensions: { width: 2048, height: 1536 },
      color: 'from-violet-500 to-purple-600',
      category: 'web'
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setResizeError('Please upload an image file (JPG, PNG, WebP)');
        return;
      }

      setFileName(file.name);
      setImageFile(file);
      setResizeError('');
      setResizedImage(null);
      setShowPassportCountries(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setUploadedImage(e.target.result);
          
          // Set custom dimensions to original for starters
          setCustomWidth(img.width);
          setCustomHeight(img.height);
          
          // Calculate scale direction
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
    
    const preset = presets.find(p => p.id === selectedPreset);
    return preset ? preset.dimensions : { width: 1080, height: 1080 };
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

        // Update scale direction
        updateScaleDirection(img.width, img.height);

        // Maintain aspect ratio if requested
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

        // Fill with white background for transparent images
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw image with high quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to data URL with specified quality
        const resizedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        setResizedImage(resizedDataUrl);
      } catch (error) {
        console.error('Resize error:', error);
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
      // Set to standard passport size initially
      setCustomWidth(600);
      setCustomHeight(600);
    } else {
      setShowPassportCountries(false);
      const preset = presets.find(p => p.id === presetId);
      if (preset) {
        setCustomWidth(preset.dimensions.width);
        setCustomHeight(preset.dimensions.height);
      }
    }
    
    // Update scale direction
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

  // Calculate scale percentage
  const getScalePercentage = () => {
    const target = getCurrentDimensions();
    const originalArea = originalDimensions.width * originalDimensions.height;
    const targetArea = target.width * target.height;
    const percentage = (targetArea / originalArea) * 100;
    return Math.round(percentage);
  };

  // Get scale icon and color
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

  // Initialize with default preset dimensions
  useEffect(() => {
    if (selectedPreset !== 'custom' && selectedPreset !== 'passport') {
      const preset = presets.find(p => p.id === selectedPreset);
      if (preset) {
        setCustomWidth(preset.dimensions.width);
        setCustomHeight(preset.dimensions.height);
      }
    }
  }, [selectedPreset]);

  // Get categories for organized display
  const categories = {
    social: presets.filter(p => p.category === 'social'),
    web: presets.filter(p => p.category === 'web'),
    documents: presets.filter(p => p.category === 'documents')
  };

  const scaleInfo = getScaleInfo();

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
    </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT SIDE - TOOL INTERFACE */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white">
                  <Maximize size={16} />
                </div>
                AI-Powered Smart Resize
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Resize Images for <br />
                <span className="text-blue-600">Any Platform</span>
              </h1>
              <p className="text-gray-600">
                Smart neural scaling for social media, web, documents, and more. No cropping, just perfect resizing.
              </p>
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {!uploadedImage ? (
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Upload Your Image</h3>
                  <p className="text-gray-500 mb-6">
                    Supports JPG, PNG, WebP formats
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                    <Upload size={18} />
                    Select Image
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".png,.jpg,.jpeg,.webp"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              ) : !resizedImage ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <img src={uploadedImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium truncate max-w-[200px]">{fileName}</div>
                        <div className="text-sm text-gray-500">
                          {originalDimensions.width} × {originalDimensions.height}px
                        </div>
                      </div>
                    </div>
                    <button onClick={removeUploadedImage} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* SIZE CHANGE INDICATOR */}
                  {uploadedImage && (
                    <div className={`p-3 rounded-lg ${scaleInfo.bgColor} border ${scaleInfo.color.replace('text', 'border')} border-opacity-30`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{scaleInfo.icon}</div>
                        <div>
                          <div className="font-medium">{scaleInfo.text}</div>
                          <div className="text-sm opacity-75">
                            Scaling to {getScalePercentage()}% of original size
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* PRESET SELECTION */}
                  <div className="space-y-4">
                    <label className="font-medium">Select Platform Preset</label>
                    
                    {/* Social Media Presets */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          <Instagram size={14} />
                        </div>
                        <h4 className="font-bold text-sm">Social Media</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {categories.social.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className={`p-3 rounded-lg border transition-all ${
                              selectedPreset === preset.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                {preset.icon}
                              </div>
                            </div>
                            <div className="text-xs font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {preset.dimensions.width}×{preset.dimensions.height}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Web Presets */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                          <Globe size={14} />
                        </div>
                        <h4 className="font-bold text-sm">Web & Display</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {categories.web.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className={`p-3 rounded-lg border transition-all ${
                              selectedPreset === preset.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                {preset.icon}
                              </div>
                            </div>
                            <div className="text-xs font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {preset.dimensions.width}×{preset.dimensions.height}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Document Presets with Passport Countries */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                          <Camera size={14} />
                        </div>
                        <h4 className="font-bold text-sm">Documents & IDs</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.documents.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className={`p-3 rounded-lg border transition-all ${
                              selectedPreset === preset.id
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center text-white`}>
                                {preset.icon}
                              </div>
                            </div>
                            <div className="text-xs font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {preset.dimensions.width}×{preset.dimensions.height}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Passport Country Selection */}
                      {showPassportCountries && (
                        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Flag size={16} className="text-amber-600" />
                            <h4 className="font-bold text-sm">Select Country Passport Size</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2">
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
                                <div className="font-medium text-xs">{country.country}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {country.dimensions.width}×{country.dimensions.height}px
                                </div>
                              </button>
                            ))}
                          </div>
                          {selectedCountry && (
                            <div className="mt-3 p-2 bg-white rounded-lg border border-amber-300">
                              <div className="text-xs font-medium">
                                {passportSizes.find(c => c.code === selectedCountry)?.country} Passport: {getCurrentDimensions().width}×{getCurrentDimensions().height}px
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {passportSizes.find(c => c.code === selectedCountry)?.description}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* CUSTOM DIMENSIONS */}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <label className="font-medium">Custom Dimensions</label>
                      <button
                        onClick={() => {
                          setSelectedPreset('custom');
                          setShowPassportCountries(false);
                        }}
                        className={`text-xs px-3 py-1 rounded-full ${
                          selectedPreset === 'custom'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Width (px)</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          min="1"
                          max="10000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Height (px)</label>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          min="1"
                          max="10000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          maintainAspectRatio ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          maintainAspectRatio ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                      <span className="text-sm">Maintain aspect ratio</span>
                    </div>

                    {/* Quality Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-600">Quality: {quality}%</label>
                        <span className="text-xs text-gray-500">
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
                  
                  {resizeError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={18} />
                        <span className="font-medium">Resize Error</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{resizeError}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={resizeImage}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        Smart Resize Now
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle2 size={24} />
                      Image Resized Successfully!
                    </h3>
                    <button onClick={removeUploadedImage} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm font-medium text-gray-600 mb-2">Original</div>
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={uploadedImage} alt="Original" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        {originalDimensions.width} × {originalDimensions.height}px
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm font-medium text-gray-600 mb-2">Resized</div>
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                        <img src={resizedImage} alt="Resized" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        {getCurrentDimensions().width} × {getCurrentDimensions().height}px
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={downloadImage}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-3"
                    >
                      <Download size={20} />
                      Download Image
                    </button>
                    
                    <button 
                      onClick={removeUploadedImage}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                    >
                      <Upload size={20} />
                      Resize Another
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                  <Maximize size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">Smart Scaling</h4>
                <p className="text-xs text-gray-600">See size increase/decrease visually</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                  <Flag size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">Global Passport</h4>
                <p className="text-xs text-gray-600">12+ country specific sizes</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">No Cropping</h4>
                <p className="text-xs text-gray-600">Maintains image composition</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW & INFO */}
          <div className="space-y-8">
            {/* PLATFORM COMPARISON */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-6">Platform & Passport Sizes</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                      <Instagram size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">Social Media</h4>
                      <p className="text-sm text-gray-600">Optimized for engagement</p>
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
                
                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                      <GlobeIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">Global Passport Sizes</h4>
                      <p className="text-sm text-gray-600">Click passport icon to select country</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">USA/UK/EU</div>
                      <div className="text-xs text-gray-500">600×600px</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">Canada</div>
                      <div className="text-xs text-gray-500">420×540px</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <div className="text-xs font-medium">India/Pak</div>
                      <div className="text-xs text-gray-500">350×450px</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <strong>Tip:</strong> Click the passport icon above to select from 12+ countries
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <Monitor size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">Web & Documents</h4>
                      <p className="text-sm text-gray-600">Banners, IDs, and displays</p>
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Resizing Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">📈</span>
                  </div>
                  <span className="text-sm">The arrow indicator shows if image size increases (↗) or decreases (↘)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🌍</span>
                  </div>
                  <span className="text-sm">Click passport icon for country-specific sizes (USA, UK, EU, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">⚡</span>
                  </div>
                  <span className="text-sm">Use 70-80% quality for faster web loading</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">📏</span>
                  </div>
                  <span className="text-sm">Maintain aspect ratio to avoid distortion</span>
                </li>
              </ul>
            </div>

            {/* FILE INFO */}
            {uploadedImage && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Image Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Original Size</span>
                    <span className="font-medium">{originalDimensions.width} × {originalDimensions.height}px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Target Size</span>
                    <span className="font-medium">{getCurrentDimensions().width} × {getCurrentDimensions().height}px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Scale Change</span>
                    <span className={`font-medium ${scaleInfo.color}`}>
                      {scaleDirection === 'increase' ? 'Increase' : scaleDirection === 'decrease' ? 'Decrease' : 'Minimal Change'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Platform</span>
                    <span className="font-medium text-blue-600">
                      {selectedPreset === 'passport' && showPassportCountries 
                        ? `Passport (${passportSizes.find(c => c.code === selectedCountry)?.country})`
                        : selectedPreset === 'custom' 
                          ? 'Custom' 
                          : presets.find(p => p.id === selectedPreset)?.name
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                      <p className="text-sm text-gray-300">Explore all our image processing tools</p>
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
                Simple and Fast Image 
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