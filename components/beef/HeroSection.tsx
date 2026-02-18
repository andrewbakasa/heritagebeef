import React, { useEffect, useState } from 'react';
import { useCountUp } from '@/hooks/useScrollAnimation';
import { ArrowDown, TrendingUp, Beef, Truck, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Head Capacity', value: 2500, suffix: '+', icon: Beef },
  { label: 'Acres Managed', value: 4800, suffix: '', icon: TrendingUp },
  { label: 'Distribution Points', value: 32, suffix: '+', icon: Truck },
  { label: 'Quality Score', value: 98, suffix: '%', icon: ShieldCheck },
];

const HeroSection: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80"
          alt="Cattle ranch at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ranch-forest-dark/90 via-ranch-forest-dark/70 to-ranch-forest-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ranch-forest-dark/80 via-transparent to-transparent" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-ranch-wheat/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `fade-in ${2 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div>
            <div
              className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <span className="inline-flex items-center gap-2 bg-white border border-ranch-terracotta/40 text-ranch-terracotta-light px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-ranch-terracotta rounded-full animate-pulse" />
                Integrated Beef Value Chain
              </span>
            </div>

            <h1
              className={`font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-150 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              From Pasture
              <br />
              <span className="text-ranch-wheat">to Premium</span>
              <br />
              Beef
            </h1>

            <p
              className={`text-lg sm:text-xl text-white/70 max-w-xl mb-8 leading-relaxed transition-all duration-700 delay-300 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              A vertically integrated operation delivering exceptional quality through
              complete supply chain control — from genetics and feeding to processing
              and distribution.
            </p>

            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-500 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                onClick={() => scrollToSection('value-chain')}
                className="bg-ranch-terracotta hover:bg-ranch-terracotta-dark text-white px-8 py-4 rounded-xl text-base font-semibold transition-all hover:shadow-xl hover:shadow-ranch-terracotta/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Our Value Chain
              </button>
              <button
                onClick={() => scrollToSection('investment')}
                className="border-2 border-white/30 hover:border-ranch-wheat text-white hover:text-ranch-wheat px-8 py-4 rounded-xl text-base font-semibold transition-all hover:bg-white/5"
              >
                Investment Opportunities
              </button>
            </div>
          </div>

          {/* Right - Stats Cards */}
          <div
            className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 150} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection('value-chain')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors animate-bounce"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </section>
  );
};

const StatCard: React.FC<{ stat: typeof stats[0]; delay: number }> = ({ stat, delay }) => {
  const { count, ref } = useCountUp(stat.value, 2000);
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-ranch-wheat/30 transition-all duration-500 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-ranch-terracotta/20 rounded-lg flex items-center justify-center group-hover:bg-ranch-terracotta/30 transition-colors">
          <Icon className="w-5 h-5 text-ranch-terracotta-light" />
        </div>
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-white font-mono">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-white/50 text-sm mt-1">{stat.label}</div>
    </div>
  );
};

export default HeroSection;
