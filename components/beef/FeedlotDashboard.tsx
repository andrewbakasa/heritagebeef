import React, { useState } from 'react';
import { useScrollAnimation, useCountUp } from '@/hooks/useScrollAnimation';
import {
  BarChart3, TrendingUp, Thermometer, Droplets,
  Scale, Clock, Leaf, CheckCircle2,
  Activity, Wheat, ChevronRight
} from 'lucide-react';

const LB_TO_KG = 0.453592;

const feedPrograms = [
  { name: 'Starter Ration', days: '1-30', protein: '14.5%', energy: '1.15 NEg', color: 'bg-green-500' },
  { name: 'Grower Ration', days: '31-90', protein: '13.2%', energy: '1.25 NEg', color: 'bg-amber-500' },
  { name: 'Finisher Ration', days: '91-150', protein: '12.0%', energy: '1.40 NEg', color: 'bg-red-500' },
];

const penData = [
  { pen: 'A-1', head: 25, avgWeight: 1180, daysOnFeed: 142, adg: 3.9, status: 'finishing' },
  { pen: 'A-2', head: 24, avgWeight: 1050, daysOnFeed: 98, adg: 3.7, status: 'growing' },
  { pen: 'A-3', head: 24, avgWeight: 890, daysOnFeed: 52, adg: 4.1, status: 'growing' },
  { pen: 'B-1', head: 25, avgWeight: 1220, daysOnFeed: 148, adg: 3.6, status: 'market-ready' },
  { pen: 'B-2', head: 20, avgWeight: 720, daysOnFeed: 28, adg: 4.3, status: 'starting' },
  { pen: 'B-3', head: 25, avgWeight: 980, daysOnFeed: 85, adg: 3.8, status: 'growing' },
];

const statusColors: Record<string, string> = {
  'starting': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'growing': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'finishing': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'market-ready': 'bg-green-500/20 text-green-400 border-green-500/30',
};

const FeedlotDashboard: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [selectedPen, setSelectedPen] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Updated: Capacity and counts adjusted for a 2,500-head operation
  const { count: capacityCount, ref: capRef } = useCountUp(150, 2000); 
  const { count: adgCount, ref: adgRef } = useCountUp(38, 2000); 
  const { count: fcCount, ref: fcRef } = useCountUp(58, 2000);

  const filteredPens = filterStatus === 'all'
    ? penData
    : penData.filter(p => p.status === filterStatus);

  return (
    <section id="operations" className="py-12 sm:py-24 bg-ranch-cream relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            Real-Time Operations
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ranch-charcoal mt-3 mb-4">
            Feedlot Dashboard
          </h2>
          <p className="text-ranch-slate max-w-2xl mx-auto text-base sm:text-lg px-2">
            {/* Updated: Capacity text changed to 2,500 */}
            Live operational data from our 2,500-head capacity feedlot, featuring precision feeding technology and health monitoring.
          </p>
        </div>

        {/* KPI Cards */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { ref: capRef, icon: BarChart3, label: 'Current Head', value: capacityCount.toLocaleString(), unit: '', sub: `${capacityCount*100/2500}% capacity`, color: 'bg-ranch-forest/10', text: 'text-ranch-forest' },
            { ref: adgRef, icon: Scale, label: 'Avg. ADG', value: ((adgCount / 10) * LB_TO_KG).toFixed(2), unit: 'kg', sub: '+0.1 vs last month', color: 'bg-ranch-terracotta/10', text: 'text-ranch-terracotta' },
            { ref: fcRef, icon: Leaf, label: 'Feed Conv.', value: (fcCount / 10).toFixed(1), unit: ':1', sub: 'Industry leading', color: 'bg-ranch-wheat/20', text: 'text-ranch-earth' },
            { ref: null, icon: Activity, label: 'Health Score', value: '98.4', unit: '%', sub: 'Excellent', color: 'bg-blue-50', text: 'text-blue-600' }
          ].map((kpi, i) => (
            <div key={i} ref={kpi.ref} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-ranch-cream-dark">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${kpi.text}`} />
                </div>
                <span className="text-ranch-slate text-xs sm:text-sm font-medium">{kpi.label}</span>
              </div>
              <div className="text-xl sm:text-3xl font-bold text-ranch-charcoal font-mono leading-none">
                {kpi.value}<span className="text-xs sm:text-base font-normal text-ranch-slate ml-1">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-green-600 text-[10px] sm:text-xs font-semibold">{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feed Programs */}
          <div className={`lg:col-span-1 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-ranch-cream-dark h-full">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-ranch-charcoal mb-6 flex items-center gap-2">
                <Wheat className="w-5 h-5 text-ranch-terracotta" />
                Feed Programs
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {feedPrograms.map((program) => (
                  <div key={program.name} className="bg-ranch-cream/50 rounded-xl p-3 sm:p-4 border border-ranch-cream-dark">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${program.color}`} />
                      <span className="font-bold text-ranch-charcoal text-xs sm:text-sm">{program.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
                      <div>
                        <span className="text-ranch-slate block">Days</span>
                        <div className="font-mono font-bold text-ranch-charcoal">{program.days}</div>
                      </div>
                      <div>
                        <span className="text-ranch-slate block">Protein</span>
                        <div className="font-mono font-bold text-ranch-charcoal">{program.protein}</div>
                      </div>
                      <div>
                        <span className="text-ranch-slate block">Energy</span>
                        <div className="font-mono font-bold text-ranch-charcoal">{program.energy}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Environmental Monitoring */}
              <div className="mt-6 pt-6 border-t border-ranch-cream-dark">
                <h4 className="text-xs sm:text-sm font-bold text-ranch-charcoal mb-4 uppercase tracking-wider">Environmental</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { icon: Thermometer, label: 'Temp', val: '72°F' },
                    { icon: Droplets, label: 'Humidity', val: '45%' },
                    { icon: Clock, label: 'Next Feed', val: '2h 15m', alert: true }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-ranch-slate">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </div>
                      <span className={`font-mono font-bold ${item.alert ? 'text-ranch-terracotta' : 'text-ranch-charcoal'}`}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pen Status Monitor */}
          <div className={`lg:col-span-2 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-ranch-cream-dark">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-ranch-charcoal flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-ranch-terracotta" />
                  Pen Monitor
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                  {['all', 'starting', 'growing', 'finishing', 'market-ready'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all capitalize border ${
                        filterStatus === status
                          ? 'bg-ranch-forest text-green-500 border-ranch-forest'
                          : 'bg-white text-ranch-slate border-ranch-cream-dark hover:bg-ranch-cream'
                      }`}
                    >
                      {status === 'all' ? 'All Pens' : status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Improved Mobile UI */}
              <div className="block sm:hidden space-y-3">
                {filteredPens.map((pen) => (
                  <div 
                    key={pen.pen} 
                    onClick={() => setSelectedPen(selectedPen === pen.pen ? null : pen.pen)}
                    className={`p-4 rounded-xl border transition-all ${selectedPen === pen.pen ? 'bg-ranch-forest/5 border-ranch-forest/30' : 'bg-ranch-cream/20 border-ranch-cream-dark'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs text-ranch-slate font-bold uppercase tracking-tight">Pen</span>
                        <div className="text-lg font-mono font-bold text-ranch-charcoal">{pen.pen}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusColors[pen.status]}`}>
                        {pen.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-ranch-slate uppercase">Avg Weight</span>
                        <div className="font-mono text-sm font-bold">{(pen.avgWeight * LB_TO_KG).toLocaleString(undefined, {maximumFractionDigits: 0})} kg</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-ranch-slate uppercase">ADG</span>
                        <div className="font-mono text-sm font-bold">{(pen.adg * LB_TO_KG).toFixed(2)} kg</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-ranch-slate uppercase">Head Count</span>
                        <div className="font-mono text-sm font-bold">{pen.head}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-ranch-slate uppercase">Days on Feed</span>
                        <div className="font-mono text-sm font-bold">{pen.daysOnFeed}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View Table */}
              <div className="hidden sm:block overflow-x-auto rounded-lg border border-ranch-cream-dark">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-ranch-cream/30 border-b border-ranch-cream-dark">
                      {['Pen', 'Head', 'Avg Wgt (kg)', 'DOF', 'ADG (kg)', 'Status'].map(head => (
                        <th key={head} className="text-left text-[10px] font-bold text-ranch-slate uppercase tracking-wider py-3 px-4">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPens.map((pen) => (
                      <tr
                        key={pen.pen}
                        onClick={() => setSelectedPen(selectedPen === pen.pen ? null : pen.pen)}
                        className={`border-b border-ranch-cream/50 cursor-pointer transition-colors ${
                          selectedPen === pen.pen ? 'bg-ranch-forest/5' : 'hover:bg-ranch-cream/30'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-ranch-charcoal text-sm">{pen.pen}</td>
                        <td className="py-3 px-4 font-mono text-sm text-ranch-charcoal">{pen.head}</td>
                        <td className="py-3 px-4 font-mono text-sm text-ranch-charcoal">{(pen.avgWeight * LB_TO_KG).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        <td className="py-3 px-4 font-mono text-sm text-ranch-charcoal">{pen.daysOnFeed}</td>
                        <td className="py-3 px-4 font-mono text-sm text-ranch-charcoal">{(pen.adg * LB_TO_KG).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize whitespace-nowrap ${statusColors[pen.status]}`}>
                            {pen.status.replace('-', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Selected Pen Detail */}
              {selectedPen && (
                <div className="mt-6 pt-6 border-t border-ranch-cream-dark animate-in fade-in slide-in-from-top-2">
                  <div className="bg-ranch-forest/5 rounded-xl p-4 border border-ranch-forest/10">
                    <h4 className="font-bold text-ranch-charcoal mb-2 flex items-center justify-between">
                      <span>Pen {selectedPen} Details</span>
                      <button onClick={() => setSelectedPen(null)} className="text-ranch-slate hover:text-ranch-charcoal">✕</button>
                    </h4>
                    <p className="text-sm text-ranch-slate leading-relaxed">
                      {(() => {
                        const pen = penData.find(p => p.pen === selectedPen);
                        if (!pen) return '';
                        const projectedWeightLbs = pen.avgWeight + (pen.adg * (150 - pen.daysOnFeed));
                        const projectedWeightKg = projectedWeightLbs * LB_TO_KG;
                        return `Projected finish weight: ${Math.round(projectedWeightKg).toLocaleString()} kg. Estimated market date: ${
                          new Date(Date.now() + (150 - pen.daysOnFeed) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        }. Current feed cost: $${(pen.daysOnFeed * 3.2).toFixed(0)}/head.`;
                      })()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedlotDashboard;