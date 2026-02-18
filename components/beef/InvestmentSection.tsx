import React, { useState, useMemo } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Calculator, TrendingUp, DollarSign, PieChart,
  ArrowRight, Check, Star, Crown, Gem
} from 'lucide-react';

const partnershipTiers = [
  {
    name: 'Entry', // Changed from Associate
    icon: Star,
    investment: '$1k - $5K',
    color: 'border-ranch-earth',
    bgColor: 'bg-ranch-earth/5',
    iconColor: 'text-ranch-earth',
    features: [
      'Yearly performance reports',
      '15-22% projected annual ROI',
    ],
    projectedROI: '15-22%',
    popular: false,
  },
  {
    name: 'Growth', // Changed from Associate
    icon: Star,
    investment: '$5k - $15K',
    color: 'border-ranch-earth',
    bgColor: 'bg-ranch-earth/5',
    iconColor: 'text-ranch-earth',
    features: [
      'Half-Yearly performance reports',
      '15-22% projected annual ROI',
    ],
    projectedROI: '15-22%',
    popular: false,
  },
  {
    name: 'Associate',
    icon: Star,
    investment: '$15k - $50K',
    color: 'border-ranch-earth',
    bgColor: 'bg-ranch-earth/5',
    iconColor: 'text-ranch-earth',
    features: [
      'Quarterly performance reports',
      'Annual ranch tour & review',
      'Priority custom feeding slots',
      '15-22% projected annual ROI',
    ],
    projectedROI: '15-22%',
    popular: false,
  },
  {
    name: 'Premier',
    icon: Crown,
    investment: '$50K - $200K',
    color: 'border-ranch-terracotta',
    bgColor: 'bg-ranch-terracotta/5',
    iconColor: 'text-ranch-terracotta',
    features: [
      'Monthly detailed analytics',
      'Board observer seat',
      'Dedicated herd allocation',
      'Revenue share on branded products',
      'Facility expansion participation',
      '22-28% projected annual ROI',
    ],
    projectedROI: '22-28%',
    popular: true,
  },
  {
    name: 'Strategic',
    icon: Gem,
    investment: '$200K+',
    color: 'border-ranch-forest',
    bgColor: 'bg-ranch-forest/5',
    iconColor: 'text-ranch-forest',
    features: [
      'Real-time dashboard access',
      'Board voting membership',
      'Equity stake in operations',
      'Joint venture opportunities',
      'International market access',
      'Tax-advantaged structure options',
      '22-32% projected annual ROI',
    ],
    projectedROI: '22-32%',
    popular: false,
  },
];



const projections = [
  { year: 'Year 1', revenue: 0.18, expenses: 0.12, profit: 0.06 },
  { year: 'Year 2', revenue: 0.50, expenses: 0.35, profit: 0.15 },
  { year: 'Year 3', revenue: 1.20, expenses: 0.80, profit: 0.40 },
  { year: 'Year 4', revenue: 2.80, expenses: 1.80, profit: 1.00 },
  { year: 'Year 5', revenue: 5.00, expenses: 3.20, profit: 1.80 },
];

const InvestmentSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  const [holdingYears, setHoldingYears] = useState(5);
  const [selectedTier, setSelectedTier] = useState(1);

  const roiCalc = useMemo(() => {
    const avgROI = investmentAmount < 500000 ? 0.10 : investmentAmount < 2000000 ? 0.15 : 0.185;
    const annualReturn = investmentAmount * avgROI;
    const totalReturn = annualReturn * holdingYears;
    const finalValue = investmentAmount + totalReturn;
    return { avgROI, annualReturn, totalReturn, finalValue };
  }, [investmentAmount, holdingYears]);

  return (
    <section id="investment" className="py-16 sm:py-24 bg-ranch-charcoal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-ranch-terracotta/5 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-ranch-forest/5 rounded-full blur-3xl opacity-20" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            Growth Opportunity
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-500 mt-3 mb-4 leading-tight">
            Investment & Partnership
          </h2>
          <p className="text-gray-500/60 max-w-2xl mx-auto text-base sm:text-lg px-2">
            Join a proven agricultural enterprise with strong fundamentals and multiple revenue streams across the value chain.
          </p>
        </div>

        {/* Financial Projections Chart */}
        <div className={`mb-12 sm:mb-20 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-500 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-ranch-wheat" />
              5-Year Projections
            </h3>
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg w-fit self-center sm:self-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-200 rounded-full" />
                <span className="text-gray-500/40 text-[10px] uppercase font-black tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-gray-500/40 text-[10px] uppercase font-black tracking-widest">Net Profit</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Scroll Container */}
          <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide sm:overflow-visible">
            <div className="grid grid-cols-5 gap-3 sm:gap-6 min-w-[500px] sm:min-w-0">
              {projections.map((proj, i) => {
                const maxRevenue = 5;
                const revenueHeight = (proj.revenue / maxRevenue) * 100;
                const profitHeight = (proj.profit / maxRevenue) * 100;
                return (
                  <div key={proj.year} className="text-center">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 sm:p-4 h-[200px] sm:h-[250px] flex flex-col justify-end relative overflow-hidden group">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-green-200 transition-all duration-1000 ease-out"
                        style={{ height: isVisible ? `${revenueHeight}%` : '0%', transitionDelay: `${i * 100}ms` }}
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-yellow-500 transition-all duration-1000 ease-out rounded-t-lg"
                        style={{ height: isVisible ? `${profitHeight}%` : '0%', transitionDelay: `${i * 100 + 300}ms` }}
                      />
                      <div className="relative z-10 flex flex-col gap-1">
                        <div className="text-sm sm:text-xl font-bold text-gray-500 font-mono leading-none">${proj.revenue}M</div>
                        <div className="text-ranch-wheat text-[10px] sm:text-sm font-mono font-bold">${proj.profit}M</div>
                      </div>
                    </div>
                    <div className="mt-4 text-gray-500/40 text-[10px] sm:text-xs font-black uppercase tracking-widest">{proj.year}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className={`mb-16 sm:mb-24 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-12 backdrop-blur-md shadow-2xl">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-500 mb-10 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-ranch-terracotta" />
              ROI Calculator
            </h3>

           <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            {/* Inputs */}
            <div className="space-y-10">
              {/* Initial Investment Slider */}
              <div className="group">
                <div className="flex justify-between items-end mb-6">
                  <label className="text-gray-500/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Initial Investment</label>
                  <span className="text-gray-500 font-mono text-xl sm:text-2xl font-bold">${investmentAmount.toLocaleString()}</span>
                </div>
                
                <div className="relative h-6 flex items-center">
                  {/* Ruled Line Background */}
                  <div 
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, #6b7280, #6b7280 1px, transparent 1px, transparent 10%)',
                      maskImage: 'linear-gradient(to bottom, black 2px, transparent 2px, transparent 14px, black 14px)'
                    }}
                  />
                  <input
                    type="range"
                    min={100000}
                    max={5000000}
                    step={50000}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="relative z-10 w-full h-1.5 bg-gray-500/10 rounded-full appearance-none cursor-pointer accent-ranch-terracotta"
                  />
                </div>
                
                <div className="flex justify-between text-gray-500/20 text-[10px] mt-4 font-black tracking-widest">
                  <span>$100K</span>
                  <div className="flex gap-4">
                    {/* Visual mid-points if needed */}
                  </div>
                  <span>$5M</span>
                </div>
              </div>

              {/* Holding Period Slider */}
              <div className="group">
                <div className="flex justify-between items-end mb-6">
                  <label className="text-gray-500/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Holding Period</label>
                  <span className="text-gray-500 font-mono text-xl sm:text-2xl font-bold">{holdingYears} Years</span>
                </div>
                
                <div className="relative h-6 flex items-center">
                  {/* Discrete Ruled Lines for Years (10 marks) */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-[1px] pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-[1px] h-3 bg-gray-500/30" />
                    ))}
                  </div>
                  
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={holdingYears}
                    onChange={(e) => setHoldingYears(Number(e.target.value))}
                    className="relative z-10 w-full h-1.5 bg-gray-500/10 rounded-full appearance-none cursor-pointer accent-ranch-terracotta"
                  />
                </div>
                
                <div className="flex justify-between text-gray-500/20 text-[10px] mt-4 font-black">
                  <span>1 YR</span>
                  <span>10 YRS</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: 'Annual Return', val: `$${(roiCalc.annualReturn / 1000).toFixed(0)}K`, color: 'text-gray-500' },
                { label: 'Avg. ROI', val: `${(roiCalc.avgROI * 100).toFixed(1)}%`, color: 'text-ranch-wheat' },
                { label: 'Total Return', val: `$${(roiCalc.totalReturn / 1000).toFixed(0)}K`, color: 'text-gray-500' },
                { label: 'Final Value', val: `$${(roiCalc.finalValue / 1000000).toFixed(2)}M`, color: 'text-ranch-terracotta', highlight: true }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`border rounded-2xl p-5 sm:p-6 flex flex-col justify-center transition-all ${
                    item.highlight 
                      ? 'bg-ranch-terracotta/10 border-ranch-terracotta/30 ring-1 ring-ranch-terracotta/20 shadow-lg shadow-ranch-terracotta/5' 
                      : 'bg-gray-500/5 border-gray-500/5'
                  }`}
                >
                  <div className="text-[9px] sm:text-[10px] text-gray-500/40 uppercase font-black tracking-[0.2em] mb-2">{item.label}</div>
                  <div className={`text-xl sm:text-2xl font-bold font-mono ${item.color}`}>
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
            <div className="mt-12 flex items-center gap-4 p-4 rounded-xl bg-ranch-forest/5 border border-ranch-forest/10">
              <PieChart className="w-5 h-5 text-ranch-forest flex-shrink-0" />
              <p className="text-gray-500/40 text-[10px] sm:text-xs italic leading-relaxed">
                Note: Projections are based on historical yield performance and vertically integrated operational efficiencies. Market conditions may affect final outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Tiers */}
        <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-10 sm:mb-12">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-gray-500 mb-4">
              Partnership Tiers
            </h3>
            <div className="w-16 h-1 bg-ranch-terracotta mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {partnershipTiers.map((tier, i) => {
              const Icon = tier.icon;
              const isActive = selectedTier === i;
              return (
                <div
                  key={tier.name}
                  onClick={() => setSelectedTier(i)}
                  className={`group relative rounded-3xl border-2 p-6 sm:p-10 cursor-pointer transition-all duration-500 flex flex-col ${
                    isActive
                      ? `${tier.color} ${tier.bgColor} shadow-2xl scale-[1.02] sm:scale-105 z-20`
                      : 'border-text-gray-500/5 bg-text-gray-500/[0.01] hover:bg-text-gray-500/5 grayscale'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ranch-terracotta text-black text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-xl">
                      Elite Status
                    </div>
                  )}
                  
                  <div className="flex items-center gap-5 mb-8">
                    <div className={`p-4 rounded-2xl transition-colors ${isActive ? 'bg-text-gray-500/10' : 'bg-text-gray-500/5'}`}>
                      <Icon className={`w-7 h-7 ${isActive ? tier.iconColor : 'text-gray-500/20'}`} />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-gray-500 leading-tight">{tier.name}</h4>
                      <div className="text-ranch-wheat font-mono font-bold text-sm tracking-tight mt-1">
                        {tier.investment}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-500/70 leading-snug">
                        <Check className="w-4 h-4 text-ranch-forest flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 ${
                      isActive
                        ? 'bg-ranch-terracotta text-black shadow-lg hover:shadow-ranch-terracotta/20 hover:-translate-y-1'
                        : 'bg-text-gray-500/5 text-gray-500 hover:bg-text-gray-500/10'
                    }`}
                  >
                    Select Tier
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;