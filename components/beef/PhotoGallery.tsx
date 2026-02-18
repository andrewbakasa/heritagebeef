import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80', title: 'Open Range Pastures', category: 'Ranch' },
  { src: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80', title: 'Angus Breeding Herd', category: 'Genetics' },
  { src: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80', title: 'Feedlot Operations', category: 'Feedlot' },
  { src: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800&q=80', title: 'Cattle at Sunset', category: 'Ranch' },
  { src: 'https://unsplash.com/photos/a-butcher-is-standing-by-the-big-pieces-of-meat-in-slaughter-house-and-smiling-at-the-camera-wP_NjUyU304', title: 'Processing Facility', category: 'Processing' },
  { src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', title: 'Distribution Fleet', category: 'Distribution' },
  { src: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=80', title: 'Premium Cuts Display', category: 'Retail' },
  { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', title: 'Sunrise Over Fields', category: 'Ranch' },
  { src: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80', title: 'Hereford Bulls', category: 'Genetics' },
  { src: 'https://images.unsplash.com/photo-1551781150-0e3e2d3e1e3d?w=800&q=80', title: 'Feed Mill Operations', category: 'Feedlot' },
  { src: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', title: 'Quality Inspection', category: 'Processing' },
  { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', title: 'Sustainable Grazing', category: 'Ranch' },
  { src: 'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=800&q=80', title: 'Team at Work', category: 'Team' },
  { src: 'https://images.unsplash.com/photo-1504973960431-1c1c6e3e5c88?w=800&q=80', title: 'Aerial Ranch View', category: 'Ranch' },
  { src: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&q=80', title: 'Modern Facilities', category: 'Feedlot' },
  { src: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80', title: 'Aged Beef Selection', category: 'Retail' },
];

const categories = ['All', 'Ranch', 'Genetics', 'Feedlot', 'Processing', 'Distribution', 'Retail', 'Team'];

const PhotoGallery: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1);
  };
  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1);
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-ranch-cream relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            Visual Tour
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ranch-charcoal mt-3 mb-4">
            Our Operations
          </h2>
          <p className="text-ranch-slate max-w-2xl mx-auto text-base sm:text-lg">
            A visual journey through our integrated beef operation, from open pastures to premium retail.
          </p>
        </div>

        {/* Category Filter - Mobile Scrollable */}
        <div className={`-mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:mb-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-nowrap sm:flex-wrap sm:justify-center gap-2 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-ranch-forest text-green-600 shadow-lg'
                    : 'bg-white text-ranch-slate hover:bg-ranch-cream-dark border border-ranch-cream-dark/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid - Responsive spans */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {filtered.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              onClick={() => openLightbox(i)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer shadow-sm active:scale-95 transition-transform ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <div className={`${i === 0 ? 'h-[320px] sm:h-[450px]' : 'h-[150px] sm:h-[215px]'} w-full`}>
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 sm:group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Info Overlay - Higher visibility on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-1 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-600 font-bold text-xs sm:text-sm leading-tight">{img.title}</h4>
                    <span className="text-gray-600/70 text-[10px] sm:text-xs uppercase tracking-wider">{img.category}</span>
                  </div>
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600/70 hidden sm:block" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Counter */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ranch-cream-dark/30 rounded-full text-ranch-slate text-xs font-bold uppercase tracking-widest">
            <Camera className="w-4 h-4 text-ranch-terracotta" />
            {filtered.length} {activeCategory === 'All' ? 'Operations' : activeCategory} Photos
          </div>
        </div>
      </div>

      {/* Lightbox - Mobile Optimized Overlay */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
             <span className="text-gray-600/50 text-xs font-bold tracking-[0.2em] uppercase">
                {lightboxIndex + 1} / {filtered.length}
             </span>
             <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="text-gray-600 p-2 bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation - Hidden on very small screens, use swipe logic or prominent buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-gray-600/50 hover:text-gray-600 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-gray-600/50 hover:text-gray-600 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Image Container */}
          <div className="relative w-full max-w-5xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center mt-6 px-4">
              <h4 className="text-gray-600 text-xl sm:text-2xl font-serif font-bold mb-1">{filtered[lightboxIndex].title}</h4>
              <div className="inline-block px-3 py-1 bg-ranch-terracotta rounded text-black text-[10px] font-black uppercase tracking-widest">
                {filtered[lightboxIndex].category}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;