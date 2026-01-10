"use client";
import React, { useState, useEffect } from 'react';
import { 
  Layers, Download, Upload, X, Zap, Image as ImageIcon,
  FileImage, Minimize2, Gauge, CheckCircle2, ArrowRight,
  ShieldCheck, Lock, File, Info, Sparkles, User,
  FileText, MinusCircle, Compass, ChevronsLeftRight,
  Sparkles as SparklesIcon, Eraser, Maximize, Crop, FileMinus
} from 'lucide-react';
import Link from 'next/link';

// For compression, we'll use a simpler approach since browser-image-compression has issues
const compressImageInBrowser = async (file, options) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > options.maxWidth || height > options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / width,
            options.maxHeight / height
          );
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          options.format === 'png' ? 'image/png' : 'image/jpeg',
          options.quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ImageCompressor() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg'
  });
  const [comparisonVisible, setComparisonVisible] = useState(false);
  const [comparisonSlider, setComparisonSlider] = useState(50);
  const [activeTab, setActiveTab] = useState('balanced');

  const compressionPresets = {
    high: { quality: 0.3, maxWidth: 800, maxHeight: 800, label: 'High Compression', description: 'Smallest file size, lower quality' },
    balanced: { quality: 0.7, maxWidth: 1200, maxHeight: 1200, label: 'Balanced', description: 'Good quality, good compression' },
    low: { quality: 0.9, maxWidth: 1920, maxHeight: 1080, label: 'Low Compression', description: 'Best quality, minimal compression' },
    custom: { quality: 0.8, maxWidth: 1920, maxHeight: 1080, label: 'Custom', description: 'Manual settings' }
  };

  const formatOptions = [
    { value: 'jpeg', label: 'JPEG', description: 'Best for photos, smaller file size' },
    { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
  ];

  const originalTools = [
    { name: "Remove Background", icon: <Eraser size={16} />, link: "/remove-bg", color: "from-green-500 to-emerald-600" },
    { name: "Smart Resize", icon: <Maximize size={16} />, link: "/resize", color: "from-blue-500 to-cyan-600" },
    { name: "Smart Compress", icon: <FileMinus size={16} />, link: "/compress", color: "from-orange-500 to-red-600" },
    { name: "Format Engine", icon: <Layers size={16} />, link: "/convert", color: "from-yellow-500 to-amber-600" },
    { name: "Privacy Guard", icon: <ShieldCheck size={16} />, link: "/privacy", color: "from-gray-700 to-gray-900" },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setFileName(file.name);
      setUploadedFile(file);
      setOriginalSize(file.size);
      setCompressedFile(null);
      setCompressedImageUrl('');
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      
      // Reset settings for new image
      setCompressionSettings({
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
        format: file.type.includes('png') ? 'png' : 'jpeg'
      });
      setActiveTab('balanced');
    }
  };

  const compressImage = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    
    try {
      const options = {
        quality: compressionSettings.quality,
        maxWidth: compressionSettings.maxWidth,
        maxHeight: compressionSettings.maxHeight,
        format: compressionSettings.format
      };

      const compressedBlob = await compressImageInBrowser(uploadedFile, options);
      
      // Calculate compression stats
      const compressedSize = compressedBlob.size;
      const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      setCompressedSize(compressedSize);
      setCompressionRatio(parseFloat(ratio));
      setCompressedFile(compressedBlob);
      
      // Create object URL for compressed image preview
      const url = URL.createObjectURL(compressedBlob);
      setCompressedImageUrl(url);
      
      // Show comparison
      setComparisonVisible(true);
      
    } catch (error) {
      console.error('Compression error:', error);
      alert('Failed to compress image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePresetSelect = (preset) => {
    setActiveTab(preset);
    const presetConfig = compressionPresets[preset];
    setCompressionSettings(prev => ({
      ...prev,
      quality: presetConfig.quality,
      maxWidth: presetConfig.maxWidth,
      maxHeight: presetConfig.maxHeight
    }));
  };

  const handleQualityChange = (value) => {
    const quality = parseFloat(value);
    setCompressionSettings(prev => ({ ...prev, quality }));
    
    // Update preset to custom if manually adjusting
    if (activeTab !== 'custom') {
      setActiveTab('custom');
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = parseInt(value) || 0;
    setCompressionSettings(prev => ({ 
      ...prev, 
      [dimension]: numValue 
    }));
    
    if (activeTab !== 'custom') {
      setActiveTab('custom');
    }
  };

  const handleFormatChange = (format) => {
    setCompressionSettings(prev => ({ ...prev, format }));
  };

  const removeUploadedFile = () => {
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (compressedImageUrl) URL.revokeObjectURL(compressedImageUrl);
    
    setUploadedFile(null);
    setFileName('');
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressionRatio(0);
    setCompressedFile(null);
    setCompressedImageUrl('');
    setOriginalImageUrl('');
    setComparisonVisible(false);
  };

  const downloadCompressedFile = () => {
    if (!compressedFile) return;
    
    const link = document.createElement('a');
    link.href = compressedImageUrl;
    const extension = compressionSettings.format;
    link.download = `compressed_${fileName.split('.')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEstimatedSavings = () => {
    if (!originalSize) return '0 Bytes';
    const savings = originalSize * (1 - compressionSettings.quality);
    return formatFileSize(savings);
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (compressedImageUrl) URL.revokeObjectURL(compressedImageUrl);
    };
  }, [originalImageUrl, compressedImageUrl]);

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
          
          {/* LEFT SIDE - COMPRESSION INTERFACE */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Minimize2 size={16} />
                </div>
                AI Image Compression
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Compress Images <br />
                <span className="text-green-600">Without Losing Quality</span>
              </h1>
              <p className="text-gray-600">
                Reduce image file sizes by up to 90% while maintaining visual quality. Perfect for web, email, and storage optimization.
              </p>
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {!uploadedFile ? (
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Upload Image</h3>
                  <p className="text-gray-500 mb-6">
                    Supports JPG, PNG, WebP, GIF, BMP
                    <br />
                    Max file size: 10MB
                  </p>
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
              ) : !compressedFile ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <img src={originalImageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium truncate max-w-[200px]">{fileName}</div>
                        <div className="text-sm text-gray-500">
                          Original: {formatFileSize(originalSize)}
                        </div>
                      </div>
                    </div>
                    <button onClick={removeUploadedFile} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* COMPRESSION PRESETS */}
                  <div className="space-y-4">
                    <label className="font-medium">Compression Preset</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(compressionPresets).map(([key, preset]) => (
                        <button
                          key={key}
                          onClick={() => handlePresetSelect(key)}
                          className={`p-3 rounded-lg border transition-all ${
                            activeTab === key
                              ? 'border-green-500 bg-green-50 text-green-600'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">{preset.label}</div>
                          <div className="text-xs text-gray-500">{preset.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* COMPRESSION SETTINGS */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-medium">Quality: {Math.round(compressionSettings.quality * 100)}%</label>
                        <span className="text-sm text-gray-500">
                          Estimated savings: {getEstimatedSavings()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={compressionSettings.quality}
                        onChange={(e) => handleQualityChange(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Smaller File</span>
                        <span>Better Quality</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Width (px)</label>
                        <input
                          type="number"
                          value={compressionSettings.maxWidth}
                          onChange={(e) => handleDimensionChange('maxWidth', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="100"
                          max="3840"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Height (px)</label>
                        <input
                          type="number"
                          value={compressionSettings.maxHeight}
                          onChange={(e) => handleDimensionChange('maxHeight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="100"
                          max="2160"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3">Output Format</label>
                      <div className="flex flex-wrap gap-2">
                        {formatOptions.map((format) => (
                          <button
                            key={format.value}
                            onClick={() => handleFormatChange(format.value)}
                            className={`px-4 py-2 rounded-lg border transition-all ${
                              compressionSettings.format === format.value
                                ? 'border-green-500 bg-green-50 text-green-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-gray-500">{format.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={compressImage}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Minimize2 size={20} />
                        Compress Image
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-green-600">
                      ✓ Compression Complete
                    </h3>
                    <button onClick={removeUploadedFile} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* COMPRESSION RESULTS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-500 mb-1">Original Size</div>
                      <div className="text-2xl font-bold">{formatFileSize(originalSize)}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-sm text-green-600 mb-1">Compressed Size</div>
                      <div className="text-2xl font-bold text-green-700">{formatFileSize(compressedSize)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-blue-700">Reduced by {compressionRatio}%</div>
                        <div className="text-sm text-blue-600">File size optimized successfully</div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Sparkles size={24} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={downloadCompressedFile}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-3"
                    >
                      <Download size={20} />
                      Download Compressed
                    </button>
                    
                    <button 
                      onClick={removeUploadedFile}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                    >
                      <Upload size={20} />
                      Compress Another
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-3">
                  <Gauge size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">Smart Compression</h4>
                <p className="text-xs text-gray-600">AI-powered optimization</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-3">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">Privacy First</h4>
                <p className="text-xs text-gray-600">No uploads to servers</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-3">
                  <FileImage size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">All Formats</h4>
                <p className="text-xs text-gray-600">JPG, PNG, WebP, GIF</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW & INFO */}
          <div className="space-y-8">
            {/* IMAGE COMPARISON */}
            {comparisonVisible && originalImageUrl && compressedImageUrl && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-6">Visual Comparison</h3>
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex">
                    <div 
                      className="h-full bg-cover bg-center"
                      style={{ 
                        width: `${comparisonSlider}%`,
                        backgroundImage: `url(${originalImageUrl})`
                      }}
                    />
                    <div 
                      className="h-full bg-cover bg-center"
                      style={{ 
                        width: `${100 - comparisonSlider}%`,
                        backgroundImage: `url(${compressedImageUrl})`
                      }}
                    />
                  </div>
                  
                  {/* Slider Control */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize flex items-center justify-center"
                    style={{ left: `${comparisonSlider}%` }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const container = e.currentTarget.parentElement;
                      const rect = container.getBoundingClientRect();
                      
                      const handleMouseMove = (moveEvent) => {
                        const newLeft = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                        const clampedLeft = Math.max(0, Math.min(100, newLeft));
                        setComparisonSlider(clampedLeft);
                      };
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <ChevronsLeftRight size={16} className="text-gray-600" />
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Original ({formatFileSize(originalSize)})
                  </div>
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    Compressed ({formatFileSize(compressedSize)})
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-4">
                  <span>Drag slider to compare</span>
                  <span>{Math.round(compressionRatio)}% smaller</span>
                </div>
              </div>
            )}

            {/* IMAGE PREVIEW */}
            {uploadedFile && !comparisonVisible && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Image Preview</h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={originalImageUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Size:</span>
                    <span className="font-bold">{formatFileSize(originalSize)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* OPTIMIZATION TIPS */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Optimization Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <span className="text-sm">Use 75-85% quality for web images - great quality with good compression</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <span className="text-sm">Resize images to match your website's maximum display dimensions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <span className="text-sm">Use JPEG for photos, PNG for graphics with transparency</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <span className="text-sm">For social media, use 1200x1200px for optimal quality and file size</span>
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