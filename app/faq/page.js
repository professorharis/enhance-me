"use client";
import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, ChevronRight, Search, MessageCircle, 
  Sparkles, ArrowLeft, CheckCircle2, Zap,
  Shield, Lock, Download, Eraser, Minimize2, 
  Maximize, Layers, FileMinus, X, Menu,
  ChevronLeft, Home, Mail, User, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategory, setOpenCategory] = useState('general');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasHistory(window.history.length > 1);
    }
  }, []);

  const handleBackNavigation = (e) => {
    e.preventDefault();
    
    if (typeof window !== 'undefined') {
      if (hasHistory) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

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
        answer: 'Yes! All our tools are completely free with no usage limits. There are no premium plans, subscriptions, or hidden charges.',
        popular: true
      },
      {
        id: 'general-2',
        question: 'What file formats do you support?',
        answer: 'We support all major image formats: JPG, PNG, WebP, GIF, BMP, TIFF, and SVG.',
      },
      {
        id: 'general-3',
        question: 'Is there a file size limit?',
        answer: 'We support files up to 25MB. Most images fall well within this limit.',
      },
      {
        id: 'general-4',
        question: 'Do I need to create an account?',
        answer: 'No account is required. All tools work completely without registration.',
        popular: true
      },
      {
        id: 'general-5',
        question: 'Is there a mobile app?',
        answer: 'Our website is fully mobile-optimized and works perfectly on all devices.',
      },
      {
        id: 'general-6',
        question: 'What browsers are supported?',
        answer: 'We support Chrome, Firefox, Safari, Edge, and Opera.',
      },
      {
        id: 'general-7',
        question: 'Do you offer customer support?',
        answer: 'Yes! We offer free email support for all users.',
      },
      {
        id: 'general-8',
        question: 'Can I use this for commercial projects?',
        answer: 'Absolutely! You can use images for both personal and commercial projects.',
        popular: true
      },
    ],
    'bg-removal': [
      {
        id: 'bg-1',
        question: 'How does background removal work?',
        answer: 'We use advanced AI neural networks trained on millions of images for pixel-perfect accuracy.',
        popular: true
      },
      {
        id: 'bg-2',
        question: 'What image types work best?',
        answer: 'Images with clear contrast between subject and background work best.',
      },
      {
        id: 'bg-3',
        question: 'Can I remove backgrounds from transparent objects?',
        answer: 'Yes! Our AI can handle transparent objects like glass and water.',
      },
      {
        id: 'bg-4',
        question: 'Does it work on complex backgrounds?',
        answer: 'Yes, our AI handles complex backgrounds effectively.',
      },
      {
        id: 'bg-5',
        question: 'What about hair and fur edges?',
        answer: 'Our AI is trained to handle hair and fur with natural-looking edges.',
      },
      {
        id: 'bg-6',
        question: 'What format for transparent backgrounds?',
        answer: 'PNG is recommended for transparent backgrounds.',
      },
    ],
    compression: [
      {
        id: 'comp-1',
        question: 'How much can images be compressed?',
        answer: 'Typically 50-90% reduction depending on original quality.',
        popular: true
      },
      {
        id: 'comp-2',
        question: 'Does compression reduce image quality?',
        answer: 'Smart compression maintains visual quality while reducing file size.',
      },
      {
        id: 'comp-3',
        question: 'What compression for web?',
        answer: '75-85% quality is recommended for web.',
      },
      {
        id: 'comp-4',
        question: 'Can I compress multiple images at once?',
        answer: 'Currently, we support single image compression.',
      },
      {
        id: 'comp-5',
        question: 'What formats support compression?',
        answer: 'JPG, PNG, and WebP.',
      },
    ],
    resizing: [
      {
        id: 'resize-1',
        question: 'What are social media sizes?',
        answer: 'Instagram: 1080x1080px. Facebook: 1200x630px. Twitter: 1200x675px.',
        popular: true
      },
      {
        id: 'resize-2',
        question: 'What size for passport photos?',
        answer: 'Standard passport photos are 600x600 pixels at 300 DPI.',
      },
      {
        id: 'resize-3',
        question: 'What size for website images?',
        answer: 'Website banners: 1920x1080px. Blog images: 1200x630px.',
      },
      {
        id: 'resize-4',
        question: 'Does resizing affect quality?',
        answer: 'Smart resizing maintains quality when resizing.',
      },
      {
        id: 'resize-5',
        question: 'Can I resize to exact dimensions?',
        answer: 'Yes, you can enter exact width and height in pixels.',
      },
      {
        id: 'resize-6',
        question: 'What DPI for printing?',
        answer: '300 DPI for high-quality printing.',
      },
    ],
    conversion: [
      {
        id: 'conv-1',
        question: 'What image formats can I convert between?',
        answer: 'Convert between PNG, JPG, WebP, GIF, SVG, BMP.',
        popular: true
      },
      {
        id: 'conv-2',
        question: 'What document formats are supported?',
        answer: 'Convert between PDF, DOCX, TXT, HTML, CSV, JSON.',
      },
      {
        id: 'conv-3',
        question: 'Can I convert images to PDF?',
        answer: 'Yes! Convert any image to PDF with adjustable page size.',
      },
      {
        id: 'conv-4',
        question: 'Can I convert PDF to images?',
        answer: 'Currently, we support PDF to text-based formats.',
      },
      {
        id: 'conv-5',
        question: 'Does conversion affect quality?',
        answer: 'Image conversion maintains original quality.',
      },
      {
        id: 'conv-6',
        question: 'Can I batch convert?',
        answer: 'Currently single file conversion.',
      },
      {
        id: 'conv-7',
        question: 'Best format for web?',
        answer: 'WebP for photos, PNG for transparency, SVG for icons.',
      },
    ],
    privacy: [
      {
        id: 'privacy-1',
        question: 'Are my images stored on servers?',
        answer: 'No! All processing happens locally in your browser.',
        popular: true
      },
      {
        id: 'privacy-2',
        question: 'What metadata does Privacy Guard remove?',
        answer: 'Removes EXIF data including GPS location, camera info.',
      },
      {
        id: 'privacy-3',
        question: 'Why remove metadata?',
        answer: 'Metadata can contain sensitive information like location.',
      },
      {
        id: 'privacy-4',
        question: 'Does metadata removal affect quality?',
        answer: 'No, only removes hidden metadata.',
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
      
      {/* MOBILE HEADER */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <button 
          onClick={handleBackNavigation}
          className="flex items-center gap-2 text-blue-600 font-medium text-sm"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        
        <span className="font-bold text-gray-900 text-sm">FAQ</span>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-600"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DESKTOP NAVBAR - UNCHANGED */}
      <nav className="hidden md:flex h-20 bg-white border-b border-gray-200 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Enhance Me</span>
        </div>

        <div className="hidden md:flex">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Tools
          </Link>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-14 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
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
              href="/privacy-policy" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 p-2 rounded-lg flex items-center justify-center">
                <Shield size={18} />
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
          
          </div>
        </div>
      )}

      {/* HERO SECTION - MOBILE OPTIMIZED */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm sm:text-base mb-6 sm:mb-8">
            <HelpCircle size={14} className="sm:size-5" />
            Frequently Asked Questions
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8">
            How can we <span className="text-blue-600">help you?</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-xl leading-relaxed mb-8 sm:mb-10 md:mb-12">
            Find answers about our free image editing tools
          </p>

          {/* SEARCH BAR - MOBILE OPTIMIZED */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} className="sm:size-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* POPULAR QUESTIONS - MOBILE OPTIMIZED */}
      {!searchTerm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
            <Zap size={18} className="sm:size-6 text-amber-500" />
            Popular Questions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {faq.answer.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN FAQ CONTENT - MOBILE OPTIMIZED */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 pb-8 sm:pb-12 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          
          {/* SIDEBAR - CATEGORIES - MOBILE SCROLLABLE */}
          <div className="lg:w-1/4">
            <div className="sticky top-20 sm:top-24">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Categories</h3>
              
              {/* Mobile Scrollable Categories */}
              <div className="md:hidden mb-6">
                <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setOpenCategory(category.id)}
                      className={`min-w-[120px] p-3 rounded-lg border transition-all flex-shrink-0 ${
                        openCategory === category.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{category.icon}</div>
                      <div className="font-medium text-xs truncate mb-1">{category.name}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        openCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.count}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Desktop Category List */}
              <div className="hidden md:block">
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
              </div>

              {/* OUR TOOLS - MOBILE HIDDEN */}
              <div className="hidden md:block mt-8 bg-white border border-gray-200 rounded-2xl p-6">
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

              {/* CONTACT CTA - MOBILE HIDDEN */}
              <div className="hidden md:block mt-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle size={20} className="sm:size-6" />
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-2">Still need help?</h4>
                <p className="text-xs sm:text-sm text-blue-100 mb-4">
                  Can't find what you're looking for?
                </p>
                <Link href="/contact" className="no-underline">
                  <button className="w-full bg-white text-blue-600 py-2 sm:py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ CONTENT */}
          <div className="lg:w-3/4">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{categories.find(c => c.id === openCategory)?.name} Questions</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredFAQs[openCategory]?.length || 0} questions in this category
              </p>
            </div>

            {filteredFAQs[openCategory]?.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {filteredFAQs[openCategory].map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    <button
                      onClick={() => toggleQuestion(openCategory, faq.id)}
                      className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          expandedQuestions[faq.id]
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <ChevronRight
                            size={14}
                            className={`transition-transform ${
                              expandedQuestions[faq.id] ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base mb-1">{faq.question}</h3>
                          {faq.popular && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2 sm:py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                              <Zap size={10} /> Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {expandedQuestions[faq.id] && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 ml-9 sm:ml-12">
                        <div className="pt-3 sm:pt-4 border-t border-gray-100">
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                          {faq.id === 'privacy-1' && (
                            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <Shield size={16} className="sm:size-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-green-700 text-sm sm:text-base">Privacy First</p>
                                  <p className="text-xs sm:text-sm text-green-600 mt-1">
                                    Your images are processed locally and never leave your device.
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
              <div className="text-center py-8 sm:py-12 md:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search size={24} className="sm:size-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">No results found</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
                  We couldn't find any questions matching "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* TIPS SECTION */}
            {!searchTerm && openCategory === 'bg-removal' && (
              <div className="mt-8 sm:mt-12 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 sm:gap-3">
                  <Zap size={18} className="sm:size-6 text-green-600" />
                  Tips for Best Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600 text-sm sm:text-base">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base mb-1">High Contrast</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Clear subject-background separation works best</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600 text-sm sm:text-base">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base mb-1">Good Lighting</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Well-lit photos produce cleaner edges</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600 text-sm sm:text-base">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base mb-1">Solid Backgrounds</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Simple backgrounds work fastest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white border border-green-200 rounded-lg flex items-center justify-center text-green-600 text-sm sm:text-base">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base mb-1">PNG Format</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Use PNG for transparent background support</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE CONTACT CTA (Visible only on mobile) */}
      <div className="md:hidden max-w-4xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <MessageCircle size={24} />
          </div>
          <h2 className="text-xl font-bold mb-3 text-center">
            Still need help?
          </h2>
          <p className="text-sm text-blue-100 mb-6 text-center">
            Our support team is ready to help you
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/contact" className="no-underline">
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Contact Support
              </button>
            </Link>
            <button 
              onClick={handleBackNavigation}
              className="w-full bg-white/20 text-white py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              {hasHistory ? 'Back to Previous' : 'Back to Tools'}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP CTA SECTION */}
      <div className="hidden md:block max-w-4xl mx-auto px-6 md:px-16 pb-20">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-center text-white">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={28} className="sm:size-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Still have questions?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is ready to help you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="no-underline">
              <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all">
                Contact Support
              </button>
            </Link>
            <button 
              onClick={handleBackNavigation}
              className="bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              {hasHistory ? 'Back to Previous' : 'Back to Tools'}
            </button>
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
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles size={18} className="sm:size-[22px]" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold">Enhance Me</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Free Image Editing Tools
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Company</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">About</Link>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Privacy</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Contact</Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Terms</Link>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">FAQ</Link>
              </div>
            </div>

            {/* Popular Tools */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">Popular Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/remove-bg" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Remove Background</Link>
                <Link href="/resize" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Smart Resize</Link>
                <Link href="/convert" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Format Converter</Link>
              </div>
            </div>

            {/* More Tools */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-bold mb-3 text-sm sm:text-lg">More Tools</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/compress" className="text-gray-400 hover:text-white transition-colors no-underline text-xs sm:text-sm">Image Compressor</Link>
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
              Free image processing platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}