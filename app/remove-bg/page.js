"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Download, ArrowLeft, RotateCcw, RotateCw, 
  ZoomIn, ZoomOut, Image as ImageIcon, 
  Eraser, Brush, Hand, Upload, X, Eye, EyeOff,
  Layers, SlidersHorizontal, Settings, Move, 
  FlipHorizontal, FlipVertical, Maximize,
  Sun, Droplet, Palette, Contrast, 
  Thermometer, Filter, Sparkles, 
  Undo, Redo, Save, ImagePlus, 
  Check, Hash, Minus, Plus,
  RefreshCw, Type, ChevronDown, 
  Grid3x3, Droplets, Cloud, Menu,
  Waves, Sunset, Moon, CheckCircle2,
  Circle, FileImage, File, Smartphone,
  Tablet, Monitor, Smartphone as MobileIcon,
  ChevronLeft, ChevronRight, Zoom,
  ChevronUp, ChevronDown as ChevronDownIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdvancedImageEditor() {
  const router = useRouter();
  
  // -- Core State --
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState('erase');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('brush');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // -- Mobile specific states --
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActivePanel, setMobileActivePanel] = useState(null);
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  
  // -- Brush Settings --
  const [brushSize, setBrushSize] = useState(40);
  const [brushHardness, setBrushHardness] = useState(80);
  const [brushOpacity, setBrushOpacity] = useState(100);
  
  // -- Image Adjustments --
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  
  // -- Background Options --
  const [bgType, setBgType] = useState('transparent');
  const [bgColor, setBgColor] = useState('#10b981');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // -- Transformations --
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
  // -- History --
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageName, setImageName] = useState('');
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0 });
  
  // -- Refs --
  const mainCanvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const originalImageRef = useRef(null);
  const aiProcessedImageRef = useRef(null);
  const containerRef = useRef(null);
  const bgImageRef = useRef(null);
  const isDrawing = useRef(false);
  
  // -- Color Presets --
  const colorPresets = [
    '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#ef4444', '#ffffff', '#000000', '#64748b', '#84cc16'
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- 1. LOAD BOTH IMAGES ---
  useEffect(() => {
    const loadImages = async () => {
      try {
        const processedData = localStorage.getItem('editImageData');
        const originalData = localStorage.getItem('editOriginalImageData');
        const imageName = localStorage.getItem('editImageName') || 'image.png';
        
        setImageName(imageName);
        
        if (!processedData) {
          alert('No image found. Please remove background first.');
          router.push('/');
          return;
        }

        const imgProcessed = new Image();
        imgProcessed.crossOrigin = 'anonymous';
        imgProcessed.src = processedData;

        const imgOriginal = new Image();
        imgOriginal.crossOrigin = 'anonymous';
        imgOriginal.src = originalData || processedData;

        await Promise.all([
          new Promise(resolve => { imgProcessed.onload = resolve; }),
          new Promise(resolve => { imgOriginal.onload = resolve; })
        ]);

        aiProcessedImageRef.current = imgProcessed;
        originalImageRef.current = imgOriginal;
        
        // Store image dimensions
        setImageInfo({
          width: imgProcessed.width,
          height: imgProcessed.height
        });

        const processedCanvas = document.createElement('canvas');
        processedCanvas.width = imgProcessed.width;
        processedCanvas.height = imgProcessed.height;
        const processedCtx = processedCanvas.getContext('2d');
        processedCtx.drawImage(imgProcessed, 0, 0);
        offscreenCanvasRef.current = processedCanvas;

        const initialData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
        setHistory([initialData]);
        setHistoryIndex(0);

        setLoading(false);
        setImageLoaded(true);
        
        // Force mobile zoom immediately after images load
        requestAnimationFrame(() => {
          forceMobileZoom();
        });

      } catch (error) {
        console.error('Error loading images:', error);
        setLoading(false);
        alert('Failed to load images. Please try again.');
      }
    };

    loadImages();
  }, [router]);

  // --- NEW FUNCTION: FORCE MOBILE ZOOM ---
  const forceMobileZoom = () => {
    if (!containerRef.current || !offscreenCanvasRef.current) return;
    
    const canvas = offscreenCanvasRef.current;
    const container = containerRef.current;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    if (containerWidth === 0 || containerHeight === 0) return;
    
    const imageWidth = canvas.width;
    const imageHeight = canvas.height;
    
    let scale;
    if (isMobile) {
      // Screen width ka 90% fit karega
      scale = (containerWidth / imageWidth) * 0.9;
      scale = Math.min(scale, 1.0); 
    } else {
      const scaleX = containerWidth / imageWidth;
      const scaleY = containerHeight / imageHeight;
      scale = Math.min(scaleX, scaleY, 0.8);
    }
    
    setZoom(scale);
    // Pan ko 0 kar dein, CSS flexbox isse center mein rakhega
    setPan({ x: 0, y: 0 });
  };

  // --- 2. FIT IMAGE TO SCREEN (Updated) ---
  const fitImageToScreen = useCallback(() => {
    forceMobileZoom();
  }, [isMobile]);

  // Center image when container resizes
  useEffect(() => {
    if (!containerRef.current || !imageLoaded) return;
    
    const resizeObserver = new ResizeObserver(() => {
      // Small delay to ensure container has settled
      setTimeout(fitImageToScreen, 100);
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [imageLoaded, fitImageToScreen]);

  // --- 3. RENDER CANVAS ---
  const drawCanvas = useCallback(() => {
    const mainCanvas = mainCanvasRef.current;
    const offCanvas = offscreenCanvasRef.current;
    if (!mainCanvas || !offCanvas) return;

    const ctx = mainCanvas.getContext('2d');
    
    const imgWidth = offCanvas.width;
    const imgHeight = offCanvas.height;
    
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    
    let rotatedWidth = imgWidth;
    let rotatedHeight = imgHeight;
    
    if (rotation % 180 !== 0) {
      rotatedWidth = imgHeight * sin + imgWidth * cos;
      rotatedHeight = imgWidth * sin + imgHeight * cos;
    }
    
    mainCanvas.width = rotatedWidth;
    mainCanvas.height = rotatedHeight;

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    if (bgType === 'color') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    } else if (bgType === 'image' && bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, mainCanvas.width, mainCanvas.height);
    } else if (bgType === 'transparent') {
      drawCheckerboard(ctx, mainCanvas.width, mainCanvas.height);
    }

    ctx.filter = `
      brightness(${brightness}%) 
      contrast(${contrast}%) 
      saturate(${saturation}%)
    `;

    ctx.translate(mainCanvas.width / 2, mainCanvas.height / 2);
    
    if (flipHorizontal) ctx.scale(-1, 1);
    if (flipVertical) ctx.scale(1, -1);
    
    ctx.rotate(rad);
    
    // For mobile: showOriginalImage के आधार पर सही इमेज दिखाएं
    if (isMobile && showOriginalImage && originalImageRef.current) {
      ctx.drawImage(originalImageRef.current, -imgWidth / 2, -imgHeight / 2);
    } else {
      ctx.drawImage(offCanvas, -imgWidth / 2, -imgHeight / 2);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none';
  }, [brightness, contrast, saturation, bgType, bgColor, rotation, flipHorizontal, flipVertical, isMobile, showOriginalImage]);

  const drawCheckerboard = (ctx, width, height) => {
    const size = 20;
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const isEvenRow = Math.floor(y / size) % 2 === 0;
        const isEvenCol = Math.floor(x / size) % 2 === 0;
        
        if ((isEvenRow && !isEvenCol) || (!isEvenRow && isEvenCol)) {
          ctx.fillStyle = '#e5e7eb';
        } else {
          ctx.fillStyle = '#ffffff';
        }
        ctx.fillRect(x, y, size, size);
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      drawCanvas();
    }
  }, [loading, drawCanvas]);

  // --- 4. BRUSH ENGINE ---
  const performBrush = (e) => {
    // On mobile, brush doesn't work when showing original image
    if (isMobile && showOriginalImage) return;
    
    if (!mainCanvasRef.current || !offscreenCanvasRef.current || !originalImageRef.current) return;

    const canvas = mainCanvasRef.current;
    const offCanvas = offscreenCanvasRef.current;
    const originalCanvas = originalImageRef.current;

    const rect = canvas.getBoundingClientRect();
    
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const rad = -(rotation * Math.PI) / 180;
    
    let x = mouseX - canvasCenterX;
    let y = mouseY - canvasCenterY;
    
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotatedX = x * cos - y * sin;
    const rotatedY = x * sin + y * cos;
    
    const finalX = flipHorizontal ? -rotatedX : rotatedX;
    const finalY = flipVertical ? -rotatedY : rotatedY;
    
    x = finalX + offCanvas.width / 2;
    y = finalY + offCanvas.height / 2;
    
    if (x < 0 || x > offCanvas.width || y < 0 || y > offCanvas.height) return;

    const offCtx = offCanvas.getContext('2d');
    offCtx.save();

    offCtx.globalAlpha = brushOpacity / 100;
    offCtx.lineCap = 'round';
    offCtx.lineJoin = 'round';

    if (tool === 'erase') {
      offCtx.globalCompositeOperation = 'destination-out';
      offCtx.beginPath();
      offCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      offCtx.fill();
      
    } else if (tool === 'restore') {
      offCtx.globalCompositeOperation = 'source-over';
      offCtx.beginPath();
      offCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      offCtx.clip();
      offCtx.drawImage(originalCanvas, 0, 0, offCanvas.width, offCanvas.height);
    }

    offCtx.restore();
    drawCanvas();
  };

  // --- 5. UNDO/REDO SYSTEM ---
  const saveToHistory = () => {
    if (!offscreenCanvasRef.current) return;
    
    const offCtx = offscreenCanvasRef.current.getContext('2d');
    const imageData = offCtx.getImageData(
      0, 
      0, 
      offscreenCanvasRef.current.width, 
      offscreenCanvasRef.current.height
    );
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    if (newHistory.length > 20) newHistory.shift();
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const offCtx = offscreenCanvasRef.current.getContext('2d');
      offCtx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
      drawCanvas();
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const offCtx = offscreenCanvasRef.current.getContext('2d');
      offCtx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
      drawCanvas();
    }
  };

  // --- 6. RESET FUNCTIONS ---
  const resetToAIProcessed = () => {
    if (!offscreenCanvasRef.current || !aiProcessedImageRef.current) return;
    
    const offCtx = offscreenCanvasRef.current.getContext('2d');
    offCtx.clearRect(0, 0, offscreenCanvasRef.current.width, offscreenCanvasRef.current.height);
    offCtx.drawImage(aiProcessedImageRef.current, 0, 0);
    
    saveToHistory();
    drawCanvas();
  };

  const resetToOriginal = () => {
    if (!offscreenCanvasRef.current || !originalImageRef.current) return;
    
    const offCtx = offscreenCanvasRef.current.getContext('2d');
    offCtx.clearRect(0, 0, offscreenCanvasRef.current.width, offscreenCanvasRef.current.height);
    offCtx.drawImage(originalImageRef.current, 0, 0);
    
    saveToHistory();
    drawCanvas();
  };

  // --- 7. ROTATE FUNCTIONS ---
  const handleRotateLeft = () => {
    setRotation(r => (r - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(r => (r + 90) % 360);
  };

  // --- 8. FLIP FUNCTIONS ---
  const handleFlipHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const handleFlipVertical = () => {
    setFlipVertical(!flipVertical);
  };

  // --- 9. RESET TRANSFORMATIONS ---
  const resetTransformations = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    drawCanvas();
  };

  // --- 10. DOWNLOAD FUNCTIONS ---
  const handleDownload = (format) => {
    if (!mainCanvasRef.current) return;
    
    const link = document.createElement('a');
    const fileName = imageName.replace(/\.[^/.]+$/, "") || 'edited-image';
    
    let mimeType, extension;
    switch(format) {
      case 'jpg':
        mimeType = 'image/jpeg';
        extension = 'jpg';
        break;
      case 'webp':
        mimeType = 'image/webp';
        extension = 'webp';
        break;
      case 'png':
      default:
        mimeType = 'image/png';
        extension = 'png';
    }
    
    link.download = `${fileName}.${extension}`;
    link.href = mainCanvasRef.current.toDataURL(mimeType, 1.0);
    link.click();
  };

  // --- 11. MOUSE HANDLERS ---
  const handleMouseDown = (e) => {
    // On mobile, brush doesn't work when showing original image
    if (isMobile && showOriginalImage && tool !== 'move') return;
    
    if (tool === 'move') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else {
      isDrawing.current = true;
      performBrush(e);
    }
  };

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    if (isDrawing.current) performBrush(e);
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing.current) {
      saveToHistory();
      isDrawing.current = false;
    }
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (mobileActivePanel) return;
    
    const touch = e.touches[0];
    handleMouseDown(touch);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (mobileActivePanel) return;
    
    const touch = e.touches[0];
    handleMouseMove(touch);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  // --- 12. BACKGROUND IMAGE UPLOAD ---
  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        bgImageRef.current = img;
        setBgType('image');
        drawCanvas();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- 13. ZOOM CONTROLS ---
  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(z - 0.1, 0.1));
  };

  const handleZoomReset = () => {
    if (isMobile) {
      forceMobileZoom(); // Use forced zoom for mobile
    } else {
      fitImageToScreen();
    }
  };

  // Mobile Panel Handlers
  const openMobilePanel = (panel) => {
    setMobileActivePanel(panel);
  };

  const closeMobilePanel = () => {
    setMobileActivePanel(null);
  };

  // Main Tools for Mobile - Horizontal toolbar
  const mobileMainTools = [
    { id: 'erase', icon: <Eraser size={18} />, label: 'Erase', color: 'red' },
    { id: 'restore', icon: <Brush size={18} />, label: 'Restore', color: 'green' },
    { id: 'undo', icon: <Undo size={18} />, label: 'Undo', color: 'gray', action: handleUndo },
    { id: 'redo', icon: <Redo size={18} />, label: 'Redo', color: 'gray', action: handleRedo },
    { id: 'move', icon: <Hand size={18} />, label: 'Move', color: 'blue' },
    { id: 'brush', icon: <Brush size={18} />, label: 'Brush', color: 'purple', panel: 'brush' },
    { id: 'adjust', icon: <SlidersHorizontal size={18} />, label: 'Adjust', color: 'orange', panel: 'adjust' },
    { id: 'transform', icon: <Settings size={18} />, label: 'Transform', color: 'indigo', panel: 'transform' },
    { id: 'background', icon: <Layers size={18} />, label: 'BG', color: 'teal', panel: 'background' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans overflow-hidden">
      
      {/* HEADER - Desktop Only */}
      {!isMobile && (
        <nav className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')}
              className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight">BG Removal Studio</h1>
              <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">{imageName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              title="Redo"
            >
              <Redo size={18} />
            </button>
            
            <div className="relative">
              <button
                onClick={() => handleDownload('png')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all"
              >
                <Download size={18} /> Download
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* MOBILE HEADER - Eye toggle */}
      {isMobile && (
        <nav className="h-12 bg-white border-b border-gray-200 px-2 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push('/')}
              className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xs font-bold truncate max-w-[80px]">BG Removal</h1>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Eye toggle - Switch between AI/Original */}
            <button
              onClick={() => setShowOriginalImage(!showOriginalImage)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                showOriginalImage 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={showOriginalImage ? "Show AI Image" : "Show Original Image"}
            >
              {showOriginalImage ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            
            <button
              onClick={() => handleDownload('png')}
              className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1.5 rounded-lg text-xs font-medium"
            >
              <Download size={12} /> Save
            </button>
          </div>
        </nav>
      )}

      {/* MAIN EDITOR LAYOUT */}
      <div className={`${isMobile ? 'h-[calc(100vh-3rem)] flex flex-col' : 'flex h-[calc(100vh-4rem)]'}`}>
        
        {/* LEFT TOOLBAR - Desktop only */}
        {!isMobile && (
          <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-4">
            <ToolButton
              active={tool === 'erase'}
              onClick={() => setTool('erase')}
              icon={<Eraser size={22} />}
              label="Erase"
            />
            <ToolButton
              active={tool === 'restore'}
              onClick={() => setTool('restore')}
              icon={<Brush size={22} />}
              label="Restore"
            />
            <ToolButton
              active={tool === 'move'}
              onClick={() => setTool('move')}
              icon={<Hand size={22} />}
              label="Move"
            />
            
            <div className="w-10 h-px bg-gray-200 my-2" />
            
            <ToolButton
              onClick={handleZoomIn}
              icon={<ZoomIn size={20} />}
              label="Zoom In"
            />
            <ToolButton
              onClick={handleZoomOut}
              icon={<ZoomOut size={20} />}
              label="Zoom Out"
            />
            <ToolButton
              onClick={handleZoomReset}
              icon={<Maximize size={20} />}
              label="Fit"
            />
          </div>
        )}

        {/* MAIN CANVAS AREA */}
        <div className={`${isMobile ? 'flex-1 relative bg-gray-50 overflow-hidden' : 'flex-1 relative bg-gray-50 overflow-hidden'}`}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-base font-medium text-gray-600">Loading Image...</p>
              </div>
            </div>
          ) : (
            <>
              {/* MOBILE ZOOM CONTROLS - Top right corner */}
              {isMobile && !mobileActivePanel && (
                <div className="absolute top-2 right-2 z-30 flex items-center gap-1">
                  {/* Zoom percentage */}
                  <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                    {Math.round(zoom * 100)}%
                  </div>
                  
                  {/* Zoom controls */}
                  <div className="flex gap-1">
                    <button
                      onClick={handleZoomOut}
                      className="w-8 h-8 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={handleZoomReset}
                      className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-lg"
                    >
                      <Maximize size={12} />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="w-8 h-8 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* CURRENT IMAGE MODE INDICATOR - Mobile */}
              {isMobile && !mobileActivePanel && (
                <div className="absolute top-2 left-2 z-30">
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    showOriginalImage 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {showOriginalImage ? 'Original' : 'AI Edited'}
                  </div>
                </div>
              )}

              {/* MAIN WORKSPACE - Image centered */}
              <div
                ref={containerRef}
                className={`absolute inset-0 ${isMobile ? 'pb-20' : 'p-4'} flex items-center justify-center`}
                style={{ 
                  touchAction: 'none',
                  overflow: 'hidden',
                  display: 'flex',        // Add this
                  alignItems: 'center',    // Add this
                  justifyContent: 'center' // Add this
                }}
                onMouseDown={!mobileActivePanel ? handleMouseDown : undefined}
                onMouseMove={!mobileActivePanel ? handleMouseMove : undefined}
                onMouseUp={!mobileActivePanel ? handleMouseUp : undefined}
                onMouseLeave={!mobileActivePanel ? handleMouseUp : undefined}
                onTouchStart={!mobileActivePanel ? handleTouchStart : undefined}
                onTouchMove={!mobileActivePanel ? handleTouchMove : undefined}
                onTouchEnd={!mobileActivePanel ? handleTouchEnd : undefined}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center',
                    cursor: tool === 'move' ? (isDragging ? 'grabbing' : 'grab') : 
                           (isMobile && showOriginalImage && tool !== 'move') ? 'not-allowed' : 'crosshair',
                  }}
                >
                  <canvas 
                    ref={mainCanvasRef} 
                    className="block shadow-xl"
                    style={{
                      maxWidth: 'none', // Important: Browser ko image choti karne se rokein
                      maxHeight: 'none'
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDEBAR - Desktop only */}
        {!isMobile && (
          <div className="w-88 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-5">
              <div className="flex border-b border-gray-200 mb-5">
                <TabButton
                  active={activeTab === 'brush'}
                  onClick={() => setActiveTab('brush')}
                  label="Brush"
                  icon={<Brush size={18} />}
                />
                <TabButton
                  active={activeTab === 'adjust'}
                  onClick={() => setActiveTab('adjust')}
                  label="Adjust"
                  icon={<SlidersHorizontal size={18} />}
                />
                <TabButton
                  active={activeTab === 'transform'}
                  onClick={() => setActiveTab('transform')}
                  label="Transform"
                  icon={<Settings size={18} />}
                />
                <TabButton
                  active={activeTab === 'background'}
                  onClick={() => setActiveTab('background')}
                  label="Background"
                  icon={<Layers size={18} />}
                />
              </div>

              {/* BRUSH SETTINGS */}
              {activeTab === 'brush' && (
                <BrushPanel 
                  resetToAIProcessed={resetToAIProcessed}
                  resetToOriginal={resetToOriginal}
                  brushSize={brushSize}
                  setBrushSize={setBrushSize}
                  brushHardness={brushHardness}
                  setBrushHardness={setBrushHardness}
                  brushOpacity={brushOpacity}
                  setBrushOpacity={setBrushOpacity}
                />
              )}

              {/* ADJUSTMENTS */}
              {activeTab === 'adjust' && (
                <AdjustPanel 
                  brightness={brightness}
                  setBrightness={setBrightness}
                  contrast={contrast}
                  setContrast={setContrast}
                  saturation={saturation}
                  setSaturation={setSaturation}
                  drawCanvas={drawCanvas}
                />
              )}

              {/* TRANSFORMATIONS */}
              {activeTab === 'transform' && (
                <TransformPanel 
                  rotation={rotation}
                  handleRotateLeft={handleRotateLeft}
                  handleRotateRight={handleRotateRight}
                  flipHorizontal={flipHorizontal}
                  handleFlipHorizontal={handleFlipHorizontal}
                  flipVertical={flipVertical}
                  handleFlipVertical={handleFlipVertical}
                  resetTransformations={resetTransformations}
                />
              )}

              {/* BACKGROUND OPTIONS */}
              {activeTab === 'background' && (
                <BackgroundPanel 
                  bgType={bgType}
                  setBgType={setBgType}
                  bgColor={bgColor}
                  setBgColor={setBgColor}
                  showColorPicker={showColorPicker}
                  setShowColorPicker={setShowColorPicker}
                  colorPresets={colorPresets}
                  handleBgImageUpload={handleBgImageUpload}
                  bgImageRef={bgImageRef}
                  drawCanvas={drawCanvas}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE HORIZONTAL TOOLBAR */}
      {isMobile && !loading && !mobileActivePanel && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg pb-safe">
          <div className="px-1 py-2">
            {/* Main tools horizontal scrollable line */}
            <div className="flex overflow-x-auto scrollbar-hide gap-1 px-1 pb-1">
              {mobileMainTools.map((toolItem) => (
                <button
                  key={toolItem.id}
                  onClick={() => {
                    if (toolItem.action) {
                      toolItem.action();
                    } else if (toolItem.panel) {
                      openMobilePanel(toolItem.panel);
                    } else {
                      setTool(toolItem.id);
                    }
                  }}
                  className={`flex-shrink-0 flex flex-col items-center p-1.5 rounded-lg transition-all min-w-[60px] ${
                    tool === toolItem.id 
                      ? toolItem.color === 'red' ? 'bg-red-50 text-red-600 border border-red-200' : 
                        toolItem.color === 'green' ? 'bg-green-50 text-green-600 border border-green-200' :
                        toolItem.color === 'blue' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        toolItem.color === 'purple' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                        toolItem.color === 'orange' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                        toolItem.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                        toolItem.color === 'teal' ? 'bg-teal-50 text-teal-600 border border-teal-200' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  disabled={isMobile && showOriginalImage && !toolItem.panel && toolItem.id !== 'move'}
                >
                  {toolItem.icon}
                  <span className="text-[10px] mt-0.5 font-medium">{toolItem.label}</span>
                </button>
              ))}
            </div>
            
            {/* Brush size control */}
            <div className="px-2 pt-2 border-t border-gray-100 mt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Brush: {brushSize}px</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setBrushSize(s => Math.max(5, s - 10))}
                    className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs"
                    disabled={isMobile && showOriginalImage}
                  >
                    -
                  </button>
                  <button
                    onClick={() => setBrushSize(s => Math.min(200, s + 10))}
                    className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs"
                    disabled={isMobile && showOriginalImage}
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                disabled={isMobile && showOriginalImage}
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE PANELS */}
      <AnimatePresence>
        {isMobile && mobileActivePanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobilePanel}
              className="fixed inset-0 bg-black/20 z-40"
            />
            
            {/* Panel Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[40vh] flex flex-col border-t border-gray-300"
            >
              {/* Panel Header */}
              <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-2xl">
                <h3 className="text-sm font-bold text-gray-800 capitalize">
                  {mobileActivePanel === 'brush' && 'Brush Settings'}
                  {mobileActivePanel === 'adjust' && 'Adjustments'}
                  {mobileActivePanel === 'transform' && 'Transform'}
                  {mobileActivePanel === 'background' && 'Background'}
                </h3>
                <button
                  onClick={closeMobilePanel}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              
              {/* Scrollable Panel Content */}
              <div className="flex-1 overflow-y-auto px-4 py-2">
                {mobileActivePanel === 'brush' && (
                  <MobileBrushPanel 
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    brushHardness={brushHardness}
                    setBrushHardness={setBrushHardness}
                    brushOpacity={brushOpacity}
                    setBrushOpacity={setBrushOpacity}
                    showOriginalImage={showOriginalImage}
                  />
                )}
                
                {mobileActivePanel === 'adjust' && (
                  <MobileAdjustPanel 
                    brightness={brightness}
                    setBrightness={setBrightness}
                    contrast={contrast}
                    setContrast={setContrast}
                    saturation={saturation}
                    setSaturation={setSaturation}
                    drawCanvas={drawCanvas}
                  />
                )}
                
                {mobileActivePanel === 'transform' && (
                  <MobileTransformPanel 
                    rotation={rotation}
                    handleRotateLeft={handleRotateLeft}
                    handleRotateRight={handleRotateRight}
                    flipHorizontal={flipHorizontal}
                    handleFlipHorizontal={handleFlipHorizontal}
                    flipVertical={flipVertical}
                    handleFlipVertical={handleFlipVertical}
                    resetTransformations={resetTransformations}
                  />
                )}
                
                {mobileActivePanel === 'background' && (
                  <MobileBackgroundPanel 
                    bgType={bgType}
                    setBgType={setBgType}
                    bgColor={bgColor}
                    setBgColor={setBgColor}
                    showColorPicker={showColorPicker}
                    setShowColorPicker={setShowColorPicker}
                    colorPresets={colorPresets}
                    handleBgImageUpload={handleBgImageUpload}
                    bgImageRef={bgImageRef}
                    drawCanvas={drawCanvas}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Component: Tool Button (Desktop)
function ToolButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all mb-1
        ${active 
          ? 'bg-green-500 text-white shadow-md' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
}

// Component: Tab Button (Desktop)
function TabButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 border-b-2
        ${active 
          ? 'border-green-600 text-green-700 bg-green-50' 
          : 'border-transparent text-gray-500 hover:text-green-600'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ===================== MOBILE COMPONENTS =====================

// Mobile Brush Panel (COMPACT)
function MobileBrushPanel({ 
  brushSize, 
  setBrushSize, 
  brushHardness, 
  setBrushHardness, 
  brushOpacity, 
  setBrushOpacity,
  showOriginalImage
}) {
  return (
    <div className="space-y-3">
      {/* Notification when original image is shown */}
      {showOriginalImage && (
        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg mb-2">
          <p className="text-xs text-blue-700 text-center font-medium">
            Switch to AI Edited mode to use brush tools
          </p>
        </div>
      )}
      
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700">Brush Size</span>
          <span className="text-xs font-bold text-green-600">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="5"
          max="200"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          disabled={showOriginalImage}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700">Hardness</span>
          <span className="text-xs font-bold text-green-600">{brushHardness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={brushHardness}
          onChange={(e) => setBrushHardness(parseInt(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          disabled={showOriginalImage}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700">Opacity</span>
          <span className="text-xs font-bold text-green-600">{brushOpacity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={brushOpacity}
          onChange={(e) => setBrushOpacity(parseInt(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          disabled={showOriginalImage}
        />
      </div>
    </div>
  );
}

// Mobile Adjust Panel (COMPACT)
function MobileAdjustPanel({ 
  brightness, 
  setBrightness, 
  contrast, 
  setContrast, 
  saturation, 
  setSaturation, 
  drawCanvas 
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Sun size={12} /> Brightness
          </span>
          <span className="text-xs font-bold text-green-600">{brightness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={brightness}
          onChange={(e) => { setBrightness(parseInt(e.target.value)); drawCanvas(); }}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Contrast size={12} /> Contrast
          </span>
          <span className="text-xs font-bold text-green-600">{contrast}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={contrast}
          onChange={(e) => { setContrast(parseInt(e.target.value)); drawCanvas(); }}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Droplets size={12} /> Saturation
          </span>
          <span className="text-xs font-bold text-green-600">{saturation}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={saturation}
          onChange={(e) => { setSaturation(parseInt(e.target.value)); drawCanvas(); }}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
      </div>
      
      <button
        onClick={() => {
          setBrightness(100);
          setContrast(100);
          setSaturation(100);
          drawCanvas();
        }}
        className="w-full py-1.5 mt-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
      >
        Reset All
      </button>
    </div>
  );
}

// Mobile Transform Panel (COMPACT)
function MobileTransformPanel({ 
  rotation, 
  handleRotateLeft, 
  handleRotateRight, 
  flipHorizontal, 
  handleFlipHorizontal, 
  flipVertical, 
  handleFlipVertical, 
  resetTransformations 
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleRotateLeft}
            className="p-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <RotateCcw size={12} /> Left
          </button>
          <button
            onClick={handleRotateRight}
            className="p-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <RotateCw size={12} /> Right
          </button>
        </div>
        
        <div className="p-1.5 bg-gray-50 rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Rotation:</span>
            <span className="text-xs font-bold text-green-600">{rotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleFlipHorizontal}
            className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              flipHorizontal ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FlipHorizontal size={12} /> {flipHorizontal ? '✓ Horizontal' : 'Horizontal'}
          </button>
          <button
            onClick={handleFlipVertical}
            className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              flipVertical ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FlipVertical size={12} /> {flipVertical ? '✓ Vertical' : 'Vertical'}
          </button>
        </div>
      </div>

      <button
        onClick={resetTransformations}
        className="w-full py-1.5 mt-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
      >
        Reset Transformations
      </button>
    </div>
  );
}

// Mobile Background Panel (COMPACT)
function MobileBackgroundPanel({ 
  bgType, 
  setBgType, 
  bgColor, 
  setBgColor, 
  showColorPicker, 
  setShowColorPicker, 
  colorPresets, 
  handleBgImageUpload, 
  bgImageRef, 
  drawCanvas 
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => { setBgType('transparent'); drawCanvas(); }}
            className={`p-1.5 rounded border transition-all flex flex-col items-center justify-center gap-0.5 ${
              bgType === 'transparent' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600 hover:border-green-300'
            }`}
          >
            <Grid3x3 size={12} />
            <span className="text-[10px] font-medium">Transparent</span>
          </button>
          <button
            onClick={() => { setBgType('color'); drawCanvas(); }}
            className={`p-1.5 rounded border transition-all flex flex-col items-center justify-center gap-0.5 ${
              bgType === 'color' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600 hover:border-green-300'
            }`}
          >
            <Palette size={12} />
            <span className="text-[10px] font-medium">Color</span>
          </button>
          <button
            onClick={() => { setBgType('image'); drawCanvas(); }}
            className={`p-1.5 rounded border transition-all flex flex-col items-center justify-center gap-0.5 ${
              bgType === 'image' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600 hover:border-green-300'
            }`}
          >
            <ImagePlus size={12} />
            <span className="text-[10px] font-medium">Image</span>
          </button>
        </div>
      </div>

      {bgType === 'color' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700">Select Color</span>
            <div className="flex items-center gap-1">
              <div
                className="w-5 h-5 rounded border border-gray-300 cursor-pointer"
                style={{ backgroundColor: bgColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
            </div>
          </div>
          
          {showColorPicker && (
            <div className="p-2 border border-gray-200 rounded bg-gray-50">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                  drawCanvas();
                }}
                className="w-full h-6 cursor-pointer rounded border border-gray-300"
              />
            </div>
          )}

          <div>
            <div className="grid grid-cols-5 gap-1">
              {colorPresets.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setBgColor(color);
                    drawCanvas();
                  }}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {bgType === 'image' && (
        <div className="space-y-2">
          <label className="block">
            <div className="border border-dashed border-gray-300 rounded p-2 text-center cursor-pointer hover:border-green-500 transition-colors bg-gray-50">
              <Upload size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-medium text-gray-600">Upload Image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleBgImageUpload}
                className="hidden"
              />
            </div>
          </label>
          
          {bgImageRef.current && (
            <div className="p-2 border border-gray-200 rounded bg-gray-50">
              <p className="text-xs font-medium mb-1">Current Background:</p>
              <div className="relative">
                <img
                  src={bgImageRef.current.src}
                  alt="Background"
                  className="w-full h-20 object-cover rounded"
                />
                <button
                  onClick={() => {
                    bgImageRef.current = null;
                    setBgType('transparent');
                    drawCanvas();
                  }}
                  className="absolute top-0.5 right-0.5 p-1 bg-red-500 text-white rounded-full"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===================== DESKTOP COMPONENTS =====================

// Component: Brush Panel (Desktop)
function BrushPanel({ 
  resetToAIProcessed, 
  resetToOriginal, 
  brushSize, 
  setBrushSize, 
  brushHardness, 
  setBrushHardness, 
  brushOpacity, 
  setBrushOpacity 
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Brush Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={resetToAIProcessed}
            className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> AI Image
          </button>
          <button
            onClick={resetToOriginal}
            className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <ImageIcon size={16} /> Original
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">Brush Size</label>
          <span className="text-sm font-bold text-green-600">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="5"
          max="200"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">Brush Hardness</label>
          <span className="text-sm font-bold text-green-600">{brushHardness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={brushHardness}
          onChange={(e) => setBrushHardness(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">Brush Opacity</label>
          <span className="text-sm font-bold text-green-600">{brushOpacity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={brushOpacity}
          onChange={(e) => setBrushOpacity(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
      </div>
    </div>
  );
}

// Component: Adjust Panel (Desktop)
function AdjustPanel({ 
  brightness, 
  setBrightness, 
  contrast, 
  setContrast, 
  saturation, 
  setSaturation, 
  drawCanvas 
}) {
  return (
    <div className="space-y-6">
      <AdjustmentSlider
        label="Brightness"
        value={brightness}
        onChange={(val) => { setBrightness(val); drawCanvas(); }}
        min={0}
        max={200}
        icon={<Sun size={16} />}
        unit="%"
      />
      <AdjustmentSlider
        label="Contrast"
        value={contrast}
        onChange={(val) => { setContrast(val); drawCanvas(); }}
        min={0}
        max={200}
        icon={<Contrast size={16} />}
        unit="%"
      />
      <AdjustmentSlider
        label="Saturation"
        value={saturation}
        onChange={(val) => { setSaturation(val); drawCanvas(); }}
        min={0}
        max={200}
        icon={<Droplets size={16} />}
        unit="%"
      />
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setBrightness(100);
            setContrast(100);
            setSaturation(100);
            drawCanvas();
          }}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Reset All Adjustments
        </button>
      </div>
    </div>
  );
}

// Component: Transform Panel (Desktop)
function TransformPanel({ 
  rotation, 
  handleRotateLeft, 
  handleRotateRight, 
  flipHorizontal, 
  handleFlipHorizontal, 
  flipVertical, 
  handleFlipVertical, 
  resetTransformations 
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Rotate</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleRotateLeft}
            className="p-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Left
          </button>
          <button
            onClick={handleRotateRight}
            className="p-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCw size={16} /> Right
          </button>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Current Rotation:</span>
          <span className="text-sm font-bold text-green-600">{rotation}°</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Flip</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleFlipHorizontal}
            className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              flipHorizontal ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FlipHorizontal size={16} /> {flipHorizontal ? '✓ Horizontal' : 'Horizontal'}
          </button>
          <button
            onClick={handleFlipVertical}
            className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              flipVertical ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FlipVertical size={16} /> {flipVertical ? '✓ Vertical' : 'Vertical'}
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={resetTransformations}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Reset All Transformations
        </button>
      </div>
    </div>
  );
}

// Component: Background Panel (Desktop)
function BackgroundPanel({ 
  bgType, 
  setBgType, 
  bgColor, 
  setBgColor, 
  showColorPicker, 
  setShowColorPicker, 
  colorPresets, 
  handleBgImageUpload, 
  bgImageRef, 
  drawCanvas 
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Background Type</h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => { setBgType('transparent'); drawCanvas(); }}
            className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-2 ${
              bgType === 'transparent' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <Grid3x3 size={16} />
            <span className="text-xs font-medium">Transparent</span>
          </button>
          <button
            onClick={() => { setBgType('color'); drawCanvas(); }}
            className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-2 ${
              bgType === 'color' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <Palette size={16} />
            <span className="text-xs font-medium">Color</span>
          </button>
          <button
            onClick={() => { setBgType('image'); drawCanvas(); }}
            className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-2 ${
              bgType === 'image' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <ImagePlus size={16} />
            <span className="text-xs font-medium">Image</span>
          </button>
        </div>
      </div>

      {bgType === 'color' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-700">Color Picker</h4>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm relative"
                style={{ backgroundColor: bgColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <span className="text-xs font-medium text-green-600">Click to pick</span>
            </div>
          </div>
          
          {showColorPicker && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Circle size={14} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700">Select Background Color:</span>
              </div>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                  drawCanvas();
                }}
                className="w-full h-10 cursor-pointer rounded border border-gray-300"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Selected:</span>
                <span className="text-sm font-bold text-gray-800">{bgColor.toUpperCase()}</span>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">Color Presets</h4>
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setBgColor(color);
                    drawCanvas();
                  }}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:scale-110 transition-transform relative"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {bgColor === color && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-300 shadow-sm flex items-center justify-center">
                      <Check size={8} className="text-green-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {bgType === 'image' && (
        <div className="space-y-4">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors bg-gray-50">
              <Upload size={24} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600">Upload Background Image</p>
              <p className="text-xs text-gray-500 mt-1">Drag & drop or click to browse</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleBgImageUpload}
                className="hidden"
              />
            </div>
          </label>
          
          {bgImageRef.current && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm font-medium mb-3">Current Background Image:</p>
              <div className="relative">
                <img
                  src={bgImageRef.current.src}
                  alt="Background"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    bgImageRef.current = null;
                    setBgType('transparent');
                    drawCanvas();
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Component: Adjustment Slider (Desktop)
function AdjustmentSlider({ label, value, onChange, min, max, icon, unit }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {icon} {label}
        </label>
        <span className="text-sm font-bold text-green-600">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}{unit}</span>
        <span>{(min + max) / 2}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}