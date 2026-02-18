import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Dna, Wheat, Factory, Truck, ShieldCheck, Leaf,
  ChevronDown, Check, ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: Dna,
    title: 'Genetics Program',
    tagline: 'Building Superior Herds',
    description: 'Our genomic-enhanced breeding program produces cattle with predictable performance traits. We offer semen sales, embryo transfer services, and breeding stock from our registered herd.',
    features: [
      'Genomic-enhanced EPD selection',
      'Embryo transfer & AI services',
      'Registered Angus & Hereford breeding stock',
      'Custom mating plans with genetic consultation',
      'Performance-tested bull sales twice annually',
    ],
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=500&q=80',
    color: 'bg-green-600',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  {
    icon: Wheat,
    title: 'Custom Feeding',
    tagline: 'Precision Nutrition Programs',
    description: 'State-of-the-art feedlot services with computer-controlled rations, individual animal tracking, and transparent cost reporting. We feed your cattle as if they were our own.',
    features: [
      'Custom ration formulation per pen',
      'Individual animal RFID tracking',
      'Weekly weight & health reports',
      'Commodity procurement at scale pricing',
      'Flexible marketing arrangements',
    ],
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&q=80',
    color: 'bg-amber-600',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  {
    icon: Factory,
    title: 'Processing Services',
    tagline: 'SADC Inspected Excellence',
    description: 'Our modern processing facility maintains the highest standards of food safety and humane handling. Full custom processing available for branded beef programs.',
    features: [
      'SADC-inspected facility',
      'Custom cut specifications',
      'Vacuum packaging & aging options',
      'Private label & branded programs',
      'Full traceability documentation',
    ],
    //image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80',
    image: 'https://unsplash.com/photos/a-butcher-is-standing-by-the-big-pieces-of-meat-in-slaughter-house-and-smiling-at-the-camera-wP_NjUyU304',
    color: 'bg-red-600',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  {
    icon: Truck,
    title: 'Wholesale Distribution',
    tagline: 'Farm to Fork Logistics',
    description: 'Temperature-controlled distribution network serving restaurants, retailers, and institutional buyers across 12 states with guaranteed freshness and on-time delivery.',
    features: [
      'Temperature-controlled fleet',
      'Next-day delivery in core markets',
      'Minimum order flexibility',
      'EDI & online ordering portal',
      'Dedicated account management',
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    tagline: 'Uncompromising Standards',
    description: 'Multi-point quality verification at every stage of production. Our QA team conducts over 50 daily checks ensuring consistent product excellence.',
    features: [
      'HACCP & SQF Level 3 certified',
      'Third-party audited annually',
      'Antibiotic-free & hormone-free programs',
      'Full DNA traceability system',
      'Customer satisfaction guarantee',
    ],
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500&q=80',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    icon: Leaf,
    title: 'Sustainability Practices',
    tagline: 'Stewards of the Land',
    description: 'Our commitment to environmental stewardship includes regenerative grazing, water conservation, and carbon sequestration programs that benefit both the land and our bottom line.',
    features: [
      'Regenerative grazing on 4,800 acres',
      'Solar-powered facility operations',
      'Water recycling & conservation systems',
      'Carbon credit program participation',
      'Biodiversity habitat preservation',
    ],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
];

const ServicesSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [expandedService, setExpandedService] = useState<number | null>(null);

  return (
    <section id="services" className="py-16 sm:py-24 bg-white relative">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            What We Offer
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ranch-charcoal mt-3 mb-4 leading-tight">
            Our Services
          </h2>
          <p className="text-ranch-slate max-w-2xl mx-auto text-base sm:text-lg">
            Comprehensive services spanning the entire beef value chain, designed to maximize quality and profitability.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isExpanded = expandedService === i;
            return (
              <div
                key={service.title}
                className={`group rounded-2xl border border-ranch-cream-dark overflow-hidden transition-all duration-500 hover:shadow-2xl active:scale-[0.98] lg:active:scale-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${isExpanded ? 'ring-2 ring-ranch-forest/20 shadow-lg' : ''}`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                {/* Image & Header Overlay */}
                <div 
                   className="relative h-44 sm:h-48 overflow-hidden cursor-pointer"
                   onClick={() => setExpandedService(isExpanded ? null : i)}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 sm:group-hover:scale-110"
                  />
                  {/* Improved contrast overlay for mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white leading-tight">{service.title}</h3>
                      <p className="text-white/80 text-[10px] sm:text-xs uppercase tracking-wider font-medium">{service.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <p className="text-ranch-slate text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <button
                    onClick={() => setExpandedService(isExpanded ? null : i)}
                    className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 py-2 sm:py-0 text-ranch-forest font-bold text-xs sm:text-sm hover:text-ranch-forest-light transition-colors uppercase tracking-widest"
                  >
                    <span>{isExpanded ? 'Show Less' : 'View Features'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] mt-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`${service.lightColor} rounded-xl p-4 border border-${service.textColor.split('-')[1]}-100`}>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm">
                            <Check className={`w-4 h-4 ${service.textColor} flex-shrink-0 mt-0.5`} />
                            <span className="text-ranch-charcoal font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 sm:mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-ranch-forest hover:bg-ranch-forest-light text-black px-8 py-5 rounded-xl text-sm sm:text-base font-black uppercase tracking-widest transition-all hover:shadow-2xl active:scale-95"
          >
            Get Service Details
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;