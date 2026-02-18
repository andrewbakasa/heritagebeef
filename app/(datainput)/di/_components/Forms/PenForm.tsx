'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LayoutGrid, Hash, Users, Utensils, Calendar, Save, X, Loader2 } from 'lucide-react';

const penSchema = z.object({
  penNumber: z.string().min(1, "Pen identifier is required"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  status: z.enum(["STARTING", "GROWING", "FINISHING", "QUARANTINE"]),
  feedStartDate: z.string().optional(),
});

type PenFormData = z.infer<typeof penSchema>;

interface PenFormProps {
  initialId?: string | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const PenForm: React.FC<PenFormProps> = ({ initialId, onCancel, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PenFormData>({
    resolver: zodResolver(penSchema),
    defaultValues: {
      capacity: 50,
      status: "STARTING",
      feedStartDate: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    if (initialId) {
      const fetchPen = async () => {
        setIsFetching(true);
        try {
          const response = await fetch(`/di/api/pens/${initialId}`);
          if (!response.ok) throw new Error();
          const data = await response.json();
          
          reset({
            penNumber: data.penNumber,
            capacity: data.capacity,
            status: data.status,
            feedStartDate: data.feedStartDate ? new Date(data.feedStartDate).toISOString().split('T')[0] : "",
          });
        } catch (err) {
          console.error("Error loading pen:", err);
        } finally {
          setIsFetching(false);
        }
      };
      fetchPen();
    }
  }, [initialId, reset]);

  const onSubmit = async (data: PenFormData) => {
    setIsSubmitting(true);
    const method = initialId ? 'PATCH' : 'POST';
    const url = initialId ? `/di/api/pens/${initialId}` : '/di/api/pens';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save pen');
      
      if (onSuccess) onSuccess();
      if (!initialId) reset();
    } catch (error) {
      alert("Error saving pen configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) return (
    <div className="p-10 lg:p-20 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#4A6741]" />
      <p className="mt-2 text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">Loading Configuration...</p>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto bg-white lg:rounded-2xl border-x lg:border border-slate-200 shadow-xl overflow-hidden">
      {/* Header - Optimized for mobile tap area */}
      <div className="bg-[#1A1A1A] px-5 py-6 lg:p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#4A6741] rounded-xl text-[#E6C9A2]">
            <LayoutGrid className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold tracking-tight">
              {initialId ? 'Update Pen' : 'New Pen'}
            </h2>
            <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest leading-none mt-1">Housing & Logistics</p>
          </div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
            <X className="w-6 h-6 text-white/50" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Section 1: Physical Parameters */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Hash className="w-3.5 h-3.5 text-[#4A6741]" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase ml-1">Pen Identifier</label>
                <input 
                  {...register('penNumber')}
                  placeholder="e.g. NORTH-01" 
                  className={`w-full p-3 bg-slate-50 border ${errors.penNumber ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm font-mono font-bold focus:bg-white focus:ring-2 focus:ring-[#4A6741]/20 outline-none transition-all`}
                />
                {errors.penNumber && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.penNumber.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase ml-1">Max Capacity (Head)</label>
                <div className="relative">
                  <input 
                    type="number"
                    {...register('capacity')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white outline-none transition-all"
                  />
                  <Users className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Operational Status */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Utensils className="w-3.5 h-3.5 text-[#4A6741]" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed & Status</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase ml-1">Pen Status</label>
                <div className="relative">
                  <select 
                    {...register('status')}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold appearance-none cursor-pointer focus:border-[#4A6741] outline-none transition-all"
                  >
                    <option value="STARTING">Starting / Reception</option>
                    <option value="GROWING">Growing / Backgrounding</option>
                    <option value="FINISHING">Finishing</option>
                    <option value="QUARANTINE">Quarantine / Sick Pen</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l pl-3">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Cycle Reset</span>
                </div>
                <input 
                  type="date"
                  {...register('feedStartDate')}
                  className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <p className="text-[10px] text-indigo-500 font-medium leading-relaxed italic">
                  Note: Updating this date resets the Days on Feed calculation for this entire pen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Stacked on mobile */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col-reverse lg:flex-row items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel || (() => reset())}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            {onCancel ? 'Cancel Changes' : 'Discard'}
          </button>
          <button 
            type="submit" 
            disabled={!!isSubmitting || (initialId ? !isDirty : false)}
            className="w-full lg:w-auto flex items-center justify-center gap-3 bg-[#4A6741] text-[#E6C9A2] px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-[#4A6741]/20 hover:bg-[#3d5535] disabled:opacity-50 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isSubmitting ? 'Processing...' : initialId ? 'Update Pen Configuration' : 'Create Pen Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { LayoutGrid, Hash, Users, Utensils, Calendar, Save, X, Loader2 } from 'lucide-react';

// const penSchema = z.object({
//   penNumber: z.string().min(1, "Pen identifier is required"),
//   capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
//   status: z.enum(["STARTING", "GROWING", "FINISHING", "QUARANTINE"]),
//   feedStartDate: z.string().optional(),
// });

// type PenFormData = z.infer<typeof penSchema>;

// interface PenFormProps {
//   initialId?: string | null;
//   onCancel?: () => void;
//   onSuccess?: () => void;
// }

// export const PenForm: React.FC<PenFormProps> = ({ initialId, onCancel, onSuccess }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);

//   const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PenFormData>({
//     resolver: zodResolver(penSchema),
//     defaultValues: {
//       capacity: 50,
//       status: "STARTING",
//       feedStartDate: new Date().toISOString().split('T')[0],
//     }
//   });

//   // 1. Fetch existing Pen data if editing
//   useEffect(() => {
//     if (initialId) {
//       const fetchPen = async () => {
//         setIsFetching(true);
//         try {
//           const response = await fetch(`/di/api/pens/${initialId}`);
//           if (!response.ok) throw new Error();
//           const data = await response.json();
          
//           reset({
//             penNumber: data.penNumber,
//             capacity: data.capacity,
//             status: data.status,
//             feedStartDate: data.feedStartDate ? new Date(data.feedStartDate).toISOString().split('T')[0] : "",
//           });
//         } catch (err) {
//           console.error("Error loading pen:", err);
//         } finally {
//           setIsFetching(false);
//         }
//       };
//       fetchPen();
//     }
//   }, [initialId, reset]);

//   const onSubmit = async (data: PenFormData) => {
//     setIsSubmitting(true);
//     const method = initialId ? 'PATCH' : 'POST';
//     const url = initialId ? `/di/api/pens/${initialId}` : '/di/api/pens';

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) throw new Error('Failed to save pen');
      
//       if (onSuccess) onSuccess();
//       if (!initialId) reset();
//     } catch (error) {
//       alert("Error saving pen configuration.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isFetching) return (
//     <div className="p-20 flex flex-col items-center justify-center">
//       <Loader2 className="w-8 h-8 animate-spin text-ranch-forest" />
//       <p className="mt-2 text-slate-500 text-xs font-bold uppercase tracking-wider">Loading Pen Configuration...</p>
//     </div>
//   );

//   return (
//     <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="bg-[#1A1A1A] p-5 text-white flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-[#4A6741] rounded-lg text-[#E6C9A2]">
//             <LayoutGrid className="w-6 h-6" />
//           </div>
//           <div>
//             <h2 className="text-xl font-bold tracking-tight">
//                 {initialId ? `Edit Pen: ${initialId}` : 'Pen Configuration'}
//             </h2>
//             <p className="text-xs text-white/70">Define housing capacity and feeding parameters</p>
//           </div>
//         </div>
//         {onCancel && (
//             <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
//                 <X className="w-5 h-5 text-white/50" />
//             </button>
//         )}
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
//           {/* Section 1: Physical Parameters */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
//               <Hash className="w-4 h-4 text-[#4A6741]" />
//               <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Identification</h3>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pen Number / ID</label>
//                 <input 
//                   {...register('penNumber')}
//                   placeholder="e.g. North-01" 
//                   className={`w-full p-2.5 bg-slate-50 border ${errors.penNumber ? 'border-red-500' : 'border-slate-200'} rounded-lg text-sm font-mono font-bold`}
//                 />
//                 {errors.penNumber && <p className="text-red-500 text-[10px] mt-1">{errors.penNumber.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Max Headcount Capacity</label>
//                 <div className="relative">
//                   <input 
//                     type="number"
//                     {...register('capacity')}
//                     className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                   />
//                   <Users className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section 2: Operational Status */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
//               <Utensils className="w-4 h-4 text-[#4A6741]" />
//               <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Feed & Status</h3>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Current Pen Status</label>
//                 <select 
//                   {...register('status')}
//                   className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none cursor-pointer"
//                 >
//                   <option value="STARTING">Starting / Reception</option>
//                   <option value="GROWING">Growing / Backgrounding</option>
//                   <option value="FINISHING">Finishing</option>
//                   <option value="QUARANTINE">Quarantine / Sick Pen</option>
//                 </select>
//               </div>

//               <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-3">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4 text-indigo-600" />
//                   <span className="text-xs font-bold text-indigo-900 uppercase">Feed Start Date</span>
//                 </div>
//                 <input 
//                   type="date"
//                   {...register('feedStartDate')}
//                   className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-sm text-indigo-900"
//                 />
//                 <p className="text-[10px] text-indigo-600 italic leading-tight">
//                   This date resets Days on Feed for the pen headcount.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
//           <button 
//             type="button" 
//             onClick={onCancel || (() => reset())}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
//           >
//             <X className="w-4 h-4" /> {onCancel ? 'Cancel' : 'Discard'}
//           </button>
//           <button 
//             type="submit" 
//              disabled={!!isSubmitting || (initialId ? !isDirty : false)}
//             className="flex items-center gap-2 bg-[#4A6741] text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-slate-900 disabled:opacity-70 transition-all"
//           >
//             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#E6C9A2]" />}
//             {isSubmitting ? 'Saving...' : initialId ? 'Update Pen' : 'Register Pen'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
