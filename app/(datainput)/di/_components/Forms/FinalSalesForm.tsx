import React, { useState } from 'react';
import { Gavel, Beef, ShoppingCart } from 'lucide-react';

export const FinalSaleForm: React.FC = () => {
  const [mode, setMode] = useState<'LIVE' | 'CARCASS'>('LIVE');

  return (
    <div className="max-w-4xl mx-auto bg-ranch-charcoal text-white rounded-3xl p-8 shadow-xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold">Market Dispatch</h2>
          <p className="text-white/50 text-xs">Close cattle records and calculate ROI</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setMode('LIVE')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${mode === 'LIVE' ? 'bg-white text-ranch-charcoal' : 'text-white/40'}`}
          >Live Weight</button>
          <button 
             onClick={() => setMode('CARCASS')}
             className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${mode === 'CARCASS' ? 'bg-white text-ranch-charcoal' : 'text-white/40'}`}
          >Carcass Sale</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <input type="text" placeholder="Buyer / Packing Plant" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-ranch-wheat" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Final KG" className="bg-white/5 border border-white/10 p-3 rounded-xl font-mono" />
            <input type="number" placeholder="Price per KG" className="bg-white/5 border border-white/10 p-3 rounded-xl font-mono" />
          </div>
        </div>
        <div className="bg-ranch-forest/20 p-6 rounded-2xl border border-ranch-forest/40">
           <h3 className="text-xs font-bold text-ranch-wheat mb-4 flex items-center gap-2">
             <ShoppingCart className="w-3 h-3" /> Financial Summary
           </h3>
           <div className="space-y-2">
             <div className="flex justify-between text-sm"><span className="opacity-50">Gross Revenue:</span><span>$0.00</span></div>
             <div className="flex justify-between text-sm"><span className="opacity-50">Est. Feed Cost:</span><span>$0.00</span></div>
             <div className="flex justify-between font-bold border-t border-white/10 pt-2 mt-2"><span>Net Profit:</span><span className="text-green-400">+$0.00</span></div>
           </div>
        </div>
      </div>
      <button className="w-full mt-8 bg-ranch-wheat text-ranch-charcoal py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all">
        Finalize Transaction
      </button>
    </div>
  );
};