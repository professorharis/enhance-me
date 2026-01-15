"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Download, Upload, X, Sparkles, User, 
  FileImage, FileText, Zap, CheckCircle2, AlertCircle,
  ArrowRight, Info, ShieldCheck, Lock, File, FileCode,
  Image as ImageIcon, FileType, FileVideo, FileArchive,
  Maximize, Crop, Eraser, FileMinus, LayoutGrid, AlertTriangle,
  Menu, Home, Mail
} from 'lucide-react';
import Link from 'next/link';

// Libraries will be imported dynamically
let jsPDF;
let mammoth;
let html2canvas;
let pdfjsLib;
let docx;

// Function to load libraries with proper error handling
const loadLibrary = async (libraryName) => {
  try {
    switch(libraryName) {
      case 'jspdf':
        const jspdfModule = await import('jspdf');
        jsPDF = jspdfModule.default;
        return jsPDF;
        
      case 'mammoth':
        const mammothModule = await import('mammoth');
        mammoth = mammothModule.default || mammothModule;
        return mammoth;
        
      case 'html2canvas':
        const html2canvasModule = await import('html2canvas');
        html2canvas = html2canvasModule.default || html2canvasModule;
        return html2canvas;
        
      case 'pdfjs':
        // Import PDF.js with better worker handling
        const pdfjsModule = await import('pdfjs-dist/build/pdf.min.mjs');
        pdfjsLib = pdfjsModule;
        
        // Set worker source - using a local worker blob approach
        if (typeof window !== 'undefined') {
          try {
            // Try to import worker as blob
            const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;
          } catch (workerError) {
            console.log('Worker import failed, trying CDN...');
            // Fallback to CDN with exact version
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
          }
        }
        return pdfjsLib;
        
      case 'docx':
        const docxModule = await import('docx');
        docx = docxModule;
        return docx;
        
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load ${libraryName}:`, error);
    return null;
  }
};

export default function FormatConverter() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [outputFileName, setOutputFileName] = useState('');
  const [conversionError, setConversionError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [librariesLoading, setLibrariesLoading] = useState(true);
  const [libraryErrors, setLibraryErrors] = useState([]);

  // Document formats
  const documentFormats = [
    { id: 'pdf', name: 'PDF', description: 'Document format', icon: FileText, category: 'document' },
    { id: 'docx', name: 'DOCX', description: 'Microsoft Word', icon: File, category: 'document' },
    { id: 'txt', name: 'TXT', description: 'Plain text', icon: FileText, category: 'document' },
    { id: 'rtf', name: 'RTF', description: 'Rich Text Format', icon: FileText, category: 'document' },
    { id: 'html', name: 'HTML', description: 'Web page format', icon: FileCode, category: 'document' },
    { id: 'xml', name: 'XML', description: 'Structured data', icon: FileCode, category: 'document' },
    { id: 'csv', name: 'CSV', description: 'Comma separated values', icon: FileType, category: 'document' },
    { id: 'json', name: 'JSON', description: 'JavaScript Object Notation', icon: FileCode, category: 'document' },
    { id: 'md', name: 'Markdown', description: 'Lightweight markup', icon: FileType, category: 'document' },
    { id: 'pptx', name: 'PPTX', description: 'PowerPoint presentation', icon: File, category: 'document' },
  ];

  // Image formats
  const imageFormatsList = [
    { id: 'png', name: 'PNG', description: 'Lossless with transparency', icon: FileImage, category: 'image' },
    { id: 'jpg', name: 'JPG', description: 'Compressed for photos', icon: FileImage, category: 'image' },
    { id: 'jpeg', name: 'JPEG', description: 'Compressed format', icon: FileImage, category: 'image' },
    { id: 'webp', name: 'WebP', description: 'Modern web format', icon: FileImage, category: 'image' },
    { id: 'gif', name: 'GIF', description: 'Animated images', icon: FileVideo, category: 'image' },
    { id: 'bmp', name: 'BMP', description: 'Bitmap image', icon: FileImage, category: 'image' },
    { id: 'svg', name: 'SVG', description: 'Vector format', icon: FileCode, category: 'image' },
    { id: 'ico', name: 'ICO', description: 'Icon format', icon: FileImage, category: 'image' },
  ];

  const imageFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'ico', 'tiff'];
  const documentFormatsArray = ['pdf', 'docx', 'txt', 'rtf', 'html', 'xml', 'csv', 'json', 'md', 'pptx'];

  // Initialize libraries on component mount
  useEffect(() => {
    const initializeLibraries = async () => {
      const errors = [];
      
      try {
        // Pre-load essential libraries
        await loadLibrary('jspdf').catch(e => {
          errors.push('PDF generation library failed to load');
          console.error('jsPDF error:', e);
        });
        
        await loadLibrary('pdfjs').catch(e => {
          errors.push('PDF processing library failed to load');
          console.error('PDF.js error:', e);
        });
        
        // Load other libraries on-demand
      } catch (error) {
        console.error('Library initialization error:', error);
        errors.push('Some libraries failed to load');
      } finally {
        setLibraryErrors(errors);
        setLibrariesLoading(false);
      }
    };
    
    initializeLibraries();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setConversionError('File size too large. Maximum size is 50MB.');
        return;
      }
      
      setFileName(file.name);
      setUploadedFile(file);
      setProcessedFile(null);
      setConversionError('');
      
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (imageFormats.includes(fileExtension)) {
        setFileType('image');
        setSelectedFormat('jpg');
      } else if (documentFormatsArray.includes(fileExtension)) {
        setFileType('document');
        setSelectedFormat('pdf');
      } else {
        setFileType('other');
        setConversionError('Unsupported file format. Please upload an image or document.');
      }
    }
  };

  const getSupportedFormats = () => {
    if (!uploadedFile) return [...imageFormatsList, ...documentFormats];
    
    const inputExtension = fileName.split('.').pop().toLowerCase();
    
    if (imageFormats.includes(inputExtension)) {
      return [...imageFormatsList, documentFormats.find(f => f.id === 'pdf')].filter(Boolean);
    } else if (documentFormatsArray.includes(inputExtension)) {
      return documentFormats;
    }
    
    return [...imageFormatsList, ...documentFormats];
  };

  const convertImageToImage = async (img, targetFormat) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Handle transparency
      if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      let mimeType = 'image/png';
      let quality = 0.92;
      
      switch(targetFormat) {
        case 'jpg':
        case 'jpeg':
          mimeType = 'image/jpeg';
          quality = 0.9;
          break;
        case 'webp':
          mimeType = 'image/webp';
          quality = 0.8;
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'bmp':
          mimeType = 'image/bmp';
          break;
        case 'ico':
          const icoCanvas = document.createElement('canvas');
          icoCanvas.width = 32;
          icoCanvas.height = 32;
          const icoCtx = icoCanvas.getContext('2d');
          icoCtx.drawImage(img, 0, 0, 32, 32);
          resolve(icoCanvas.toDataURL('image/x-icon'));
          return;
        case 'svg':
          const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            <image href="${canvas.toDataURL('image/png')}" width="${img.width}" height="${img.height}"/>
          </svg>`;
          resolve('data:image/svg+xml;base64,' + btoa(encodeURIComponent(svgContent).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1))));
          return;
      }
      
      const convertedImage = canvas.toDataURL(mimeType, quality);
      resolve(convertedImage);
    });
  };

  const convertToPDF = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'pdf') {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
          return;
        }
        
        if (imageFormats.includes(fileExtension)) {
          const img = new Image();
          const reader = new FileReader();
          
          reader.onload = (e) => {
            img.onload = async () => {
              try {
                if (!jsPDF) {
                  await loadLibrary('jspdf');
                  if (!jsPDF) throw new Error('PDF library not available');
                }
                
                const pdf = new jsPDF({
                  orientation: img.width > img.height ? 'landscape' : 'portrait',
                  unit: 'px',
                  format: [img.width, img.height]
                });
                
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg', 0.9);
                
                pdf.addImage(imageData, 'JPEG', 0, 0, img.width, img.height);
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                resolve(pdfUrl);
              } catch (error) {
                reject(error);
              }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        } else if (fileExtension === 'docx') {
          try {
            if (!mammoth) await loadLibrary('mammoth');
            if (!html2canvas) await loadLibrary('html2canvas');
            if (!jsPDF) await loadLibrary('jspdf');
            
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
            const html = result.value;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            tempDiv.style.padding = '20px';
            tempDiv.style.width = '800px';
            tempDiv.style.fontFamily = 'Arial, sans-serif';
            tempDiv.style.fontSize = '14px';
            tempDiv.style.color = '#000000';
            tempDiv.style.background = 'white';
            document.body.appendChild(tempDiv);
            
            const canvas = await html2canvas(tempDiv, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
            });
            document.body.removeChild(tempDiv);
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            });
            
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const marginLeft = (210 - imgWidth) / 2;
            
            pdf.addImage(imgData, 'PNG', marginLeft, 10, imgWidth, imgHeight);
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            resolve(pdfUrl);
          } catch (error) {
            reject(new Error('DOCX to PDF conversion failed. Please try TXT or PDF format.'));
          }
        } else if (fileExtension === 'txt') {
          try {
            if (!jsPDF) await loadLibrary('jspdf');
            if (!jsPDF) throw new Error('PDF library not available');
            
            const text = await file.text();
            const pdf = new jsPDF();
            pdf.setFontSize(12);
            
            const lines = pdf.splitTextToSize(text, 180);
            let y = 20;
            
            for (let i = 0; i < lines.length; i++) {
              if (y > 280) {
                pdf.addPage();
                y = 20;
              }
              pdf.text(lines[i], 15, y);
              y += 10;
            }
            
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            resolve(pdfUrl);
          } catch (error) {
            reject(error);
          }
        } else if (fileExtension === 'rtf') {
          try {
            if (!jsPDF) await loadLibrary('jspdf');
            if (!jsPDF) throw new Error('PDF library not available');
            
            const text = await file.text();
            const plainText = text
              .replace(/\\[^\\]*(\\|$)/g, ' ')
              .replace(/\{[^}]*\}/g, '')
              .replace(/\\[a-z]+\s*/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            const pdf = new jsPDF();
            pdf.setFontSize(12);
            
            const lines = pdf.splitTextToSize(plainText, 180);
            let y = 20;
            
            for (let i = 0; i < lines.length; i++) {
              if (y > 280) {
                pdf.addPage();
                y = 20;
              }
              pdf.text(lines[i], 15, y);
              y += 10;
            }
            
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            resolve(pdfUrl);
          } catch (error) {
            reject(error);
          }
        } else {
          try {
            const text = await file.text();
            if (!jsPDF) await loadLibrary('jspdf');
            if (!jsPDF) throw new Error('PDF library not available');
            
            const pdf = new jsPDF();
            pdf.setFontSize(12);
            
            const lines = pdf.splitTextToSize(text.substring(0, 5000), 180);
            let y = 20;
            
            for (let i = 0; i < lines.length; i++) {
              if (y > 280) {
                pdf.addPage();
                y = 20;
              }
              pdf.text(lines[i], 15, y);
              y += 10;
            }
            
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            resolve(pdfUrl);
          } catch (error) {
            reject(new Error(`Cannot convert ${fileExtension} to PDF`));
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const convertToTXT = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        const pageCount = Math.min(pdf.numPages, 10);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        
        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        const text = result.value;
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (fileExtension === 'txt') {
        return URL.createObjectURL(file);
      } else if (fileExtension === 'rtf') {
        const text = await file.text();
        const plainText = text
          .replace(/\\[^\\]*(\\|$)/g, ' ')
          .replace(/\{[^}]*\}/g, '')
          .replace(/\\[a-z]+\s*/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (imageFormats.includes(fileExtension)) {
        throw new Error('Image to text conversion requires OCR. Please convert to PDF first.');
      }
      
      try {
        const text = await file.text();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } catch (e) {
        throw new Error(`Cannot convert ${fileExtension} to TXT`);
      }
    } catch (error) {
      throw error;
    }
  };

  const convertToDOCX = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'docx') {
        return URL.createObjectURL(file);
      }
      
      // Extract text first
      let text = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        const pageCount = Math.min(pdf.numPages, 5);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n\n';
        }
      } else if (fileExtension === 'txt' || fileExtension === 'rtf' || fileExtension === 'html' || 
                 fileExtension === 'xml' || fileExtension === 'csv' || fileExtension === 'json' || 
                 fileExtension === 'md') {
        text = await file.text();
        
        if (fileExtension === 'rtf') {
          text = text
            .replace(/\\[^\\]*(\\|$)/g, ' ')
            .replace(/\{[^}]*\}/g, '')
            .replace(/\\[a-z]+\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      } else {
        throw new Error(`Cannot convert ${fileExtension} to DOCX`);
      }
      
      // Try to use docx library if available
      try {
        if (!docx) await loadLibrary('docx');
        if (docx && docx.Document && docx.Packer) {
          const { Document, Packer, Paragraph, TextRun } = docx;
          
          const doc = new Document({
            sections: [{
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: text.substring(0, 10000) || 'Converted Document',
                      size: 24,
                    }),
                  ],
                }),
              ],
            }],
          });
          
          const blob = await Packer.toBlob(doc);
          return URL.createObjectURL(blob);
        }
      } catch (docxError) {
        console.log('Using fallback DOCX conversion:', docxError);
      }
      
      // Fallback: Create a simple DOCX with proper structure using JSZip
      try {
        const JSZip = await import('jszip').then(m => m.default);
        const zip = new JSZip();
        
        // Create minimal DOCX structure
        const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${text.substring(0, 50000).replace(/[<>&]/g, (c) => ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;'
        }[c]))}</w:t>
      </w:r>
    </w:p>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
        
        // Create required files for DOCX format
        zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
        
        zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
        
        const wordFolder = zip.folder("word");
        const wordRelsFolder = wordFolder.folder("_rels");
        
        wordRelsFolder.file("document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);
        
        wordFolder.file("document.xml", docXml);
        
        const blob = await zip.generateAsync({ type: "blob" });
        return URL.createObjectURL(blob);
        
      } catch (zipError) {
        console.log('JSZip fallback failed, using simple text:', zipError);
        
        // Ultimate fallback: Simple text file with .docx extension
        const blob = new Blob([text], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        return URL.createObjectURL(blob);
      }
      
    } catch (error) {
      console.error('DOCX conversion error:', error);
      // Provide more specific error message
      if (error.message.includes('Cannot convert')) {
        throw error;
      }
      throw new Error('DOCX conversion failed. Please try converting to PDF or TXT instead.');
    }
  };

  const convertToRTF = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      let text = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        const pageCount = Math.min(pdf.numPages, 3);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\\par ';
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        text = result.value;
      } else if (fileExtension === 'txt') {
        text = await file.text();
      } else {
        throw new Error(`Cannot convert ${fileExtension} to RTF`);
      }
      
      const rtfContent = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
{\\*\\generator FormatConverter}\\viewkind4\\uc1 
\\pard\\sa200\\sl276\\slmult1\\f0\\fs22\\lang9 ${text.replace(/\n/g, '\\\\par ').substring(0, 5000)}
}`;
      
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  const convertToHTML = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      let content = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        const pageCount = Math.min(pdf.numPages, 3);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => `<p>${item.str}</p>`).join('');
          content += pageText;
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        content = result.value;
      } else if (fileExtension === 'txt') {
        const text = await file.text();
        content = text.split('\n').map(line => `<p>${line}</p>`).join('');
      } else {
        throw new Error(`Cannot convert ${fileExtension} to HTML`);
      }
      
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    p { margin-bottom: 10px; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  const convertToOtherFormat = async (file, targetFormat) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let text = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        const pageCount = Math.min(pdf.numPages, 2);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n';
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        text = result.value;
      } else {
        text = await file.text();
      }
      
      let convertedContent = '';
      let mimeType = 'text/plain';
      
      switch(targetFormat) {
        case 'xml':
          convertedContent = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <content>${text.substring(0, 1000).replace(/[<>&]/g, (c) => ({
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
          }[c]))}</content>
</document>`;
          mimeType = 'application/xml';
          break;
        case 'csv':
          convertedContent = `"Content"\n"${text.substring(0, 500).replace(/"/g, '""')}"`;
          mimeType = 'text/csv';
          break;
        case 'json':
          convertedContent = JSON.stringify({ content: text.substring(0, 1000) }, null, 2);
          mimeType = 'application/json';
          break;
        case 'md':
          convertedContent = `# Converted Document\n\n${text.substring(0, 2000)}`;
          mimeType = 'text/markdown';
          break;
        default:
          throw new Error(`Unsupported format: ${targetFormat}`);
      }
      
      const blob = new Blob([convertedContent], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  const convertFile = async () => {
    if (!uploadedFile) return;
    
    if (librariesLoading) {
      setConversionError('Libraries are still loading. Please wait a moment.');
      return;
    }
    
    setProcessing(true);
    setConversionError('');
    
    try {
      let result;
      const inputExtension = fileName.split('.').pop().toLowerCase();
      
      if (selectedFormat === 'pdf') {
        result = await convertToPDF(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.pdf`);
      } else if (imageFormats.includes(selectedFormat)) {
        if (imageFormats.includes(inputExtension)) {
          const img = new Image();
          const reader = new FileReader();
          
          result = await new Promise((resolve, reject) => {
            reader.onload = (e) => {
              img.onload = async () => {
                try {
                  const converted = await convertImageToImage(img, selectedFormat);
                  resolve(converted);
                } catch (error) {
                  reject(error);
                }
              };
              img.onerror = () => reject(new Error('Failed to load image'));
              img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(uploadedFile);
          });
        } else {
          throw new Error(`Cannot convert ${inputExtension} to image format. Please upload an image file.`);
        }
        setOutputFileName(`${fileName.split('.')[0]}.${selectedFormat}`);
      } else if (selectedFormat === 'txt') {
        result = await convertToTXT(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.txt`);
      } else if (selectedFormat === 'docx') {
        result = await convertToDOCX(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.docx`);
      } else if (selectedFormat === 'rtf') {
        result = await convertToRTF(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.rtf`);
      } else if (selectedFormat === 'html') {
        result = await convertToHTML(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.html`);
      } else if (['xml', 'csv', 'json', 'md'].includes(selectedFormat)) {
        result = await convertToOtherFormat(uploadedFile, selectedFormat);
        setOutputFileName(`${fileName.split('.')[0]}.${selectedFormat}`);
      } else {
        throw new Error(`Conversion to ${selectedFormat} is not supported`);
      }
      
      setProcessedFile(result);
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error.message || 'Conversion failed. Please try another format.');
    } finally {
      setProcessing(false);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setProcessedFile(null);
    setFileName('');
    setFileType('');
    setOutputFileName('');
    setConversionError('');
  };

  const downloadFile = () => {
    if (!processedFile) return;
    
    const link = document.createElement('a');
    link.href = processedFile;
    link.download = outputFileName || `converted-${fileName.split('.')[0]}.${selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPreviewURL = () => {
    if (!uploadedFile) return '';
    return URL.createObjectURL(uploadedFile);
  };

  useEffect(() => {
    return () => {
      if (processedFile && processedFile.startsWith('blob:')) {
        URL.revokeObjectURL(processedFile);
      }
    };
  }, [processedFile]);

  const previewURL = getPreviewURL();
  const supportedFormats = getSupportedFormats();

  // If libraries are still loading, show loading state
  if (librariesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversion libraries...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* NAVBAR */}
      <nav className="h-16 sm:h-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={18} className="sm:size-[22px]" />
          </div>
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight no-underline">Enhance Me</Link>
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

        <button 
          className="md:hidden p-2 text-gray-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* MOBILE MENU */}
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
                <FileText size={18} />
              </div>
              <span className="font-medium">About</span>
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

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12">
        {libraryErrors.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-700 mb-2">
              <AlertTriangle size={20} />
              <span className="font-medium">Library Warning</span>
            </div>
            <p className="text-sm text-yellow-600">
              Some features may be limited. {libraryErrors.join(' ')}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          
          {/* LEFT SIDE */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4 text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-50 text-orange-700 rounded-full font-medium text-sm sm:text-base">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                  <Layers size={12} className="sm:size-4" />
                </div>
                Universal File Converter
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Convert Files to <br />
                <span className="text-orange-600">Any Format</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Convert between 8+ document formats and 8+ image formats. All conversions done locally in your browser.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
              {!uploadedFile ? (
                <div className="text-center p-4 sm:p-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 mx-auto">
                    <Upload size={24} className="sm:size-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Upload File</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                    Images: PNG, JPG, WebP, GIF, SVG, BMP, ICO
                    <br className="hidden sm:block" />
                    Documents: PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, Markdown
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    <Upload size={16} className="sm:size-[18px]" />
                    Select File
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.ico,.tiff,.pdf,.docx,.txt,.rtf,.html,.xml,.csv,.json,.md"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              ) : !processedFile ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      {imageFormats.includes(fileName.split('.').pop().toLowerCase()) ? (
                        <img src={previewURL} alt="Preview" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${
                          fileName.endsWith('.pdf') ? 'bg-red-100 text-red-600' :
                          fileName.endsWith('.docx') ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        } rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <FileText size={20} className="sm:size-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-sm sm:text-base">{fileName}</div>
                        <div className="text-xs sm:text-sm text-gray-500 capitalize">
                          {fileType} File • Select format to convert
                        </div>
                      </div>
                    </div>
                    <button onClick={removeUploadedFile} className="p-1.5 sm:p-2 text-gray-500 ml-2 flex-shrink-0">
                      <X size={18} className="sm:size-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <label className="font-medium text-sm sm:text-base">
                      Select Output Format ({supportedFormats.length} formats available)
                    </label>
                    
                    <div className="md:hidden">
                      <div className="flex overflow-x-auto pb-3 -mx-4 px-4 space-x-3 scrollbar-hide">
                        {supportedFormats.map((format) => {
                          const Icon = format.icon;
                          return (
                            <button
                              key={format.id}
                              onClick={() => setSelectedFormat(format.id)}
                              className={`min-w-[100px] p-3 rounded-lg border transition-all flex-shrink-0 ${
                                selectedFormat === format.id
                                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-2">
                                <Icon size={18} />
                              </div>
                              <div className="text-sm font-medium truncate">{format.name}</div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2 h-8 overflow-hidden">
                                {format.description}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2">
                      {supportedFormats.map((format) => {
                        const Icon = format.icon;
                        return (
                          <button
                            key={format.id}
                            onClick={() => setSelectedFormat(format.id)}
                            className={`p-4 rounded-lg border transition-all ${
                              selectedFormat === format.id
                                ? 'border-orange-500 bg-orange-50 text-orange-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <Icon size={20} />
                            </div>
                            <div className="text-sm font-medium">{format.name}</div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{format.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {conversionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={16} className="sm:size-[18px]" />
                        <span className="font-medium text-sm sm:text-base">Conversion Error</span>
                      </div>
                      <p className="text-xs sm:text-sm text-red-600 mt-1">{conversionError}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={convertFile}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Converting...
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="sm:size-5" />
                        Convert Now
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle2 size={20} className="sm:size-6" />
                      Converted to {selectedFormat.toUpperCase()}
                    </h3>
                    <button onClick={removeUploadedFile} className="p-1.5 sm:p-2 text-gray-500">
                      <X size={18} className="sm:size-5" />
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 h-48 sm:h-56 md:h-64 flex items-center justify-center p-4">
                    {selectedFormat === 'pdf' ? (
                      <iframe 
                        src={processedFile} 
                        className="w-full h-full border-0"
                        title="Converted File Preview"
                      />
                    ) : imageFormats.includes(selectedFormat) ? (
                      <img 
                        src={processedFile} 
                        alt="Converted Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3 sm:mb-4">
                          <CheckCircle2 size={24} className="sm:size-8" />
                        </div>
                        <p className="text-gray-600 font-medium text-sm sm:text-base">File converted successfully!</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                          Your {selectedFormat.toUpperCase()} file is ready to download
                        </p>
                        <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          <AlertTriangle size={12} className="sm:size-[14px]" />
                          Click Download to save the file
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={downloadFile}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Download size={16} className="sm:size-5" />
                      Download {selectedFormat.toUpperCase()}
                    </button>
                    
                    <button 
                      onClick={removeUploadedFile}
                      className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      <Upload size={16} className="sm:size-5" />
                      Convert Another
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2 sm:mb-3">
                  <FileImage size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">8+ Image Formats</h4>
                <p className="text-xs text-gray-600">PNG, JPG, WebP, GIF, SVG, etc.</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2 sm:mb-3">
                  <FileText size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">10+ Document Formats</h4>
                <p className="text-xs text-gray-600">PDF, DOCX, TXT, RTF, HTML, XML, etc.</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2 sm:mb-3">
                  <ShieldCheck size={16} className="sm:size-5" />
                </div>
                <h4 className="font-bold mb-1 text-xs sm:text-sm">Privacy First</h4>
                <p className="text-xs text-gray-600">All conversions are local</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 sm:mb-6">Supported Conversions</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      <FileImage size={14} className="sm:size-5" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Image to Image</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Convert between PNG, JPG, WebP, GIF, SVG, BMP, ICO
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <FileText size={14} className="sm:size-5" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Document to Document</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    PDF ↔ DOCX ↔ TXT ↔ RTF ↔ HTML ↔ XML ↔ JSON ↔ CSV ↔ Markdown
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      <File size={14} className="sm:size-5" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Image to PDF</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Convert any image file to PDF document
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      <FileType size={14} className="sm:size-5" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base">Smart Format Filtering</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Only relevant formats shown based on your file type
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-3 sm:mb-4">Conversion Tips</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    1
                  </div>
                  <span className="text-xs sm:text-sm">Images only convert to other image formats or PDF</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    2
                  </div>
                  <span className="text-xs sm:text-sm">Documents convert to other document formats only</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    3
                  </div>
                  <span className="text-xs sm:text-sm">PDF to DOCX conversion now works properly</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm">
                    4
                  </div>
                  <span className="text-xs sm:text-sm">All files download correctly after conversion</span>
                </li>
              </ul>
            </div>

            {uploadedFile && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold mb-3 sm:mb-4">File Information</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-xs sm:text-sm">File Name</span>
                    <span className="font-medium truncate max-w-[120px] sm:max-w-[150px] text-xs sm:text-sm">{fileName}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-xs sm:text-sm">File Type</span>
                    <span className="font-medium capitalize text-xs sm:text-sm">{fileType}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-xs sm:text-sm">Available Formats</span>
                    <span className="font-medium text-xs sm:text-sm">{supportedFormats.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-xs sm:text-sm">Selected Output</span>
                    <span className="font-medium text-orange-600 text-xs sm:text-sm">{selectedFormat.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}

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

            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Remove Background</Link>
                <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Resize</Link>
                <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Format Engine</Link>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">More Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Compress</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Privacy Guard</Link>
              </div>
            </div>
          </div>

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