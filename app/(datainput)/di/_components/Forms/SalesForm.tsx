import React, { useState } from 'react';
import { Gavel, Beef, Truck, Users } from 'lucide-react';

const AggregatedSaleForm = () => {
  const [saleType, setSaleType] = useState<'LIVE' | 'CARCASS'>('LIVE');
  const [isAggregate, setIsAggregate] = useState(true);

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-ranch-forest/20 shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-ranch-charcoal">Market Dispatch</h3>
          <p className="text-sm text-ranch-slate">Finalize live sale or slaughterhouse records</p>
        </div>
        
        {/* Toggle Live vs Carcass */}
        <div className="flex p-1 bg-ranch-cream/50 rounded-xl border border-ranch-cream-dark">
          <button 
            onClick={() => setSaleType('LIVE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${saleType === 'LIVE' ? 'bg-white shadow-sm text-ranch-forest' : 'text-ranch-slate'}`}
          >
            <Truck className="w-4 h-4" /> Live Sale
          </button>
          <button 
            onClick={() => setSaleType('CARCASS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${saleType === 'CARCASS' ? 'bg-white shadow-sm text-ranch-terracotta' : 'text-ranch-slate'}`}
          >
            <Beef className="w-4 h-4" /> Carcass (Killed)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-1 space-y-4">
           <div className="p-4 bg-ranch-cream/30 rounded-xl border border-ranch-cream-dark">
             <label className="text-[10px] font-bold text-ranch-slate uppercase mb-2 block">Source Selection</label>
             <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={isAggregate} onChange={() => setIsAggregate(true)} className="text-ranch-forest" />
                  <span className="text-sm font-medium">Aggregate Pen (Batch)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!isAggregate} onChange={() => setIsAggregate(false)} className="text-ranch-forest" />
                  <span className="text-sm font-medium">Individual Tags</span>
                </label>
             </div>
             
             {isAggregate ? (
               <select className="w-full mt-4 p-2 bg-white border border-ranch-cream-dark rounded-lg text-sm">
                 <option>Select Pen (e.g. A-1 - 25 Head)</option>
                 <option>Select Pen (e.g. B-1 - 20 Head)</option>
               </select>
             ) : (
               <textarea className="w-full mt-4 p-2 bg-white border border-ranch-cream-dark rounded-lg text-sm font-mono" placeholder="Enter tags: TAG-01, TAG-02..." rows={3} />
             )}
           </div>
        </div>

        {/* Financial Area */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-ranch-charcoal">Buyer Name</label>
            <input type="text" className="w-full bg-ranch-cream/10 border border-ranch-cream-dark rounded-lg p-2.5 text-sm" placeholder="e.g. Regional Packers Ltd" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-ranch-charcoal">Total Batch Weight (kg)</label>
            <input type="number" className="w-full bg-ranch-cream/10 border border-ranch-cream-dark rounded-lg p-2.5 text-sm font-mono" placeholder={saleType === 'LIVE' ? "Live weight" : "Hanging weight"} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-ranch-charcoal">Price per KG ($)</label>
            <input type="number" step="0.01" className="w-full bg-ranch-cream/10 border border-ranch-cream-dark rounded-lg p-2.5 text-sm font-mono" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-ranch-charcoal">Total Gross Revenue ($)</label>
            <input type="number" className="w-full bg-ranch-forest/5 border border-ranch-forest/20 rounded-lg p-2.5 text-sm font-bold text-ranch-forest" readOnly placeholder="Auto-calculated" />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-ranch-cream-dark flex items-center justify-between">
        <div className="text-xs text-ranch-slate italic max-w-md">
          * Saving this will mark all associated cattle as Sold and remove them from their current pens.
        </div>
        <button className="bg-ranch-charcoal text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all">
          <Gavel className="w-4 h-4 text-amber-400" /> Confirm & Post Transaction
        </button>
      </div>
    </div>
  );
};

export default AggregatedSaleForm;