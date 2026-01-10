"use client";
import React, { useState } from 'react';
import { 
  HelpCircle, ChevronRight, Search, MessageCircle, 
  Sparkles, ArrowLeft, CheckCircle2, Zap,
  Shield, Lock, Download, Eraser, Minimize2, 
  Maximize, Layers, FileMinus, X, Menu
} from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategory, setOpenCategory] = useState('general');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'general', name: 'General', icon: '📝', count: 8 },
    { id: 'bg-removal', name: 'Background Removal', icon: '🎨', count: 6 },
    { id: 'compression', name: 'Image Compression', icon: '📦', count: 5 },
    { id: 'resizing', name: 'Image Resizing', icon: '📏', count: 6 },
    { id: 'conversion', name: 'Format Conversion', icon: '🔄', count: 7 },
    { id: 'privacy', name: 'Privacy Guard', icon: '🔒', count: 4 },
  ];

  const faqs = {
    general: [
      {
        id: 'general-1',
        question: 'Is Enhance Me really free?',
        answer: 'Yes! All our tools are completely free with no usage limits. There are no premium plans, subscriptions, or hidden charges. Enjoy unlimited background removal, compression, resizing, format conversion, and privacy protection.',
        popular: true
      },
      {
        id: 'general-2',
        question: 'What file formats do you support?',
        answer: 'We support all major image formats: JPG, PNG, WebP, GIF, BMP, TIFF, and SVG for images. For documents, we support PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, and Markdown.',
      },
      {
        id: 'general-3',
        question: 'Is there a file size limit?',
        answer: 'We support files up to 25MB. Most images and documents fall well within this limit. For larger files, we recommend compressing them first using our compression tool.',
      },
      {
        id: 'general-4',
        question: 'Do I need to create an account?',
        answer: 'No account is required. All tools work completely without registration. You can use all features anonymously and instantly.',
        popular: true
      },
      {
        id: 'general-5',
        question: 'Is there a mobile app?',
        answer: 'Our website is fully mobile-optimized and works perfectly on all devices. You can access Enhance Me from any smartphone, tablet, or computer with a modern web browser.',
      },
      {
        id: 'general-6',
        question: 'What browsers are supported?',
        answer: 'We support Chrome, Firefox, Safari, Edge, and Opera - basically any modern browser released in the last 3 years.',
      },
      {
        id: 'general-7',
        question: 'Do you offer customer support?',
        answer: 'Yes! We offer free email support for all users. Feel free to contact us through our contact page for any questions.',
      },
      {
        id: 'general-8',
        question: 'Can I use this for commercial projects?',
        answer: 'Absolutely! You can use images processed through Enhance Me for both personal and commercial projects. No attribution is required.',
        popular: true
      },
    ],
    'bg-removal': [
      {
        id: 'bg-1',
        question: 'How does the background removal work?',
        answer: 'We use advanced AI neural networks trained on millions of images. The AI identifies the main subject and separates it from the background with pixel-perfect accuracy.',
        popular: true
      },
      {
        id: 'bg-2',
        question: 'What image types work best for background removal?',
        answer: 'Images with clear contrast between subject and background work best. Photos with solid backgrounds, good lighting, and well-defined edges produce perfect results.',
      },
      {
        id: 'bg-3',
        question: 'Can I remove backgrounds from transparent objects?',
        answer: 'Yes! Our AI can handle transparent objects like glass, water, and plastic with advanced edge detection algorithms.',
      },
      {
        id: 'bg-4',
        question: 'Does it work on complex backgrounds?',
        answer: 'Yes, our AI handles complex backgrounds including busy patterns, multiple colors, and detailed backgrounds effectively.',
      },
      {
        id: 'bg-5',
        question: 'What about hair and fur edges?',
        answer: 'Our AI is specially trained to handle hair, fur, and other fine details with natural-looking edges.',
      },
      {
        id: 'bg-6',
        question: 'What output format is best for transparent backgrounds?',
        answer: 'PNG is recommended for transparent backgrounds as it supports alpha channels. JPG does not support transparency.',
      },
    ],
    compression: [
      {
        id: 'comp-1',
        question: 'How much can images be compressed?',
        answer: 'Typically 50-90% reduction depending on the original quality and compression settings. You can adjust quality to balance between file size and visual quality.',
        popular: true
      },
      {
        id: 'comp-2',
        question: 'Does compression reduce image quality?',
        answer: 'Smart compression maintains visual quality while reducing file size. You control the balance with quality sliders.',
      },
      {
        id: 'comp-3',
        question: 'What compression ratio should I use for web?',
        answer: '75-85% quality is recommended for web - excellent visual quality with good file size reduction.',
      },
      {
        id: 'comp-4',
        question: 'Can I compress multiple images at once?',
        answer: 'Currently, we support single image compression. For multiple images, process them one by one.',
      },
      {
        id: 'comp-5',
        question: 'What formats support compression?',
        answer: 'JPG, PNG, and WebP. PNG compression is lossless while JPG and WebP offer adjustable compression.',
      },
    ],
    resizing: [
      {
        id: 'resize-1',
        question: 'What are the standard social media sizes?',
        answer: 'Instagram: 1080x1080px (square), 1080x1350px (portrait). Facebook: 1200x630px. Twitter: 1200x675px. LinkedIn: 1200x627px.',
        popular: true
      },
      {
        id: 'resize-2',
        question: 'What size for passport photos?',
        answer: 'Standard passport photos are 2x2 inches (600x600 pixels at 300 DPI). Our tool includes preset for passport photos.',
      },
      {
        id: 'resize-3',
        question: 'What size for website images?',
        answer: 'Website banners: 1920x1080px. Blog images: 1200x630px. Product images: 800x800px. Icons: 512x512px or 256x256px.',
      },
      {
        id: 'resize-4',
        question: 'Does resizing affect image quality?',
        answer: 'Our smart resizing uses advanced algorithms to maintain quality when resizing. Downscaling (making smaller) usually maintains quality better than upscaling.',
      },
      {
        id: 'resize-5',
        question: 'Can I resize to exact dimensions?',
        answer: 'Yes, you can enter exact width and height in pixels. Aspect ratio can be maintained or overridden based on your needs.',
      },
      {
        id: 'resize-6',
        question: 'What DPI should I use for printing?',
        answer: '300 DPI for high-quality printing, 150 DPI for standard printing, 72 DPI for web/screen display.',
      },
    ],
    conversion: [
      {
        id: 'conv-1',
        question: 'What image formats can I convert between?',
        answer: 'Convert between PNG, JPG, WebP, GIF, SVG, BMP, ICO, and TIFF formats.',
        popular: true
      },
      {
        id: 'conv-2',
        question: 'What document formats are supported?',
        answer: 'Convert between PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, and Markdown formats.',
      },
      {
        id: 'conv-3',
        question: 'Can I convert images to PDF?',
        answer: 'Yes! Convert any image (JPG, PNG, etc.) to PDF with adjustable page size and orientation.',
      },
      {
        id: 'conv-4',
        question: 'Can I convert PDF to images?',
        answer: 'Currently, we support PDF to text-based formats. For PDF to image conversion, try converting the PDF pages to images first.',
      },
      {
        id: 'conv-5',
        question: 'Does conversion affect quality?',
        answer: 'Image to image conversion maintains original quality. Document conversion preserves content structure and formatting.',
      },
      {
        id: 'conv-6',
        question: 'Can I batch convert multiple files?',
        answer: 'Currently single file conversion. For multiple files, process them one by one.',
      },
      {
        id: 'conv-7',
        question: 'What is the best format for web?',
        answer: 'WebP for photos (smallest size), PNG for graphics with transparency, SVG for logos and icons.',
      },
    ],
    privacy: [
      {
        id: 'privacy-1',
        question: 'Are my images stored on your servers?',
        answer: 'No! All processing happens locally in your browser. Your images never leave your device, ensuring complete privacy.',
        popular: true
      },
      {
        id: 'privacy-2',
        question: 'What metadata does Privacy Guard remove?',
        answer: 'Removes EXIF data including camera info, GPS location, date/time, device info, software used, and other embedded metadata.',
      },
      {
        id: 'privacy-3',
        question: 'Why should I remove metadata?',
        answer: 'Metadata can contain sensitive information like location, camera serial numbers, and personal details. Removing it protects your privacy.',
      },
      {
        id: 'privacy-4',
        question: 'Does metadata removal affect image quality?',
        answer: 'No, only removes hidden metadata without affecting image quality or appearance.',
      },
    ],
  };

  const toggleQuestion = (categoryId, questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const filteredFAQs = Object.entries(faqs).reduce((acc, [category, questions]) => {
    if (searchTerm) {
      const filtered = questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    } else {
      acc[category] = questions;
    }
    return acc;
  }, {});

  const popularQuestions = Object.values(faqs)
    .flat()
    .filter(q => q.popular);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      
      {/* NAVBAR  */}
      <nav className="h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
        </div>

        {/* DESKTOP MENU -  "BACK TO TOOLS" */}
        <div className="hidden md:flex">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Tools
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-white border-t border-gray-200">
          <div className="flex flex-col py-4 px-6">
            <Link 
              href="/"
              className="py-3 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium flex items-center justify-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ArrowLeft size={18} />
              Back to Tools
            </Link>
            
            {/* Terms Page Link */}
            <Link 
              href="/terms-of-service"
              className="mt-4 py-3 px-4 text-gray-700 hover:text-blue-600 transition-colors font-medium border-t border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium mb-8">
              <HelpCircle size={16} />
              Frequently Asked Questions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
              How can we <span className="text-blue-600">help you?</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              Find answers about our free image editing tools
            </p>

            {/* SEARCH BAR */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPULAR QUESTIONS */}
      {!searchTerm && (
        <div className="max-w-7xl mx-auto px-6 md:px-16 mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Zap size={24} className="text-amber-500" />
            Popular Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularQuestions.slice(0, 6).map((faq, index) => (
              <button
                key={faq.id}
                onClick={() => {
                  const category = Object.keys(faqs).find(key => 
                    faqs[key].some(q => q.id === faq.id)
                  );
                  setOpenCategory(category);
                  toggleQuestion(category, faq.id);
                }}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {faq.answer.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN FAQ CONTENT */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR - CATEGORIES */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold mb-6">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setOpenCategory(category.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      openCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${
                      openCategory === category.id
                        ? 'bg-white/20'
                        : 'bg-gray-100'
                    }`}>
                      {category.count}
                    </div>
                  </button>
                ))}
              </div>

              {/* OUR TOOLS */}
              <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold mb-4">Our Free Tools</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Eraser size={16} className="text-green-600" />
                    <span className="text-sm">Background Removal</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Minimize2 size={16} className="text-green-600" />
                    <span className="text-sm">Image Compression</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Maximize size={16} className="text-blue-600" />
                    <span className="text-sm">Smart Resizing</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Layers size={16} className="text-orange-600" />
                    <span className="text-sm">Format Conversion</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Shield size={16} className="text-gray-600" />
                    <span className="text-sm">Privacy Guard</span>
                  </div>
                </div>
              </div>

              {/* CONTACT CTA */}
              <div className="mt-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle size={24} />
                </div>
                <h4 className="font-bold mb-2">Still need help?</h4>
                <p className="text-sm text-blue-100 mb-4">
                  Can't find what you're looking for?
                </p>
                <Link href="/contact" className="no-underline">
                  <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ CONTENT */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{categories.find(c => c.id === openCategory)?.name} Questions</h2>
              <p className="text-gray-600">
                {filteredFAQs[openCategory]?.length || 0} questions in this category
              </p>
            </div>

            {filteredFAQs[openCategory]?.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs[openCategory].map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    <button
                      onClick={() => toggleQuestion(openCategory, faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          expandedQuestions[faq.id]
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${
                              expandedQuestions[faq.id] ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{faq.question}</h3>
                          {faq.popular && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                              <Zap size={10} /> Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {expandedQuestions[faq.id] && (
                      <div className="px-6 pb-6 ml-12">
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          {faq.id === 'privacy-1' && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <Shield size={20} className="text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                  <p className="font-medium text-green-700">Privacy First</p>
                                  <p className="text-sm text-green-600 mt-1">
                                    Your images are processed locally in your browser and never leave your device.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">No results found</h3>
                <p className="text-gray-600 mb-8">
                  We couldn't find any questions matching "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* TIPS SECTION */}
            {!searchTerm && openCategory === 'bg-removal' && (
              <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <Zap size={24} className="text-green-600" />
                  Tips for Best Background Removal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Use High Contrast</h4>
                      <p className="text-sm text-gray-600">Images with clear subject-background separation work best</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Good Lighting</h4>
                      <p className="text-sm text-gray-600">Well-lit photos produce cleaner edges and better results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Solid Backgrounds</h4>
                      <p className="text-sm text-gray-600">Simple, solid-colored backgrounds work fastest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">PNG for Transparency</h4>
                      <p className="text-sm text-gray-600">Download as PNG for transparent background support</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 pb-20">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-10 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-6">
            Still have questions?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is ready to help you with any questions about our free image editing tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="no-underline">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all">
                Contact Support
              </button>
            </Link>
            <Link href="/" className="no-underline">
              <button className="bg-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-all">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>

        {/* FOOTER  */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles size={22} />
                  </div>
                  <span className="text-2xl font-bold">Enhance Me</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Free Image Editing Tools
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
                <Link href="/remove-bg" className="text-gray-400 hover:text-white transition-colors no-underline">Remove Background</Link>
                <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline">Smart Resize</Link>
                <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline">Format Converter</Link>
              </div>
            </div>

            {/* More Tools */}
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">More Tools</h4>
              <div className="flex flex-col gap-2">
                <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline">Image Compressor</Link>
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
              Free image processing platform - No subscriptions, no limits
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}