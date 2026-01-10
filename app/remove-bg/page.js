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
  RefreshCw, Type, ChevronDown, ChevronDown as ChevronDownIcon,
  Grid3x3, Droplets, Cloud, Menu,
  Waves, Sunset, Moon, CheckCircle2,
  Circle, FileImage, File
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  
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
  const [statusMessage, setStatusMessage] = useState('');
  
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
        setStatusMessage('✓ AI Processed Image Loaded');
        setTimeout(() => setStatusMessage(''), 2000);
        
        setTimeout(centerImage, 100);

      } catch (error) {
        console.error('Error loading images:', error);
        setLoading(false);
        alert('Failed to load images. Please try again.');
      }
    };

    loadImages();
  }, [router]);

  // --- 2. CENTER IMAGE ---
  const centerImage = () => {
    if (!containerRef.current || !offscreenCanvasRef.current) return;
    
    const canvas = offscreenCanvasRef.current;
    const container = containerRef.current;
    
    const containerWidth = container.clientWidth - 100;
    const containerHeight = container.clientHeight - 100;
    
    const scaleX = containerWidth / canvas.width;
    const scaleY = containerHeight / canvas.height;
    const scale = Math.min(scaleX, scaleY, 1);
    
    setZoom(scale);
    
    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    
    const x = (container.clientWidth - scaledWidth) / 2;
    const y = (container.clientHeight - scaledHeight) / 2;
    
    setPan({ x, y });
  };

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
    
    ctx.drawImage(offCanvas, -imgWidth / 2, -imgHeight / 2);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none';
  }, [brightness, contrast, saturation, bgType, bgColor, rotation, flipHorizontal, flipVertical]);

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
    setStatusMessage('✓ Reset to AI Processed Image');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  const resetToOriginal = () => {
    if (!offscreenCanvasRef.current || !originalImageRef.current) return;
    
    const offCtx = offscreenCanvasRef.current.getContext('2d');
    offCtx.clearRect(0, 0, offscreenCanvasRef.current.width, offscreenCanvasRef.current.height);
    offCtx.drawImage(originalImageRef.current, 0, 0);
    
    saveToHistory();
    drawCanvas();
    setStatusMessage('✓ Reset to Original Image');
    setTimeout(() => setStatusMessage(''), 2000);
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
    
    setShowDownloadDropdown(false);
    setStatusMessage(`✓ Image downloaded as ${extension.toUpperCase()}`);
    setTimeout(() => setStatusMessage(''), 2000);
  };

  // --- 11. MOUSE HANDLERS ---
  const handleMouseDown = (e) => {
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

  // --- 13. ZOOM CONTROLS (10% increments) ---
  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(z - 0.1, 0.1));
  };

  const handleZoomReset = () => {
    centerImage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans overflow-hidden">
      
      {/* HEADER WITH DESKTOP & MOBILE MENU */}
      <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">BG Removal Studio</h1>
            <p className="text-xs text-gray-500">{imageName}</p>
          </div>
        </div>


        <div className="flex items-center gap-3">
          {statusMessage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm">
              <CheckCircle2 size={14} /> {statusMessage}
            </div>
          )}
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
          
          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all"
            >
              <Download size={18} /> Download
              <ChevronDownIcon size={16} />
            </button>
            
            {showDownloadDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleDownload('png')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <FileImage size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">PNG Format</div>
                      <div className="text-xs text-gray-500">High quality, transparent background</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDownload('jpg')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <ImageIcon size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">JPG Format</div>
                      <div className="text-xs text-gray-500">Compressed, smaller file size</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDownload('webp')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <File size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">WebP Format</div>
                      <div className="text-xs text-gray-500">Modern format, best compression</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="px-6 py-4 space-y-4">
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-blue-600 transition-colors font-medium no-underline py-2 border-b border-gray-100"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-blue-600 transition-colors font-medium no-underline py-2 border-b border-gray-100"
              >
                Contact
              </Link>
              <Link 
                href="/faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-blue-600 transition-colors font-medium no-underline py-2 border-b border-gray-100"
              >
                FAQ
              </Link>
              <Link 
                href="/signin" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 text-left no-underline"
              >
                <User size={18} />
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN EDITOR LAYOUT */}
      <div className="flex h-[calc(100vh-4rem)]">
        
        {/* LEFT TOOLBAR - PROPER SIZE */}
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

        {/* MAIN CANVAS AREA - PROPERLY CENTERED */}
        <div className="flex-1 relative bg-gray-50 overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-base font-medium text-gray-600">Loading Images...</p>
                <p className="text-sm text-gray-500 mt-2">Original & AI Processed images loading</p>
              </div>
            </div>
          ) : (
            <>
              {/* ZOOM CONTROLS - RIGHT SIDE */}
              <div className="absolute top-4 right-4 z-20">
                <div className="flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
                  <div className="text-center mb-1">
                    <span className="text-sm font-bold text-green-600">{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleZoomIn}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                      title="Zoom In (10%)"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                      title="Zoom Out (10%)"
                    >
                      <Minus size={18} />
                    </button>
                  </div>
                  <button
                    onClick={centerImage}
                    className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 rounded-lg mt-2"
                    title="Fit to Screen"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              </div>

              {/* MAIN WORKSPACE */}
              <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center p-4"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  className="relative shadow-xl rounded-xl bg-white"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center',
                    cursor: tool === 'move' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair'
                  }}
                >
                  <canvas 
                    ref={mainCanvasRef} 
                    className="block rounded-xl"
                  />
                  
                  {/* Visual Brush Cursor */}
                  {(tool === 'erase' || tool === 'restore') && (
                    <div
                      className="absolute pointer-events-none z-50 border-2 shadow-xl rounded-full"
                      style={{
                        left: cursorPos.x,
                        top: cursorPos.y,
                        width: brushSize * zoom,
                        height: brushSize * zoom,
                        transform: 'translate(-50%, -50%)',
                        borderColor: tool === 'erase' ? '#ef4444' : '#10b981',
                        backgroundColor: tool === 'erase' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDEBAR - PROPER SIZE */}
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
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
              </motion.div>
            )}

            {/* ADJUSTMENTS */}
            {activeTab === 'adjust' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <AdjustmentSlider
                  label="Brightness"
                  value={brightness}
                  onChange={setBrightness}
                  min={0}
                  max={200}
                  icon={<Sun size={16} />}
                  unit="%"
                />
                <AdjustmentSlider
                  label="Contrast"
                  value={contrast}
                  onChange={setContrast}
                  min={0}
                  max={200}
                  icon={<Contrast size={16} />}
                  unit="%"
                />
                <AdjustmentSlider
                  label="Saturation"
                  value={saturation}
                  onChange={setSaturation}
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
              </motion.div>
            )}

            {/* TRANSFORMATIONS */}
            {activeTab === 'transform' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
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
              </motion.div>
            )}

            {/* BACKGROUND OPTIONS */}
            {activeTab === 'background' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Background Type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <BgOption
                      active={bgType === 'transparent'}
                      onClick={() => setBgType('transparent')}
                      label="Transparent"
                      icon={<Grid3x3 size={16} />}
                    />
                    <BgOption
                      active={bgType === 'color'}
                      onClick={() => setBgType('color')}
                      label="Color"
                      icon={<Palette size={16} />}
                    />
                    <BgOption
                      active={bgType === 'image'}
                      onClick={() => setBgType('image')}
                      label="Image"
                      icon={<ImagePlus size={16} />}
                    />
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
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Tool Button (PROPER SIZE)
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

// Component: Tab Button (PROPER SIZE)
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

// Component: Adjustment Slider (PROPER SIZE)
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

// Component: Background Option (PROPER SIZE)
function BgOption({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-2
        ${active 
          ? 'border-green-500 bg-green-50 text-green-700' 
          : 'border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
        }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}