import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Dna, Wheat, Factory, Truck, Store, ChevronRight, ArrowRight } from 'lucide-react';

const stages = [
  {
    id: 'breeding',
    icon: Dna,
    title: 'Genetics & Breeding',
    subtitle: 'Foundation of Quality',
    color: 'from-green-700 to-green-600',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    description: 'Our breeding program leverages advanced genomic selection to produce cattle with superior marbling, feed efficiency, and disease resistance. We maintain a herd of 5,000+ registered Angus and Hereford cattle.',
    metrics: [
      { label: 'Registered Sires', value: '120+' },
      { label: 'Genomic Accuracy', value: '95%' },
      { label: 'Calving Rate', value: '94%' },
      { label: 'Weaning Weight', value: '295 kg' }, // Converted from 650 lbs
    ],
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80',
  },
  {
    id: 'feeding',
    icon: Wheat,
    title: 'Custom Feeding',
    subtitle: 'Precision Nutrition',
    color: 'from-amber-700 to-amber-600',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    description: 'Our 2,500-head feedlot utilizes precision feeding technology with custom rations optimized for each pen. Computer-controlled feed delivery ensures consistent nutrition and minimal waste.',
    metrics: [
      { label: 'Feedlot Capacity', value: '2,500' },
      { label: 'ADG Average', value: '1.7 kg' }, // Converted from 3.8 lbs
      { label: 'Feed Conversion', value: '5.8:1' },
      { label: 'Days on Feed', value: '150' },
    ],
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80',
  },
  {
    id: 'processing',
    icon: Factory,
    title: 'Processing',
    subtitle: 'SADC Inspected',
    color: 'from-red-700 to-red-600',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    description: 'Our state-of-the-art SADC-inspected processing facility handles 800 head per day with full traceability from ranch to retail. Humane handling certified with Temple Grandin-designed systems.',
    metrics: [
      { label: 'Daily Capacity', value: '800 head' },
      { label: 'SADC Grade', value: 'Choice+' },
      { label: 'Yield Grade', value: '2.8 avg' },
      { label: 'Traceability', value: '100%' },
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  },
  {
    id: 'distribution',
    icon: Truck,
    title: 'Distribution',
    subtitle: 'Cold Chain Excellence',
    color: 'from-blue-700 to-blue-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    description: 'Temperature-controlled fleet serving 320+ distribution points across 12 states. Real-time GPS tracking and blockchain-verified chain of custody ensure product integrity from plant to customer.',
    metrics: [
      { label: 'Fleet Size', value: '85 trucks' },
      { label: 'States Served', value: '12' },
      { label: 'On-Time Rate', value: '99.2%' },
      { label: 'Temp Compliance', value: '100%' },
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
  },
  {
    id: 'retail',
    icon: Store,
    title: 'Retail & Foodservice',
    subtitle: 'Premium Brands',
    color: 'from-purple-700 to-purple-600',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    description: 'Our branded beef programs serve premium grocery chains, white-tablecloth restaurants, and direct-to-consumer channels. Each cut carries our Heritage Beef Zim quality guarantee and full provenance story.',
    metrics: [
      { label: 'Retail Partners', value: '180+' },
      { label: 'Restaurant Clients', value: '140+' },
      { label: 'Brand Recognition', value: '78%' },
      { label: 'Repeat Rate', value: '92%' },
    ],
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&q=80',
  },
];

const ValueChain: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const { ref, isVisible } = useScrollAnimation(0.1);

  const current = stages[activeStage];
  const Icon = current.icon;

  return (
    <section id="value-chain" className="py-16 sm:py-24 bg-ranch-charcoal relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            Complete Integration
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-500 mt-3 mb-4">
            Our Value Chain
          </h2>
          <p className="text-gray-500/60 max-w-2xl mx-auto text-base sm:text-lg px-4">
            Five interconnected stages delivering unmatched quality control and transparency from genetics to table.
          </p>
        </div>

        {/* Timeline Navigation - Mobile Scrollable */}
        <div className={`mb-8 sm:mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-start sm:justify-center gap-0 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {stages.map((stage, i) => {
              const StageIcon = stage.icon;
              const isActive = i === activeStage;
              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => setActiveStage(i)}
                    className={`flex flex-col items-center gap-2 px-3 sm:px-6 py-3 rounded-xl transition-all duration-300 min-w-[90px] snap-center ${
                      isActive
                        ? 'bg-white/10 scale-105'
                        : 'hover:bg-white/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive ? `bg-gradient-to-br ${stage.color} shadow-lg shadow-black/40` : 'bg-white/5'
                    }`}>
                      <StageIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-gray-500' : 'text-gray-500/40'}`} />
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isActive ? 'text-gray-500' : 'text-gray-500/30'}`}>
                      {stage.title.split(' ').slice(0, 1)[0]}
                    </span>
                  </button>
                  {i < stages.length - 1 && (
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${i < activeStage ? 'text-ranch-terracotta' : 'text-gray-500/10'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detail */}
        <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Image Container */}
            <div className="relative rounded-2xl overflow-hidden group h-[250px] sm:h-[400px] lg:h-auto shadow-2xl">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <span className={`inline-flex items-center gap-2 ${current.bgColor} border ${current.borderColor} px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest ${current.textColor} backdrop-blur-md`}>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  Stage {activeStage + 1} of 5
                </span>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-ranch-terracotta text-xs sm:text-sm font-black uppercase tracking-[0.2em]">
                  {current.subtitle}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-600 mb-4">
                {current.title}
              </h3>
              <p className="text-gray-600/70 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                {current.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-auto">
                {current.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-white/5 border border-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="text-xl sm:text-2xl font-bold text-gray-600 font-mono leading-none">
                      {metric.value}
                    </div>
                    <div className="text-gray-600/40 text-[10px] sm:text-xs uppercase tracking-widest mt-2">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Mobile Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
                  disabled={activeStage === 0}
                  className="text-gray-600/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 py-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Prev
                </button>
                <div className="flex gap-1 sm:hidden">
                    {stages.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeStage ? 'bg-ranch-terracotta w-4' : 'bg-white/20'}`} />
                    ))}
                </div>
                <button
                  onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))}
                  disabled={activeStage === stages.length - 1}
                  className="text-ranch-terracotta hover:text-ranch-terracotta-light disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 py-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueChain;