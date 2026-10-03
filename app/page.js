"use client";

/**
 * Enhance Me — Professional Image Studio
 * ----------------------------------------
 * A background removal tool that runs entirely in the browser (no server uploads).
 * Powered by @imgly/background-removal (WASM + ONNX, self-hosted).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Eraser, Maximize, Layers, Zap, Upload,
  Download, X, User,
  LayoutGrid, SlidersHorizontal, RotateCcw, Eye, EyeOff,
  Menu, ChevronRight, CheckCircle2, ArrowRight, Lock, Info,
  ShieldCheck, Minimize2, Home, Mail, FileText, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfessionalImageStudio() {
  const router = useRouter();

  // ==========================================================
  // STATE MANAGEMENT
  // ==========================================================
  const [uploadedImage, setUploadedImage] = useState(null);         // Original image (data URL)
  const [imageFile, setImageFile] = useState(null);                 // Original File object
  const [imageName, setImageName] = useState('');                   // Filename
  const [processing, setProcessing] = useState(false);              // BG removal in progress?
  const [processedImage, setProcessedImage] = useState(null);       // Result (transparent PNG)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);      // Mobile nav toggle
  const [showOriginal, setShowOriginal] = useState(false);          // Preview toggle (before/after)
  const [processingProgress, setProcessingProgress] = useState(''); // Progress text
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState('');               // "16:9", "1:1", etc.
  const [faqOpen, setFaqOpen] = useState(null);                     // Which FAQ item is open
  const [fromTermsPrivacy, setFromTermsPrivacy] = useState(false);  // Return-from-nav flag
  const [isMobile, setIsMobile] = useState(false);                  // Mobile viewport detection

  // Cache the bg-removal module so it loads only once per session
  const bgRemovalModuleRef = useRef(null);

  // Demo images for the interactive before/after slider
  const demoBeforeImage = "/demo-images/before.png.png";
  const demoAfterImage = "/demo-images/after.png.png";

  // ==========================================================
  // EFFECTS
  // ==========================================================

  /**
   * Detect mobile device / small viewport on mount.
   * Used for responsive tweaks beyond what CSS can handle.
   */
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Restore state when the user returns from Terms/Privacy pages.
   * State is saved in sessionStorage before navigating away
   * (see handleTermsPrivacyClick below).
   */
  useEffect(() => {
    const checkSessionStorage = () => {
      try {
        const sessionState = sessionStorage.getItem('imageStudioState');
        if (!sessionState) return;

        const state = JSON.parse(sessionState);
        const timeDiff = Date.now() - state.timestamp;

        // Only restore if state is fresh (less than 5 minutes old)
        if (timeDiff < 5 * 60 * 1000) {
          setUploadedImage(state.uploadedImage);
          setProcessedImage(state.processedImage);
          setImageName(state.imageName);
          setImageSize(state.imageSize);
          setAspectRatio(state.aspectRatio);
          setFromTermsPrivacy(true);

          // Clear after restoring
          setTimeout(() => {
            sessionStorage.removeItem('imageStudioState');
            setFromTermsPrivacy(false);
          }, 100);
        } else {
          sessionStorage.removeItem('imageStudioState');
        }
      } catch (error) {
        console.error('Error checking sessionStorage:', error);
      }
    };

    checkSessionStorage();
  }, []);

  /**
   * Load previously saved image state from localStorage on mount.
   * Provides a "resume where you left off" experience.
   */
  useEffect(() => {
    try {
      const savedUploadedImage = localStorage.getItem('uploadedImage');
      const savedProcessedImage = localStorage.getItem('processedImage');
      const savedImageName = localStorage.getItem('imageName');
      const savedImageSize = localStorage.getItem('imageSize');
      const savedAspectRatio = localStorage.getItem('aspectRatio');

      if (savedUploadedImage) setUploadedImage(savedUploadedImage);
      if (savedProcessedImage) setProcessedImage(savedProcessedImage);
      if (savedImageName) setImageName(savedImageName);
      if (savedImageSize) setImageSize(JSON.parse(savedImageSize));
      if (savedAspectRatio) setAspectRatio(savedAspectRatio);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // ==========================================================
  // PERSISTENCE HELPERS
  // ==========================================================

  /** Save current image state to localStorage */
  const saveToLocalStorage = () => {
    try {
      if (uploadedImage) localStorage.setItem('uploadedImage', uploadedImage);
      if (processedImage) localStorage.setItem('processedImage', processedImage);
      if (imageName) localStorage.setItem('imageName', imageName);
      if (imageSize.width > 0) localStorage.setItem('imageSize', JSON.stringify(imageSize));
      if (aspectRatio) localStorage.setItem('aspectRatio', aspectRatio);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  /** Wipe all saved image data from localStorage */
  const clearLocalStorage = () => {
    try {
      [
        'uploadedImage',
        'processedImage',
        'imageName',
        'imageSize',
        'aspectRatio',
        'editImageData',
        'editImageMask',
        'editOriginalImageData',
      ].forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  // ==========================================================
  // UTILITIES
  // ==========================================================

  /** Derive a friendly aspect ratio label from width & height */
  const calculateAspectRatio = (width, height) => {
    const ratio = width / height;
    if (Math.abs(ratio - 16 / 9) < 0.1) setAspectRatio('16:9');
    else if (Math.abs(ratio - 4 / 3) < 0.1) setAspectRatio('4:3');
    else if (Math.abs(ratio - 1) < 0.1) setAspectRatio('1:1');
    else if (ratio > 1) setAspectRatio('Landscape');
    else setAspectRatio('Portrait');
  };

  // ==========================================================
  // FILE UPLOAD HANDLER
  // ==========================================================

  /** Handle file input → read as DataURL, capture dimensions */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Basic type validation
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (JPG, PNG, WebP)');
      return;
    }

    setImageFile(file);
    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setUploadedImage(imageData);
      setProcessedImage(null);
      setShowOriginal(false);
      setProcessingProgress('');

      // Measure dimensions for layout
      const img = new Image();
      img.onload = () => {
        const size = { width: img.width, height: img.height };
        setImageSize(size);
        calculateAspectRatio(img.width, img.height);
        saveToLocalStorage();
      };
      img.src = imageData;
    };
    reader.readAsDataURL(file);
  };

  // ==========================================================
  // BACKGROUND REMOVAL (@imgly/background-removal)
  // ==========================================================
  /**
   * Model + WASM files are self-hosted at /public/bg-removal/.
   * This removes all third-party CDN dependencies (Hugging Face xet,
   * jsDelivr, staticimgly.com), which can be flaky on some networks.
   *
   * NOTE: `publicPath` must be an ABSOLUTE URL — the library internally
   * does `new URL(file, publicPath)`, and a bare relative path throws
   * "Failed to construct 'URL': Invalid base URL". We build it from
   * `window.location.origin` at call time so it works in dev + prod.
   */

  /** Build the absolute publicPath for /bg-removal/ assets */
  const getBgRemovalPublicPath = () =>
    typeof window !== 'undefined'
      ? new URL('/bg-removal/', window.location.origin).toString()
      : '/bg-removal/';

  /** Lazy-load the library only when needed; cache for repeat runs */
  const getBackgroundRemovalFn = async () => {
    if (!bgRemovalModuleRef.current) {
      bgRemovalModuleRef.current = await import('@imgly/background-removal');
    }
    return bgRemovalModuleRef.current.removeBackground;
  };

  /** Run the actual removal (single attempt) */
  const removeBackgroundOnce = async (blob) => {
    const removeBackground = await getBackgroundRemovalFn();
    return removeBackground(blob, {
      publicPath: getBgRemovalPublicPath(),
      model: 'small',
      output: { format: 'image/png' },
    });
  };

  /**
   * Main background-removal runner.
   * Includes one automatic retry — the most common failure is a flaky
   * first fetch of WASM/model files over a slow connection.
   */
  const runRealProcess = async (isRetry = false) => {
    if (!imageFile || !uploadedImage) return;

    setProcessing(true);
    setProcessingProgress('Removing background...');

    try {
      const blob = await removeBackgroundOnce(imageFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProcessedImage(reader.result);
        setProcessing(false);
        setProcessingProgress('');
        saveToLocalStorage();
      };
      reader.onerror = () => {
        throw new Error('Could not read processed image');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Background removal failed:', error);

      // Clear partially-initialized module so retry re-imports cleanly
      bgRemovalModuleRef.current = null;

      if (!isRetry) {
        setProcessingProgress('Retrying...');
        await runRealProcess(true);
        return;
      }

      setProcessingProgress('Failed to remove background. Check your connection and try again.');
      setProcessing(false);
      setTimeout(() => setProcessingProgress(''), 3500);
    }
  };

  // ==========================================================
  // UI ACTIONS
  // ==========================================================

  /** Clear all image state (also wipes localStorage) */
  const removeUploadedImage = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setImageName('');
    setImageFile(null);
    setShowOriginal(false);
    setProcessingProgress('');
    setImageSize({ width: 0, height: 0 });
    setFromTermsPrivacy(false);
    clearLocalStorage();
  };

  /** Smooth-scroll to the "More Tools" section */
  const scrollToTools = () => {
    document.getElementById('more-tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  /** Smooth-scroll to the upload section */
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  /** Toggle preview between original and processed image */
  const handleEyeToggle = () => {
    setShowOriginal(!showOriginal);
  };

  /**
   * Prepare the image(s) for the /remove-bg editor.
   * Compresses large images to fit localStorage limits before navigating.
   */
  const handleEditImage = () => {
    if (!uploadedImage) return;

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Downscale to max 1000px on either side to fit localStorage
        const maxWidth = 1000;
        const maxHeight = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedOriginal = canvas.toDataURL('image/png', 0.8);

        // Save original (with background)
        localStorage.setItem('editOriginalImageData', compressedOriginal);

        // Save AI-processed image (transparent background) if available
        if (processedImage) {
          const processedImg = new Image();
          processedImg.onload = () => {
            const processedCanvas = document.createElement('canvas');
            const processedCtx = processedCanvas.getContext('2d');
            processedCanvas.width = width;
            processedCanvas.height = height;
            processedCtx.drawImage(processedImg, 0, 0, width, height);

            const compressedProcessed = processedCanvas.toDataURL('image/png', 0.9);
            localStorage.setItem('editImageData', compressedProcessed);

            router.push('/remove-bg');
          };
          processedImg.src = processedImage;
        } else {
          localStorage.setItem('editImageData', compressedOriginal);
          router.push('/remove-bg');
        }

        localStorage.setItem('editImageType', 'bg');
        localStorage.setItem('editImageName', imageName || 'edited-image.png');
      };
      img.src = uploadedImage;
    } catch (error) {
      console.error('Error preparing image for edit:', error);
      alert('Unable to open editor.');
    }
  };

  /**
   * Save current state to sessionStorage, then navigate to Terms/Privacy.
   * The state is restored when the user comes back (see the mount effect).
   */
  const handleTermsPrivacyClick = (page) => {
    const stateToSave = {
      uploadedImage,
      processedImage,
      imageName,
      imageSize,
      aspectRatio,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem('imageStudioState', JSON.stringify(stateToSave));
      if (page === 'terms') router.push('/terms');
      else router.push('/privacy-policy');
    } catch (error) {
      console.error('Error saving state:', error);
      // Fallback navigation
      if (page === 'terms') router.push('/terms');
      else router.push('/privacy-policy');
    }
  };

  // ==========================================================
  // STATIC DATA
  // ==========================================================
  const faqs = [
    {
      question: "Is this tool free to use?",
      answer: "Yes, background removal and basic editing are free to use for standard quality images."
    },
    {
      question: "Do you store my images?",
      answer: "No. Images are processed directly in your browser and are never uploaded to a server."
    },
    {
      question: "What image formats are supported?",
      answer: "JPG, PNG, and WebP formats up to 10MB in size."
    },
    {
      question: "Can I edit the background after removing it?",
      answer: "Yes! Click 'Edit' after processing to open it in the editor."
    }
  ];

  /** Toggle an FAQ item (accordion behavior) */
  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans overflow-x-hidden">

      {/* ==================== NAVBAR ==================== */}
      <nav className="h-16 sm:h-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline group">
          {/* Real brand logo from /public/logo.png */}
          <NextImage
            src="/logo.png"
            alt="Enhance Me Logo"
            width={44}
            height={44}
            className="rounded-xl sm:rounded-2xl object-contain"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              Enhance Me
            </span>
          </div>
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
          <Link href="/about" className="hover:text-blue-600 transition-colors no-underline">About</Link>
          <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors no-underline">Privacy</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors no-underline">Contact</Link>
          <Link href="/faq" className="hover:text-blue-600 transition-colors no-underline">FAQ</Link>

          <button
            onClick={scrollToUpload}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg normal-case tracking-normal font-bold hover:bg-blue-700 transition-colors no-underline"
          >
            Try Free
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ==================== MOBILE MENU ==================== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-16 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
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
                <Info size={18} />
              </div>
              <span className="font-medium">About</span>
            </Link>

            <Link
              href="/privacy-policy"
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <span className="font-medium">Privacy</span>
            </Link>

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

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToUpload();
              }}
              className="flex items-center gap-4 py-3 px-4 text-blue-600 hover:bg-gray-50 transition-colors font-bold text-left"
            >
              <div className="w-10 h-10 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center">
                <Zap size={18} />
              </div>
              <span className="font-medium">Try Free</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================== HERO + UPLOAD SECTION ==================== */}
      <section id="upload-section" className="pt-6 sm:pt-16 pb-4 sm:pb-8 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
              Simple <span className="text-blue-600">Image Studio</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Clean, fast background removal — right in your browser, no sign-up needed
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2 mb-4 sm:gap-4 mb-6 sm:mb-8 justify-center px-2">
              <button className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                <Eraser size={12} className="sm:size-[18px]" /> Remove Background
              </button>
              <button
                onClick={scrollToTools}
                className="px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              >
                <LayoutGrid size={12} className="sm:size-[18px]" /> More Tools
              </button>
            </div>

            {/* Main upload / process / result card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6 md:p-8 mb-6 sm:mb-12">
              <AnimatePresence mode="wait">
                {/* ---- State 1: No image uploaded yet ---- */}
                {!uploadedImage ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-4 sm:p-6"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 mx-auto">
                      <Upload size={20} className="sm:size-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Upload Your Image</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Drag & drop or click to browse</p>
                    <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors text-xs sm:text-sm">
                      <Upload size={14} className="sm:size-[18px]" /> Choose File
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </motion.div>
                ) : !processedImage ? (
                  /* ---- State 2: Image uploaded, awaiting processing ---- */
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* File info header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base truncate">{imageName}</div>
                          <div className="text-xs sm:text-sm text-gray-500">Ready to process</div>
                          {imageSize.width > 0 && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {imageSize.width}×{imageSize.height}px • {aspectRatio}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={removeUploadedImage}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
                      >
                        <X size={16} className="sm:size-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Progress indicator (only shown while working) */}
                    {processingProgress && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-pulse"></div>
                          <span className="font-medium">{processingProgress}</span>
                        </div>
                      </div>
                    )}

                    {/* Primary action button */}
                    <button
                      onClick={() => runRealProcess()}
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap size={16} className="sm:size-5" />
                          Remove Background Now
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  /* ---- State 3: Processing complete, show result ---- */
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold truncate">Background Removed!</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {imageSize.width > 0 && (
                            <span className="truncate">
                              {imageSize.width}×{imageSize.height}px • {aspectRatio}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={removeUploadedImage}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0"
                      >
                        <X size={16} className="sm:size-5" />
                      </button>
                    </div>

                    {/* Result preview with transparent checkerboard background */}
                    <div className="relative w-full flex justify-center bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div
                        className="relative rounded-lg overflow-hidden border-2 border-green-200 bg-checkerboard shadow-sm"
                        style={{
                          aspectRatio:
                            imageSize.width && imageSize.height
                              ? `${imageSize.width} / ${imageSize.height}`
                              : 'auto',
                          maxHeight: '45vh',
                          maxWidth: '100%',
                        }}
                      >
                        <img
                          src={showOriginal ? uploadedImage : processedImage}
                          alt="Result"
                          className="w-full h-full object-contain block"
                        />

                        {/* Toggle between original and transparent view */}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col items-end gap-1 sm:gap-2 z-10">
                          <button
                            onClick={handleEyeToggle}
                            className={`p-1.5 sm:p-2 rounded-full shadow-lg transition-all flex items-center gap-1 ${
                              showOriginal ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                            }`}
                            aria-label={showOriginal ? 'Show transparent' : 'Show original'}
                          >
                            {showOriginal ? (
                              <EyeOff size={12} className="sm:size-[18px]" />
                            ) : (
                              <Eye size={12} className="sm:size-[18px]" />
                            )}
                          </button>
                          <div
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold shadow-sm ${
                              showOriginal
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {showOriginal ? 'ORIGINAL' : 'TRANSPARENT'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Privacy notice */}
                    <div className="text-center py-2 border-gray-200">
                      <p className="text-[10px] sm:text-xs text-gray-500 leading-tight whitespace-nowrap">
                        By using our service, you agree to our{' '}
                        <button
                          onClick={() => handleTermsPrivacyClick('terms')}
                          className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0 text-[10px] sm:text-xs"
                        >
                          Terms
                        </button>{' '}
                        and{' '}
                        <button
                          onClick={() => handleTermsPrivacyClick('privacy')}
                          className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0 text-[10px] sm:text-xs"
                        >
                          Privacy
                        </button>
                      </p>
                    </div>

                    {/* Action buttons: Download / New / Edit */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = processedImage;
                          link.download = `transparent-bg-${
                            imageName.split('.')[0] || 'image'
                          }.png`;
                          link.click();
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium hover:shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Download size={14} className="sm:size-[18px]" /> Download
                      </button>
                      <button
                        onClick={() => setProcessedImage(null)}
                        className="bg-gray-100 text-gray-700 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <RotateCcw size={14} className="sm:size-[18px]" /> New
                      </button>
                      <button
                        onClick={handleEditImage}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium hover:shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <SlidersHorizontal size={14} className="sm:size-[18px]" /> Edit
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BEFORE/AFTER PREVIEW SECTION ==================== */}
      <section id="preview-section" className="px-4 sm:px-6 md:px-16 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-20 items-center">
            {/* Left: text content */}
            <div className="space-y-4 sm:space-y-6 w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 text-green-700 rounded-full font-medium text-xs sm:text-sm">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Eraser size={12} className="sm:size-4" />
                </div>
                AI Background Removal
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                Remove <span className="text-green-600">Background</span> in Seconds
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                Backgrounds are removed automatically while keeping your subject sharp.
              </p>

              {/* Feature checklist */}
              <div className="space-y-2 sm:space-y-4">
                {[
                  'Automatic - no manual editing',
                  'Runs in your browser',
                  'Transparent PNG export',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={12} className="sm:size-3 text-white" />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: interactive before/after slider */}
            <div className="relative w-full lg:w-1/2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-2 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-4 px-1 sm:px-4 pt-0 sm:pt-2">
                  <h3 className="text-sm sm:text-lg font-bold flex items-center gap-1.5 sm:gap-2">
                    <SlidersHorizontal size={12} className="sm:size-[18px] text-green-500" />
                    <span className="hidden sm:inline">Interactive Preview</span>
                    <span className="sm:hidden">Preview</span>
                  </h3>
                  <div className="text-[9px] sm:text-xs font-semibold bg-gray-100 px-1.5 sm:px-3 py-0.5 rounded-full text-gray-500">
                    DRAG
                  </div>
                </div>

                <div className="relative h-[180px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-lg sm:rounded-xl overflow-hidden cursor-ew-resize">
                  <ImageComparisonSlider
                    beforeImage={demoBeforeImage}
                    afterImage={demoAfterImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MORE TOOLS SECTION ==================== */}
      <section id="more-tools-section" className="px-4 sm:px-6 md:px-16 py-8 sm:py-16 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4 uppercase">
            Discover More <span className="text-blue-600">Tools</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-12 max-w-2xl mx-auto px-4">
            More tools for your image editing needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 text-left px-2 sm:px-0">
            <OriginalToolCard
              href="/resize"
              icon={<Maximize size={18} className="sm:size-6" />}
              title="Smart Resize"
              desc="Resize images for any platform."
              color="bg-blue-600"
            />
            <OriginalToolCard
              href="/compress"
              icon={<Minimize2 size={18} className="sm:size-6" />}
              title="Smart Compress"
              desc="Reduce image size without losing quality."
              color="bg-green-600"
            />
            <OriginalToolCard
              href="/convert"
              icon={<Layers size={18} className="sm:size-6" />}
              title="Format Engine"
              desc="Image & Doc to PDF conversion."
              color="bg-orange-600"
            />
            <OriginalToolCard
              href="/privacy"
              icon={<ShieldCheck size={18} className="sm:size-6" />}
              title="Privacy Guard"
              desc="Scrub hidden EXIF metadata."
              color="bg-black"
            />
          </div>
        </div>
      </section>

      {/* ==================== WHY USE THIS TOOL ==================== */}
      <section className="px-4 sm:px-6 md:px-16 py-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">Why Use This Tool</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">Simple and fast</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {/* Fast */}
            <div className="bg-white p-3 sm:p-6 md:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6">
                <Zap size={14} className="sm:size-5" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">Fast</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Processes images in your browser, usually within a few seconds after the model loads.
              </p>
            </div>

            {/* Privacy Friendly */}
            <div className="bg-white p-3 sm:p-6 md:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6">
                <Lock size={14} className="sm:size-5" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">Privacy Friendly</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Your images are processed locally and never uploaded to a server.
              </p>
            </div>

            {/* No Limits */}
            <div className="bg-white p-3 sm:p-6 md:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6">
                <Info size={14} className="sm:size-5" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">No Limits</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Free tier with unlimited processing. No watermarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="px-4 sm:px-6 md:px-16 py-6 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-gray-600">Common questions about this tool</p>
          </div>

          <div className="space-y-2 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-3 sm:px-6 py-2.5 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  <span className="font-medium text-sm sm:text-base lg:text-lg pr-4">{faq.question}</span>
                  <ChevronRight
                    size={14}
                    className={`transition-transform flex-shrink-0 ${faqOpen === index ? 'rotate-90' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {faqOpen === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 sm:px-6 py-2.5 sm:py-4 border-t border-gray-100 text-gray-600 text-xs sm:text-sm md:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="px-4 sm:px-6 md:px-16 py-6 sm:py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 text-center shadow-lg sm:shadow-xl lg:shadow-2xl border border-blue-500">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-6 text-white">
            More Coming Soon
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            Additional image editing tools are on the way
          </p>
          <button
            className="inline-flex items-center gap-2 sm:gap-3 bg-white text-blue-700 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg text-xs sm:text-sm md:text-base"
            disabled
          >
            {/* Sparkles used here as a decorative icon, NOT the brand logo */}
            <Sparkles size={14} className="sm:size-5 text-blue-600" />
            Coming Soon
          </button>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline">
                  {/* Real brand logo from /public/logo.png */}
                  <NextImage
                    src="/logo.png"
                    alt="Enhance Me Logo"
                    width={40}
                    height={40}
                    className="rounded-xl object-contain"
                    loading="lazy"
                  />
                  <span className="text-xl sm:text-2xl font-bold text-white">Enhance Me</span>
                </Link>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Simple image editing tools
              </p>
            </div>

            {/* Company links */}
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

            {/* Popular tools */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <button
                  onClick={scrollToUpload}
                  className="text-gray-400 hover:text-white transition-colors text-left no-underline text-xs sm:text-sm"
                >
                  Remove Background
                </button>
                <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Resize</Link>
                <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Format Engine</Link>
              </div>
            </div>

            {/* More tools */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">More Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Compress</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Privacy Guard</Link>
              </div>
            </div>
          </div>

          {/* Footer bottom bar */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              All rights reserved. Enhance Me © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================================
// IMAGE COMPARISON SLIDER
// ==========================================================
/**
 * Draggable before/after comparison slider.
 * Supports mouse, touch, and tracks movements globally so the drag
 * continues smoothly even when the cursor leaves the container.
 */
function ImageComparisonSlider({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50); // 0–100%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  /** Begin dragging at the given client X coordinate */
  const handleStart = (clientX) => {
    setIsDragging(true);
    updateSliderPosition(clientX);
  };

  /** Update slider while dragging */
  const handleMove = (clientX) => {
    if (!isDragging) return;
    updateSliderPosition(clientX);
  };

  /** End dragging */
  const handleEnd = () => {
    setIsDragging(false);
  };

  /** Translate clientX into a percentage position inside the container */
  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percentage = (x / rect.width) * 100;

    setSliderPosition(percentage);
  };

  // Mouse events
  const onMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();

  // Touch events
  const onTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };
  const onTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX);
  };
  const onTouchEnd = () => handleEnd();

  // Attach global listeners while dragging (so drag works outside container)
  useEffect(() => {
    const handleGlobalMouseMove = (e) => onMouseMove(e);
    const handleGlobalMouseUp = () => onMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-checkerboard"
    >
      {/* After image (base layer) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={afterImage}
          className="absolute inset-0 w-full h-full object-cover"
          alt="After - Background removed"
        />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 md:top-4 md:right-4 bg-blue-600/80 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded text-xs font-bold">
          AFTER
        </div>
      </div>

      {/* Before image (clipped by sliderPosition) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: '100%', minWidth: '100%' }}
          alt="Before - Original image"
        />
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 md:top-4 md:left-4 bg-black/70 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded text-xs font-bold">
          BEFORE
        </div>
      </div>

      {/* Vertical divider + handle */}
      <div
        ref={sliderRef}
        className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(0,0,0,0.8)] z-30"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg sm:shadow-xl md:shadow-2xl text-gray-700 border-2 border-gray-300 hover:scale-110 transition-transform">
          <div className="flex items-center">
            <div className="w-0.5 h-1.5 sm:h-2 md:h-3 bg-gray-400 mx-0.5 rounded-sm"></div>
            <div className="w-0.5 h-2 sm:h-3 md:h-5 bg-gray-400 mx-0.5 rounded-sm"></div>
            <div className="w-0.5 h-1.5 sm:h-2 md:h-3 bg-gray-400 mx-0.5 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Position indicator */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 md:px-5 md:py-2 rounded-full pointer-events-none flex items-center gap-1.5 sm:gap-2 md:gap-3">
        <span className="text-gray-300 text-xs">Before</span>
        <span className="font-bold text-xs sm:text-sm">{Math.round(sliderPosition)}%</span>
        <span className="text-gray-300 text-xs">After</span>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 text-white text-[9px] sm:text-xs bg-black/50 px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-1 rounded-full">
        ← Drag slider →
      </div>
    </div>
  );
}

// ==========================================================
// TOOL CARD COMPONENT
// ==========================================================
/**
 * Reusable card for a tool / module link.
 * If `href` is provided, the card is wrapped in a Next.js Link.
 */
function OriginalToolCard({ href, icon, title, desc, color }) {
  const card = (
    <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[40px] border border-gray-200 hover:shadow-lg sm:hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 ${color} rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1.5 sm:mb-2 md:mb-3 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3 sm:mb-4 md:mb-6 flex-1">
        {desc}
      </p>
      <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest">
        Try Module
        <ArrowRight
          size={10}
          className="sm:size-3 md:size-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform"
        />
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="no-underline">
      {card}
    </Link>
  ) : (
    card
  );
}

// ==========================================================
// GLOBAL STYLES (injected once)
// ==========================================================
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* Checkerboard pattern for transparent image preview */
    .bg-checkerboard {
      background-image:
        linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
        linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
        linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      background-color: #ffffff;
    }

    /* Hide scrollbar while keeping scroll functionality */
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `;
  document.head.appendChild(styleSheet);
}