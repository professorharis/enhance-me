"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Eraser, Maximize, Layers, Zap, Upload, 
  Download, Sparkles, X, User,
  LayoutGrid, SlidersHorizontal, RotateCcw, Eye, EyeOff, FileMinus,
  Menu, ChevronRight, CheckCircle2, ArrowRight, Lock, Info, ShieldCheck, Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { removeBackground } from '@imgly/background-removal';

export default function ProfessionalImageStudio() {
  const router = useRouter();
  
  // STATES
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [processingProgress, setProcessingProgress] = useState('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);
  const [fromTermsPrivacy, setFromTermsPrivacy] = useState(false);

  // Check sessionStorage when component mounts
  useEffect(() => {
    const checkSessionStorage = () => {
      try {
        const sessionState = sessionStorage.getItem('imageStudioState');
        if (sessionState) {
          const state = JSON.parse(sessionState);
          const timeDiff = Date.now() - state.timestamp;
          
          // Restore state if less than 5 minutes old
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
            }, 3000);
          } else {
            sessionStorage.removeItem('imageStudioState');
          }
        }
      } catch (error) {
        console.error('Error checking sessionStorage:', error);
      }
    };

    checkSessionStorage();
  }, []);

  // localStorage Logic
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

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('uploadedImage');
      localStorage.removeItem('processedImage');
      localStorage.removeItem('imageName');
      localStorage.removeItem('imageSize');
      localStorage.removeItem('aspectRatio');
      localStorage.removeItem('editImageData');
      localStorage.removeItem('editImageMask');
      localStorage.removeItem('editOriginalImageData');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const calculateAspectRatio = (width, height) => {
    const ratio = width / height;
    if (Math.abs(ratio - 16/9) < 0.1) setAspectRatio('16:9');
    else if (Math.abs(ratio - 4/3) < 0.1) setAspectRatio('4:3');
    else if (Math.abs(ratio - 1) < 0.1) setAspectRatio('1:1');
    else if (ratio > 1) setAspectRatio('Landscape');
    else setAspectRatio('Portrait');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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
    }
  };

  const runRealProcess = async () => {
    if (!imageFile) return;
    setProcessing(true);
    setProcessingProgress('Starting background removal...');
    
    try {
      setProcessingProgress('Analyzing image...');
      const blob = await removeBackground(imageFile, {
        model: 'medium',
        output: { format: 'image/png', quality: 0.95 }
      });
      
      setProcessingProgress('Processing result...');
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setProcessedImage(result);
        setProcessing(false);
        setProcessingProgress('');
        saveToLocalStorage();
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      setProcessingProgress('Error occurred, using fallback...');
      setTimeout(() => {
        setProcessedImage(uploadedImage);
        setProcessing(false);
        setProcessingProgress('');
        saveToLocalStorage();
      }, 1500);
    }
  };

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

  const scrollToTools = () => {
    document.getElementById('more-tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEyeToggle = () => {
    setShowOriginal(!showOriginal);
  };

  const handleEditImage = () => {
    if (!uploadedImage) return;
    
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
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
        
        // Save Original Image (with background)
        localStorage.setItem('editOriginalImageData', compressedOriginal);
        
        // Save AI Processed Image (transparent background)
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

  const handleSignIn = () => {
    router.push('/signin');
  };

  // Save state before navigating to terms/privacy
  const handleTermsPrivacyClick = (page) => {
    // Save current state to sessionStorage
    const stateToSave = {
      uploadedImage,
      processedImage,
      imageName,
      imageSize,
      aspectRatio,
      timestamp: Date.now()
    };
    
    try {
      sessionStorage.setItem('imageStudioState', JSON.stringify(stateToSave));
      
      // Navigate to the page
      if (page === 'terms') {
        router.push('/terms');
      } else {
        router.push('/privacy-policy');
      }
    } catch (error) {
      console.error('Error saving state:', error);
      // Fallback navigation
      if (page === 'terms') {
        router.push('/terms');
      } else {
        router.push('/privacy-policy');
      }
    }
  };

  const faqs = [
    {
      question: "Is this tool free to use?",
      answer: "Yes, our basic background removal and editing tools are free to use for standard quality images."
    },
    {
      question: "Do you store my images?",
      answer: "No, we value your privacy. Images are processed in your browser or temporarily on secure servers and deleted automatically."
    },
    {
      question: "What image formats are supported?",
      answer: "We support JPG, PNG, and WebP formats up to 10MB in size."
    },
    {
      question: "Can I edit the background after removing it?",
      answer: "Yes! Click 'Edit in Studio' after processing to access advanced editing tools."
    }
  ];

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={22} />
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight no-underline">Enhance Me</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
          <Link href="/about" className="hover:text-blue-600 transition-colors no-underline">About</Link>
          <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors no-underline">Privacy</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors no-underline">Contact</Link>
          <Link href="/faq" className="hover:text-blue-600 transition-colors no-underline">FAQ</Link>
          
          <button onClick={handleSignIn} className="flex items-center gap-2 hover:text-blue-600 transition-colors no-underline">
            <User size={18} /> Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Standard Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="px-6 py-4 space-y-4">
              <Link href="/about" className="block text-gray-600 hover:text-blue-600 font-medium no-underline py-2 border-b border-gray-100">About</Link>
              <Link href="/privacy-policy" className="block text-gray-600 hover:text-blue-600 font-medium no-underline py-2 border-b border-gray-100">Privacy</Link>
              <Link href="/contact" className="block text-gray-600 hover:text-blue-600 font-medium no-underline py-2 border-b border-gray-100">Contact</Link>
              <Link href="/faq" className="block text-gray-600 hover:text-blue-600 font-medium no-underline py-2 border-b border-gray-100">FAQ</Link>
              <button onClick={handleSignIn} className="w-full flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium py-2 text-left">
                <User size={18} /> Sign In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="upload-section" className="pt-16 pb-8 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Professional <span className="text-blue-600">Image Studio</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple and Fast - Professional AI-powered image tool
            </p>
          </div>

          {/* UPLOAD SECTION */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <button className="px-6 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center gap-2">
                <Eraser size={18} /> Remove Background
              </button>
              <button onClick={scrollToTools} className="px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                <LayoutGrid size={18} /> More Tools
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-12">
              <AnimatePresence mode="wait">
                {!uploadedImage ? (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                      <Upload size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Upload Your Image</h3>
                    <p className="text-gray-500 mb-6">Drag & drop or click to browse</p>
                    <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                      <Upload size={18} /> Choose File
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </motion.div>
                ) : !processedImage ? (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                          <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium truncate max-w-[200px]">{imageName}</div>
                          <div className="text-sm text-gray-500">Ready to process</div>
                          {imageSize.width > 0 && <div className="text-xs text-gray-400">{imageSize.width}×{imageSize.height}px • {aspectRatio}</div>}
                        </div>
                      </div>
                      <button onClick={removeUploadedImage} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} className="text-gray-500" />
                      </button>
                    </div>
                    {processingProgress && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                          <span className="text-sm font-medium">{processingProgress}</span>
                        </div>
                      </div>
                    )}
                    <button onClick={runRealProcess} disabled={processing} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                      {processing ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>) : (<><Zap size={20} /> Remove Background Now</>)}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result" 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    className="space-y-6"
                  >
                    {fromTermsPrivacy && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <p className="text-green-700 text-sm font-medium flex items-center">
                          <CheckCircle2 size={16} className="mr-2" />
                          ✓ Image restored from previous session
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Background Removed!</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {imageSize.width > 0 && <span className="mr-3">{imageSize.width}×{imageSize.height}px • {aspectRatio}</span>}
                        </p>
                      </div>
                      <button onClick={removeUploadedImage} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-500">
                        <X size={18} />
                      </button>
                    </div>

                    {/* DYNAMIC IMAGE CONTAINER - FIXED FOR ASPECT RATIO */}
                    <div className="relative w-full flex justify-center bg-gray-50 rounded-xl p-4">
                      <div 
                        className="relative rounded-lg overflow-hidden border-2 border-green-200 bg-checkerboard shadow-sm"
                        style={{
                           aspectRatio: imageSize.width && imageSize.height ? `${imageSize.width} / ${imageSize.height}` : 'auto',
                           maxHeight: '60vh',
                           maxWidth: '100%'
                        }}
                      >
                         <img src={showOriginal ? uploadedImage : processedImage} alt="Result" className="w-full h-full object-contain block" />
                          
                          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
                            <button onClick={handleEyeToggle} className={`p-2 rounded-full shadow-lg transition-all flex items-center gap-2 ${showOriginal ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                              {showOriginal ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <div className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${showOriginal ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {showOriginal ? "ORIGINAL" : "TRANSPARENT"}
                            </div>
                          </div>
                      </div>
                    </div>

                    {/* TERMS & PRIVACY LINE - IMAGE KE NEECHE */}
                    <div className="text-center py-3 border-y border-gray-200 my-4">
                      <p className="text-xs text-gray-500">
                        By using our service, you agree to our{' '}
                        <button 
                          onClick={() => handleTermsPrivacyClick('terms')}
                          className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0 text-xs"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button 
                          onClick={() => handleTermsPrivacyClick('privacy')}
                          className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0 text-xs"
                        >
                          Privacy Policy
                        </button>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <button onClick={() => {
                        const link = document.createElement('a');
                        link.href = processedImage;
                        link.download = `transparent-bg-${imageName.split('.')[0] || 'image'}.png`;
                        link.click();
                      }} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-md transition-all flex items-center justify-center gap-2">
                        <Download size={18} /> Download
                      </button>
                      <button onClick={() => setProcessedImage(null)} className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <RotateCcw size={18} /> New Image
                      </button>
                      <button onClick={handleEditImage} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-md transition-all flex items-center justify-center gap-2">
                        <SlidersHorizontal size={18} /> Edit in Studio
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* BACKGROUND REMOVAL PREVIEW SECTION */}
      <section id="preview-section" className="px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Eraser size={16} />
                </div>
                AI Background Removal
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                Remove <span className="text-green-600">Background</span>{' '}
                in Seconds
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our AI instantly removes backgrounds while keeping your subject perfectly sharp.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="font-medium">100% automatic - No manual editing</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="font-medium">Perfect edge detection</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="font-medium">Transparent PNG export</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2">
                <div className="flex items-center justify-between mb-4 px-4 pt-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-green-500"/>
                    Interactive Preview
                  </h3>
                  <div className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                    DRAG SLIDER
                  </div>
                </div>
                
                <div className="relative h-[350px] rounded-xl overflow-hidden cursor-ew-resize">
                  <ImageComparisonSlider
                    beforeImage="https://i.ibb.co/PZwPNGgz/medium-shot-woman-with-glasses-outdoors.jpg"
                    afterImage="https://i.ibb.co/4nYJRQFY/medium-shot-woman-with-glasses-outdoors-removebg-preview.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section id="more-tools-section" className="px-6 md:px-16 py-16 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4 uppercase">
            Discover More <span className="text-blue-600">Tools</span>
          </h2>
          
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
            Professional-grade tools for all your image editing needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <OriginalToolCard 
              href="/resize" 
              icon={<Maximize size={24}/>} 
              title="Smart Resize" 
              desc="Neural scaling for all platforms." 
              color="bg-blue-600" 
            />
            <OriginalToolCard 
              href="/compress" 
              icon={<Minimize2 size={24}/>} 
              title="Smart Compress" 
              desc="Reduce image size without losing quality." 
              color="bg-green-600"
            />
            <OriginalToolCard 
              href="/convert" 
              icon={<Layers size={24}/>} 
              title="Format Engine" 
              desc="Image & Doc to PDF conversion." 
              color="bg-orange-600" 
            />
            <OriginalToolCard 
              href="/privacy" 
              icon={<ShieldCheck size={24}/>} 
              title="Privacy Guard" 
              desc="Scrub hidden EXIF metadata." 
              color="bg-black" 
            />
          </div>
        </div>
      </section>

      {/* Why Choose Our Tool Section */}
      <section className="px-6 md:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Why Choose Our Tool</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple, fast, and professional</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-gray-600">Process images in seconds with optimized AI algorithms.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Privacy First</h3>
              <p className="text-gray-600">Your images are processed locally and never stored.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-6">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">No Limits</h3>
              <p className="text-gray-600">Free tier with unlimited processing. No watermarks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-6 md:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-600">Get answers to common questions about our tool</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <ChevronRight 
                    size={20} 
                    className={`transition-transform ${faqOpen === index ? 'rotate-90' : ''}`}
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
                      <div className="px-6 py-4 border-t border-gray-100 text-gray-600">
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

      {/*  CTA SECTION */}
      <section className="px-6 md:px-16 py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center shadow-2xl border border-blue-500">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Professional Image Processing
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience industry-leading background removal technology
          </p>
          <button 
            className="inline-flex items-center gap-3 bg-white text-blue-700 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
            disabled
          >
            <Sparkles size={22} className="text-blue-600" />
            Professional Edition Available
          </button>
          <p className="text-sm text-blue-200 mt-6">
            Advanced features for enterprise workflows
          </p>
        </div>
      </section>

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

            {/* Popular Tools */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={scrollToUpload}
                  className="text-gray-400 hover:text-white transition-colors text-left no-underline"
                >
                  Remove Background
                </button>
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

function ImageComparisonSlider({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  const handleStart = (clientX) => {
    setIsDragging(true);
    updateSliderPosition(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    updateSliderPosition(clientX);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(percentage);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const onMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };

  const onTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      onMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      onMouseUp();
    };

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
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={afterImage} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="After"
        />
        <div className="absolute top-4 right-4 bg-blue-600/80 text-white px-3 py-1 rounded-md text-xs font-bold">
          AFTER
        </div>
      </div>

      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            width: '100%',
            minWidth: '100%'
          }}
          alt="Before"
        />
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-xs font-bold">
          BEFORE
        </div>
      </div>

      <div 
        ref={sliderRef}
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(0,0,0,0.8)] z-30"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl text-gray-700 border-2 border-gray-300 hover:scale-110 transition-transform">
          <div className="flex items-center">
            <div className="w-1 h-3 bg-gray-400 mx-0.5 rounded-sm"></div>
            <div className="w-1 h-5 bg-gray-400 mx-0.5 rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-400 mx-0.5 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-5 py-2 rounded-full pointer-events-none flex items-center gap-3">
        <span className="text-gray-300">Before</span>
        <span className="font-bold">{Math.round(sliderPosition)}%</span>
        <span className="text-gray-300">After</span>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 px-4 py-1 rounded-full">
        ← Drag slider to compare →
      </div>
    </div>
  );
}

function OriginalToolCard({ href, icon, title, desc, color }) {
  const card = (
    <div className="bg-white p-8 rounded-[40px] border border-gray-200 hover:shadow-2xl transition-all group flex flex-col h-full cursor-pointer">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest">
        Try Module 
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
  
  return href ? (
    <Link href={href} className="no-underline">
      {card}
    </Link>
  ) : card;
}

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
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
  `;
  document.head.appendChild(styleSheet);
}   