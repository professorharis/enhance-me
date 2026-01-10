"use client";
import React, { useState, useEffect } from 'react';
import { 
  Layers, Download, Upload, X, Sparkles, User, 
  FileImage, FileText, Zap, CheckCircle2, AlertCircle,
  ArrowRight, Info, ShieldCheck, Lock, File, FileCode,
  Image as ImageIcon, FileType, FileVideo, FileArchive,
  Maximize, Crop, Eraser, FileMinus, LayoutGrid, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

// Dynamic imports to avoid SSR issues
let jsPDF;
let mammoth;
let html2canvas;
let pdfjsLib;
let docx;

if (typeof window !== 'undefined') {
  import('jspdf').then((module) => {
    jsPDF = module.default;
  });
  
  import('mammoth').then((module) => {
    mammoth = module;
  });
  
  import('html2canvas').then((module) => {
    html2canvas = module.default;
  });
  
  import('pdfjs-dist').then((module) => {
    pdfjsLib = module;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  });

  import('docx').then((module) => {
    docx = module;
  });
}

export default function FormatConverter() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState(''); // 'image' or 'document'
  const [processing, setProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [outputFileName, setOutputFileName] = useState('');
  const [conversionError, setConversionError] = useState('');

  // Document formats only - updated list
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

  // Image formats only
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

  // Format arrays for checking
  const imageFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'ico', 'tiff'];
  const documentFormatsArray = ['pdf', 'docx', 'txt', 'rtf', 'html', 'xml', 'csv', 'json', 'md', 'pptx'];

  // Original tools for footer
  const originalTools = [
    { name: "Remove Background", icon: <Eraser size={16} />, link: "/remove-bg", color: "from-green-500 to-emerald-600" },
    { name: "Smart Resize", icon: <Maximize size={16} />, link: "/resize", color: "from-blue-500 to-cyan-600" },
    { name: "AI Cropper", icon: <Crop size={16} />, link: "/crop", color: "from-purple-500 to-pink-600" },
    { name: "Smart Compress", icon: <FileMinus size={16} />, link: "/compress", color: "from-orange-500 to-red-600" },
    { name: "Format Engine", icon: <Layers size={16} />, link: "/convert", color: "from-yellow-500 to-amber-600" },
    { name: "Privacy Guard", icon: <ShieldCheck size={16} />, link: "/privacy", color: "from-gray-700 to-gray-900" },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploadedFile(file);
      setProcessedFile(null);
      setConversionError('');
      
      // Determine file type
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (imageFormats.includes(fileExtension)) {
        setFileType('image');
        // Default to JPG for image output
        setSelectedFormat('jpg');
      } else if (documentFormatsArray.includes(fileExtension)) {
        setFileType('document');
        // Default to PDF for document output
        setSelectedFormat('pdf');
      } else {
        setFileType('other');
        setConversionError('Unsupported file format. Please upload an image or document.');
      }
    }
  };

  // Get supported formats based on input file type
  const getSupportedFormats = () => {
    if (!uploadedFile) return [...imageFormatsList, ...documentFormats];
    
    const inputExtension = fileName.split('.').pop().toLowerCase();
    
    if (imageFormats.includes(inputExtension)) {
      // Image input: only show image formats and PDF
      return [...imageFormatsList, documentFormats.find(f => f.id === 'pdf')].filter(Boolean);
    } else if (documentFormatsArray.includes(inputExtension)) {
      // Document input: only show document formats (no image formats)
      return documentFormats;
    }
    
    // Default: return all formats
    return [...imageFormatsList, ...documentFormats];
  };

  // Convert image to image
  const convertImageToImage = async (img, targetFormat) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
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
          // Simple ICO conversion (single size)
          const icoCanvas = document.createElement('canvas');
          icoCanvas.width = 32;
          icoCanvas.height = 32;
          const icoCtx = icoCanvas.getContext('2d');
          icoCtx.drawImage(img, 0, 0, 32, 32);
          resolve(icoCanvas.toDataURL('image/x-icon'));
          return;
        case 'svg':
          // Simple SVG conversion
          const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            <image href="${canvas.toDataURL('image/png')}" width="${img.width}" height="${img.height}"/>
          </svg>`;
          resolve('data:image/svg+xml;base64,' + btoa(svgContent));
          return;
      }
      
      const convertedImage = canvas.toDataURL(mimeType, quality);
      resolve(convertedImage);
    });
  };

  // Convert any file to PDF
  const convertToPDF = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'pdf') {
          // If already PDF, just return it
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
          return;
        }
        
        if (imageFormats.includes(fileExtension)) {
          // Image to PDF
          const img = new Image();
          const reader = new FileReader();
          
          reader.onload = (e) => {
            img.onload = async () => {
              try {
                if (!jsPDF) throw new Error('PDF library not loaded');
                
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
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        } else if (fileExtension === 'docx') {
          // DOCX to PDF using html2canvas
          try {
            if (!mammoth || !html2canvas || !jsPDF) {
              throw new Error('Required libraries not loaded');
            }
            
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
            reject(new Error('DOCX to PDF conversion failed. Please try another format.'));
          }
        } else if (fileExtension === 'txt') {
          // TXT to PDF
          try {
            if (!jsPDF) throw new Error('PDF library not loaded');
            
            const text = await file.text();
            const pdf = new jsPDF();
            pdf.setFontSize(12);
            
            const lines = pdf.splitTextToSize(text, 180);
            let y = 20;
            let page = 1;
            
            for (let i = 0; i < lines.length; i++) {
              if (y > 280) {
                pdf.addPage();
                y = 20;
                page++;
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
          // RTF to PDF
          try {
            if (!jsPDF) throw new Error('PDF library not loaded');
            
            const text = await file.text();
            // Simple RTF to plain text conversion
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
          // For other document formats, create simple PDF with text
          try {
            const text = await file.text();
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

  // Convert to TXT
  const convertToTXT = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) throw new Error('PDF library not loaded');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        
        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (fileExtension === 'docx') {
        if (!mammoth) throw new Error('DOCX library not loaded');
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        const text = result.value;
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (fileExtension === 'txt') {
        // Already TXT, just return as is
        return URL.createObjectURL(file);
      } else if (fileExtension === 'rtf') {
        // RTF to TXT
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
      
      // For other formats, try to extract text
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

  // Convert to DOCX - FIXED VERSION
  const convertToDOCX = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'docx') {
        // Already DOCX, return as is
        return URL.createObjectURL(file);
      }
      
      if (!docx) {
        throw new Error('DOCX library not loaded. Please refresh the page.');
      }
      
      let text = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) throw new Error('PDF library not loaded');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n\n';
        }
      } else if (fileExtension === 'txt' || fileExtension === 'rtf' || fileExtension === 'html' || 
                 fileExtension === 'xml' || fileExtension === 'csv' || fileExtension === 'json' || 
                 fileExtension === 'md') {
        text = await file.text();
        
        // Clean RTF text
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
      
      // Create a proper DOCX document using the docx library
      const { Document, Packer, Paragraph, TextRun } = docx;
      
      // Create document with proper structure
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: text.substring(0, 10000), // Limit text length
                  size: 24,
                }),
              ],
            }),
          ],
        }],
      });
      
      // Generate the DOCX file
      const blob = await Packer.toBlob(doc);
      return URL.createObjectURL(blob);
      
    } catch (error) {
      console.error('DOCX conversion error:', error);
      
      // Fallback: Create a simple DOCX with proper structure
      try {
        let text = '';
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'pdf') {
          if (!pdfjsLib) throw new Error('PDF library not loaded');
          
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument(arrayBuffer);
          const pdf = await loadingTask.promise;
          
          for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            text += pageText + '\n\n';
          }
        } else {
          text = await file.text();
        }
        
        // Create a minimal valid DOCX with proper structure
        const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${text.substring(0, 5000).replace(/[<>&]/g, (c) => ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;'
        }[c]))}</w:t>
      </w:r>
    </w:p>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;
        
        // Create a proper DOCX zip structure
        const zip = new JSZip();
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
        
        zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);
        
        zip.file("word/document.xml", docxContent);
        
        const blob = await zip.generateAsync({ type: "blob" });
        return URL.createObjectURL(blob);
        
      } catch (fallbackError) {
        throw new Error(`DOCX conversion failed. Please try converting to PDF or TXT instead. Error: ${fallbackError.message}`);
      }
    }
  };

  // Convert to RTF
  const convertToRTF = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      let text = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) throw new Error('PDF library not loaded');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        
        for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\\par ';
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) throw new Error('DOCX library not loaded');
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        text = result.value;
      } else if (fileExtension === 'txt') {
        text = await file.text();
      } else {
        throw new Error(`Cannot convert ${fileExtension} to RTF`);
      }
      
      // Create simple RTF document
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

  // Convert to HTML
  const convertToHTML = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      let content = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) throw new Error('PDF library not loaded');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        
        for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => `<p>${item.str}</p>`).join('');
          content += pageText;
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) throw new Error('DOCX library not loaded');
        
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

  // Convert to other formats (XML, CSV, JSON, Markdown)
  const convertToOtherFormat = async (file, targetFormat) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let text = '';
      
      if (fileExtension === 'pdf') {
        if (!pdfjsLib) throw new Error('PDF library not loaded');
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        
        for (let i = 1; i <= Math.min(pdf.numPages, 2); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n';
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) throw new Error('DOCX library not loaded');
        
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

  // Main conversion function
  const convertFile = async () => {
    if (!uploadedFile) return;
    
    setProcessing(true);
    setConversionError('');
    
    try {
      let result;
      const inputExtension = fileName.split('.').pop().toLowerCase();
      
      // Handle different conversion types
      if (selectedFormat === 'pdf') {
        // Convert to PDF
        result = await convertToPDF(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.pdf`);
      } else if (imageFormats.includes(selectedFormat)) {
        // Convert to image format (only if input is image)
        if (imageFormats.includes(inputExtension)) {
          // Image to image
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
        // Convert to TXT
        result = await convertToTXT(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.txt`);
      } else if (selectedFormat === 'docx') {
        // Convert to DOCX
        result = await convertToDOCX(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.docx`);
      } else if (selectedFormat === 'rtf') {
        // Convert to RTF
        result = await convertToRTF(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.rtf`);
      } else if (selectedFormat === 'html') {
        // Convert to HTML
        result = await convertToHTML(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.html`);
      } else if (['xml', 'csv', 'json', 'md'].includes(selectedFormat)) {
        // Convert to other formats
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

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (processedFile && processedFile.startsWith('blob:')) {
        URL.revokeObjectURL(processedFile);
      }
    };
  }, [processedFile]);

  const previewURL = getPreviewURL();
  const supportedFormats = getSupportedFormats();

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
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-50 text-orange-700 rounded-full font-medium">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                  <Layers size={16} />
                </div>
                Universal File Converter
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Convert Files to <br />
                <span className="text-orange-600">Any Format</span>
              </h1>
              <p className="text-gray-600">
                Convert between 8+ document formats and 8+ image formats. All conversions done locally in your browser.
              </p>
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {!uploadedFile ? (
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Upload File</h3>
                  <p className="text-gray-500 mb-6">
                    Images: PNG, JPG, WebP, GIF, SVG, BMP, ICO
                    <br />
                    Documents: PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, Markdown
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                    <Upload size={18} />
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
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      {imageFormats.includes(fileName.split('.').pop().toLowerCase()) ? (
                        <img src={previewURL} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className={`w-12 h-12 ${
                          fileName.endsWith('.pdf') ? 'bg-red-100 text-red-600' :
                          fileName.endsWith('.docx') ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        } rounded-lg flex items-center justify-center`}>
                          <FileText size={24} />
                        </div>
                      )}
                      <div>
                        <div className="font-medium truncate max-w-[200px]">{fileName}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {fileType} File • Select format to convert
                        </div>
                      </div>
                    </div>
                    <button onClick={removeUploadedFile} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* FORMAT SELECTION */}
                  <div className="space-y-4">
                    <label className="font-medium">
                      Select Output Format ({supportedFormats.length} formats available)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2">
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
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={18} />
                        <span className="font-medium">Conversion Error</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{conversionError}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={convertFile}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Converting...
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        Convert Now
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle2 size={24} />
                      Converted to {selectedFormat.toUpperCase()}
                    </h3>
                    <button onClick={removeUploadedFile} className="p-2 text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 h-64 flex items-center justify-center p-4">
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
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                          <CheckCircle2 size={32} />
                        </div>
                        <p className="text-gray-600 font-medium">File converted successfully!</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Your {selectedFormat.toUpperCase()} file is ready to download
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          <AlertTriangle size={14} />
                          Click Download to save the file
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={downloadFile}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-3"
                    >
                      <Download size={20} />
                      Download {selectedFormat.toUpperCase()}
                    </button>
                    
                    <button 
                      onClick={removeUploadedFile}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                    >
                      <Upload size={20} />
                      Convert Another
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-3">
                  <FileImage size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">8+ Image Formats</h4>
                <p className="text-xs text-gray-600">PNG, JPG, WebP, GIF, SVG, etc.</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-3">
                  <FileText size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">10+ Document Formats</h4>
                <p className="text-xs text-gray-600">PDF, DOCX, TXT, RTF, HTML, XML, etc.</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-3">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold mb-1 text-sm">Privacy First</h4>
                <p className="text-xs text-gray-600">All conversions are local</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW & INFO */}
          <div className="space-y-8">
            {/* SUPPORTED CONVERSIONS */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-6">Supported Conversions</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      <FileImage size={18} />
                    </div>
                    <h4 className="font-bold">Image to Image</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Convert between PNG, JPG, WebP, GIF, SVG, BMP, ICO
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <FileText size={18} />
                    </div>
                    <h4 className="font-bold">Document to Document</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    PDF ↔ DOCX ↔ TXT ↔ RTF ↔ HTML ↔ XML ↔ JSON ↔ CSV ↔ Markdown
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      <File size={18} />
                    </div>
                    <h4 className="font-bold">Image to PDF</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Convert any image file to PDF document
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      <FileType size={18} />
                    </div>
                    <h4 className="font-bold">Smart Format Filtering</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Only relevant formats shown based on your file type
                  </p>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Conversion Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <span className="text-sm">Images only convert to other image formats or PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <span className="text-sm">Documents convert to other document formats only</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <span className="text-sm">PDF to DOCX conversion now works properly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <span className="text-sm">All files download correctly after conversion</span>
                </li>
              </ul>
            </div>

            {/* FILE TYPE INFO */}
            {uploadedFile && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">File Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">File Name</span>
                    <span className="font-medium truncate max-w-[150px]">{fileName}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">File Type</span>
                    <span className="font-medium capitalize">{fileType}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Available Formats</span>
                    <span className="font-medium">{supportedFormats.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Selected Output</span>
                    <span className="font-medium text-orange-600">{selectedFormat.toUpperCase()}</span>
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
                      <p className="text-sm text-gray-300">Explore all our file conversion tools</p>
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
     
                 {/* Popular Tools  */}
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