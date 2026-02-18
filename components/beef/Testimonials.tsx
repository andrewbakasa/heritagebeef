import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Robert Hargrove',
    role: 'Owner, Hargrove Ranch',
    type: 'Rancher',
    quote: "Heritage Beef's genetics program transformed our herd. In three years, our weaning weights increased 12% and our calving rate hit an all-time high. Their breeding consultation is worth every penny.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    name: 'Maria Santos',
    role: 'VP Procurement, Pacific Foods',
    type: 'Distributor',
    quote: "Consistency is everything in our business. Heritage Beef Zim delivers the same premium quality week after week, with 99.2% on-time delivery. They've become our most reliable protein supplier.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    name: 'Chef Thomas Keller',
    role: 'Executive Chef, The Steakhouse',
    type: 'Restaurant',
    quote: "The marbling and tenderness of Heritage Beef's prime cuts are exceptional. My guests consistently comment on the quality, and the full traceability story adds tremendous value to our dining experience.",
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Animal Science, State University',
    type: 'Academic',
    quote: "Heritage Beef's feedlot operation represents the gold standard in precision animal nutrition. Their data-driven approach to feeding programs consistently produces results that outperform industry benchmarks.",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
  },
  {
    name: 'James Whitfield',
    role: 'CEO, Premium Meats Co.',
    type: 'Retail',
    quote: "Partnering with Heritage Beef for our private label program was transformative. Their custom processing capabilities and quality assurance protocols exceed anything we've experienced in 20 years of business.",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
  },
  {
    name: 'Linda Crawford',
    role: 'Managing Partner, AgriVest Capital',
    type: 'Investor',
    quote: "Heritage Beef has delivered consistent 16% annual returns on our investment over five years. Their vertically integrated model provides natural hedging against market volatility that pure-play operations can't match.",
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
  },
  {
    name: 'Mike Patterson',
    role: 'Custom Feeding Client',
    type: 'Rancher',
    quote: "I've been feeding cattle with Heritage for eight years. Their transparency is unmatched — I get weekly reports with individual animal data, and their commodity buying power saves me $65-85 per head on feed costs.", // Converted $30-40 per head logic to match kg-scale or remains as head, but adjusted for regional Zim context
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
  },
  {
    name: 'Angela Torres',
    role: 'Sustainability Director, GreenTable',
    type: 'Partner',
    quote: "Heritage Beef's regenerative grazing program is a model for the industry. Their carbon sequestration results are verified and impressive — proof that profitable ranching and environmental stewardship go hand in hand.",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  },
  {
    name: 'David Chen',
    role: 'Procurement, Whole Foods Market',
    type: 'Retail',
    quote: "Our customers demand transparency and quality. Heritage Beef provides both with their blockchain-verified traceability system. Every cut tells a story from pasture to package, and our shoppers love it.",
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80',
  },
  {
    name: 'Patricia Owens',
    role: 'Director, State Cattlemen\'s Association',
    type: 'Industry',
    quote: "Heritage Beef is raising the bar for the entire industry. Their integrated approach, technology adoption, and commitment to animal welfare set a standard that benefits all beef producers through improved consumer confidence.",
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
  },
];

const Testimonials: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterType, setFilterType] = useState('All');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive visible count
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const types = ['All', ...Array.from(new Set(testimonials.map(t => t.type)))];

  const filtered = filterType === 'All'
    ? testimonials
    : testimonials.filter(t => t.type === filterType);

  const visibleCount = isMobile ? 1 : 3;
  const safeIndex = Math.min(currentIndex, Math.max(0, filtered.length - visibleCount));

  useEffect(() => {
    setCurrentIndex(0);
  }, [filterType]);

  useEffect(() => {
    if (!isAutoPlaying || filtered.length <= visibleCount) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, filtered.length - visibleCount + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, filtered.length, visibleCount]);

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(Math.max(0, safeIndex - 1));
  };
  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(Math.min(filtered.length - visibleCount, safeIndex + 1));
  };

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements - Resized for Mobile */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-ranch-forest/3 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-ranch-terracotta/3 rounded-full translate-x-1/3 translate-y-1/3" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            Trusted Partners
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ranch-charcoal mt-3 mb-4 leading-tight">
            What Our Partners Say
          </h2>
          <p className="text-ranch-slate max-w-2xl mx-auto text-base sm:text-lg">
            Hear from those who trust Heritage Beef for quality and reliability.
          </p>
        </div>

        {/* Type Filter - Mobile Scrollable Bar */}
        <div className={`flex sm:flex-wrap items-center sm:justify-center gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide -mx-4 px-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap active:scale-95 ${
                filterType === type
                  ? 'bg-ranch-forest text-green-600 shadow-md'
                  : 'bg-ranch-cream text-ranch-slate hover:bg-ranch-cream-dark'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Testimonial Cards Slider */}
        <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out sm:gap-6"
              style={{ transform: `translateX(-${safeIndex * (100 / visibleCount)}%)` }}
            >
              {filtered.map((testimonial, i) => (
                <div
                  key={`${testimonial.name}-${i}`}
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] px-2 sm:px-0"
                >
                  <div className="bg-ranch-cream/30 border border-ranch-cream-dark/50 rounded-2xl p-6 sm:p-8 h-full flex flex-col hover:shadow-lg transition-shadow">
                    <Quote className="w-8 h-8 text-ranch-terracotta/20 mb-4 flex-shrink-0" />
                    <p className="text-ranch-charcoal leading-relaxed text-sm sm:text-base flex-grow mb-6 italic">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-3 pt-5 border-t border-ranch-cream-dark/50">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-ranch-charcoal text-xs sm:text-sm truncate">{testimonial.name}</div>
                        <div className="text-ranch-slate text-[10px] sm:text-xs truncate">{testimonial.role}</div>
                      </div>
                      <span className="ml-auto text-[10px] bg-ranch-forest/10 text-ranch-forest px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter sm:tracking-normal">
                        {testimonial.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation & Progress Dots */}
          {filtered.length > visibleCount && (
            <div className="flex items-center justify-between sm:justify-center gap-4 mt-8 sm:mt-12">
              <button
                onClick={prev}
                disabled={safeIndex === 0}
                className="p-3 rounded-full bg-ranch-cream hover:bg-ranch-cream-dark disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-ranch-charcoal" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.max(1, filtered.length - visibleCount + 1) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false); }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === safeIndex ? 'bg-ranch-terracotta w-6 sm:w-8' : 'bg-ranch-cream-dark w-1.5 sm:w-2'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={safeIndex >= filtered.length - visibleCount}
                className="p-3 rounded-full bg-ranch-cream hover:bg-ranch-cream-dark disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-ranch-charcoal" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;