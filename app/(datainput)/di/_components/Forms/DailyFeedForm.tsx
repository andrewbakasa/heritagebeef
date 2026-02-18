import React from 'react';
import { Wheat, Database } from 'lucide-react';

export const DailyFeedForm: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-ranch-cream-dark shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Wheat className="w-6 h-6 text-amber-600" />
        <h2 className="font-serif text-xl font-bold">Log Pen Delivery</h2>
      </div>
      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-ranch-slate uppercase mb-1 block">Target Pen</label>
          <select className="w-full p-3 bg-ranch-cream/20 border border-ranch-cream-dark rounded-xl font-bold text-ranch-charcoal">
            <option>Select Active Pen...</option>
            <option>Pen A-1 (45 Head)</option>
            <option>Pen B-2 (12 Head)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ranch-slate uppercase mb-1 block">Ingredient</label>
            <select className="w-full p-3 border border-ranch-cream-dark rounded-xl text-sm">
              <option>Cracked Corn</option>
              <option>Silage</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-ranch-slate uppercase mb-1 block">Amount (kg)</label>
            <input type="number" placeholder="0.00" className="w-full p-3 border border-ranch-cream-dark rounded-xl font-mono" />
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
          <Database className="w-4 h-4 text-blue-500 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            This entry will automatically deduct from <strong>Silo Inventory</strong> and update the pen s <strong>Days on Feed</strong>.
          </p>
        </div>
        <button className="w-full bg-ranch-charcoal text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all">
          Confirm & Log Feeding
        </button>
      </div>
    </div>
  );
};