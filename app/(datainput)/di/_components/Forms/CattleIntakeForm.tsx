'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Truck, Scale, Tag, ShieldCheck, User, 
  MapPin, Loader2, RefreshCw, Save, X, AlertCircle 
} from 'lucide-react';

// --- Types & Validation ---
const intakeSchema = z.object({
  sellerName: z.string().min(1, "Seller name is required"),
  purchasePricePerHead: z.coerce.number().min(0),
  purchaseDate: z.string(),
  vetName: z.string().optional(),
  movementDocRef: z.string().optional(),
  isInternal: z.boolean(),
  tagNumber: z.string().min(1, "Tag number is required"),
  penId: z.string().min(1, "Please select a pen location"),
  breed: z.string().optional(),
  gender: z.enum(["Steer", "Heifer", "Bull"]),
  entryWeight: z.coerce.number().positive("Weight must be greater than 0"),
  ageMonths: z.coerce.number().int().optional(),
});

type IntakeFormData = z.infer<typeof intakeSchema>;

interface PenOption {
  id: string;
  penNumber: string;
  headCount: number;
  capacity: number;
}

interface CattleFormProps {
  initialId?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CattleIntakeForm: React.FC<CattleFormProps> = ({ initialId, onCancel, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pens, setPens] = useState<PenOption[]>([]);
  const [isLoadingPens, setIsLoadingPens] = useState(true);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isDirty } 
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      purchaseDate: new Date().toISOString().split('T')[0],
      isInternal: false,
      gender: "Steer",
      penId: ""
    }
  });

  const fetchPens = useCallback(async () => {
    setIsLoadingPens(true);
    try {
      const response = await fetch('/di/api/pens');
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPens(data);
    } catch (err) {
      console.error("Failed to load pens");
    } finally {
      setIsLoadingPens(false);
    }
  }, []);

  useEffect(() => {
    fetchPens();
    if (initialId) {
      const loadRecord = async () => {
        setIsFetching(true);
        try {
          const response = await fetch(`/di/api/cattle/${initialId}`);
          const data = await response.json();
          reset({
            ...data,
            sellerName: data.source?.sellerName,
            purchasePricePerHead: data.source?.purchasePricePerHead,
            purchaseDate: data.source?.purchaseDate ? new Date(data.source.purchaseDate).toISOString().split('T')[0] : "",
            vetName: data.source?.vetName,
            movementDocRef: data.source?.movementDocRef,
            isInternal: data.source?.isInternal,
          });
        } catch (err) {
          console.error("Failed to fetch cattle record");
        } finally {
          setIsFetching(false);
        }
      };
      loadRecord();
    }
  }, [initialId, reset, fetchPens]);

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true);
    const endpoint = initialId ? `/di/api/cattle/${initialId}` : '/di/api/cattle';
    const method = initialId ? 'PATCH' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Submission failed');
      }

      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#4A6741]" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Retrieving Record...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden max-w-full">
      {/* Header - Reduced padding for mobile */}
      <div className="bg-[#1A1A1A] px-5 py-5 lg:px-8 lg:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="p-2.5 lg:p-3 bg-[#4A6741] rounded-xl lg:rounded-2xl shrink-0">
            <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-[#E6C9A2]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight truncate">
              {initialId ? `Edit: ${initialId}` : 'New Cattle Intake'}
            </h2>
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Feedlot Management</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 lg:p-8">
        {/* Main Grid: 1 column on mobile, 3 on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Section 1: Source Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#4A6741]" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Source & Acquisition</h3>
            </div>
            
            <div className="space-y-4">
              <FormField label="Seller / Ranch Name" error={errors.sellerName}>
                <input {...register('sellerName')} className="form-input" placeholder="e.g. Red River Ranch" />
              </FormField>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <FormField label="Price/Head ($)" error={errors.purchasePricePerHead}>
                  <input type="number" step="0.01" {...register('purchasePricePerHead')} className="form-input" />
                </FormField>
                <FormField label="Purchase Date" error={errors.purchaseDate}>
                  <input type="date" {...register('purchaseDate')} className="form-input text-xs" />
                </FormField>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Compliance</span>
                </div>
                <input {...register('vetName')} placeholder="Clearing Veterinarian" className="form-input-sub" />
                <input {...register('movementDocRef')} placeholder="Movement Permit #" className="form-input-sub" />
              </div>
            </div>
          </div>

          {/* Section 2: Physical Specs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Tag className="w-4 h-4 text-[#4A6741]" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Biological Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <FormField label="Tag Number / EID" error={errors.tagNumber}>
                  <input 
                    {...register('tagNumber')} 
                    placeholder="TX-0000" 
                    className="w-full p-3.5 lg:p-4 border-2 border-slate-100 rounded-2xl text-xl lg:text-2xl font-mono font-bold text-[#4A6741] focus:border-[#4A6741] outline-none transition-all" 
                  />
                </FormField>

                <FormField label="Assigned Pen" error={errors.penId}>
                  <div className="relative">
                    <select 
                      {...register('penId')} 
                      className="form-input appearance-none pr-10"
                      disabled={isLoadingPens}
                    >
                      <option value="">Select Location...</option>
                      {pens.map(p => (
                        <option key={p.id} value={p.id} disabled={p.headCount >= p.capacity}>
                          Pen {p.penNumber} ({p.headCount}/{p.capacity})
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button"
                      onClick={fetchPens}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4A6741] p-1"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingPens ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </FormField>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Breed">
                    <input {...register('breed')} className="form-input" placeholder="Angus" />
                  </FormField>
                  <FormField label="Gender">
                    <select {...register('gender')} className="form-input">
                      <option value="Steer">Steer</option>
                      <option value="Heifer">Heifer</option>
                      <option value="Bull">Bull</option>
                    </select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Weight (kg)" error={errors.entryWeight}>
                    <div className="relative">
                      <input type="number" step="0.1" {...register('entryWeight')} className="form-input pr-10" />
                      <Scale className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </FormField>
                  <FormField label="Age (Months)">
                    <input type="number" {...register('ageMonths')} className="form-input" />
                  </FormField>
                </div>

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors active:bg-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Internal Stock</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">Born on-site</p>
                    </div>
                  </div>
                  <input type="checkbox" {...register('isInternal')} className="w-6 h-6 lg:w-5 lg:h-5 accent-[#4A6741] rounded-lg" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer: Stacked on mobile, row on lg */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-100 flex flex-col-reverse lg:flex-row items-center justify-end gap-3 lg:gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="w-full lg:w-auto px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={!!isSubmitting || (initialId ? !isDirty : false)}
            className="w-full lg:w-auto bg-[#4A6741] text-[#E6C9A2] px-10 lg:px-12 py-4 rounded-2xl font-bold shadow-xl shadow-[#4A6741]/20 flex items-center justify-center gap-3 hover:bg-[#3d5535] disabled:opacity-50 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : initialId ? (
              <Save className="w-5 h-5" />
            ) : (
              <Truck className="w-5 h-5" />
            )}
            <span>{isSubmitting ? 'Syncing...' : initialId ? 'Update Record' : 'Register Intake'}</span>
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.85rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          background: white;
          border-color: #4A6741;
          box-shadow: 0 0 0 4px rgba(74, 103, 65, 0.05);
        }
        .form-input-sub {
          width: 100%;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e0e7ff;
          border-radius: 0.85rem;
          font-size: 0.875rem;
          outline: none;
        }
      `}</style>
    </div>
  );
};

const FormField = ({ label, children, error }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    {children}
    {error && (
      <div className="flex items-center gap-1 mt-1 text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
        <AlertCircle className="w-3 h-3" />
        <span className="text-[10px] font-bold">{error.message}</span>
      </div>
    )}
  </div>
);
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { 
//   Truck, Scale, Tag, ShieldCheck, User, 
//   MapPin, Loader2, RefreshCw, Save, X, AlertCircle 
// } from 'lucide-react';

// // --- Types & Validation ---
// const intakeSchema = z.object({
//   sellerName: z.string().min(1, "Seller name is required"),
//   purchasePricePerHead: z.coerce.number().min(0),
//   purchaseDate: z.string(),
//   vetName: z.string().optional(),
//   movementDocRef: z.string().optional(),
//   isInternal: z.boolean(),
//   tagNumber: z.string().min(1, "Tag number is required"),
//   penId: z.string().min(1, "Please select a pen location"),
//   breed: z.string().optional(),
//   gender: z.enum(["Steer", "Heifer", "Bull"]),
//   entryWeight: z.coerce.number().positive("Weight must be greater than 0"),
//   ageMonths: z.coerce.number().int().optional(),
// });

// type IntakeFormData = z.infer<typeof intakeSchema>;

// interface PenOption {
//   id: string;
//   penNumber: string;
//   headCount: number;
//   capacity: number;
// }

// interface CattleFormProps {
//   initialId?: string | null; // If provided, form enters EDIT mode
//   onCancel: () => void;      // Handle closing the form
//   onSuccess: () => void;     // Triggered after successful save
// }

// export const CattleIntakeForm: React.FC<CattleFormProps> = ({ initialId, onCancel, onSuccess }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);
//   const [pens, setPens] = useState<PenOption[]>([]);
//   const [isLoadingPens, setIsLoadingPens] = useState(true);
//   console.log('initialId', initialId)

//   const { 
//     register, 
//     handleSubmit, 
//     reset, 
//     formState: { errors, isDirty } 
//   } = useForm<IntakeFormData>({
//     resolver: zodResolver(intakeSchema),
//     defaultValues: {
//       purchaseDate: new Date().toISOString().split('T')[0],
//       isInternal: false,
//       gender: "Steer",
//       penId: ""
//     }
//   });

//   // 1. Fetch Pens (Reusable for refresh)
//   const fetchPens = useCallback(async () => {
//     setIsLoadingPens(true);
//     try {
//       const response = await fetch('/di/api/pens');
//       if (!response.ok) throw new Error();
//       const data = await response.json();
//       setPens(data);
//     } catch (err) {
//       console.error("Failed to load pens");
//     } finally {
//       setIsLoadingPens(false);
//     }
//   }, []);

//   // 2. Load Data for Editing
//   useEffect(() => {
//     fetchPens();
//     if (initialId) {
//       const loadRecord = async () => {
//         setIsFetching(true);
//         try {
//           const response = await fetch(`/di/api/cattle/${initialId}`);
//           const data = await response.json();
//            console.log("data",data)
//           // Flatten Prisma nested structure back into the form schema
//           reset({
//             ...data,
//             sellerName: data.source?.sellerName,
//             purchasePricePerHead: data.source?.purchasePricePerHead,
//             purchaseDate: data.source?.purchaseDate ? new Date(data.source.purchaseDate).toISOString().split('T')[0] : "",
//             vetName: data.source?.vetName,
//             movementDocRef: data.source?.movementDocRef,
//             isInternal: data.source?.isInternal,
//           });
//         } catch (err) {
//           console.error("Failed to fetch cattle record");
//         } finally {
//           setIsFetching(false);
//         }
//       };
//       loadRecord();
//     }
//   }, [initialId, reset, fetchPens]);

//   // 3. Form Submission
//   const onSubmit = async (data: IntakeFormData) => {
//     setIsSubmitting(true);
//     const endpoint = initialId ? `/di/api/cattle/${initialId}` : '/di/api/cattle';
//     const method = initialId ? 'PATCH' : 'POST';

//     try {
//       const response = await fetch(endpoint, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Submission failed');
//       }

//       onSuccess();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isFetching) {
//     return (
//       <div className="h-96 flex flex-col items-center justify-center space-y-4">
//         <Loader2 className="w-10 h-10 animate-spin text-[#4A6741]" />
//         <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Retrieving Record...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-3xl overflow-hidden">
//       {/* Header */}
//       <div className="bg-[#1A1A1A] px-8 py-6 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-[#4A6741] rounded-2xl">
//             <Truck className="w-6 h-6 text-[#E6C9A2]" />
//           </div>
//           <div>
//             <h2 className="text-xl font-bold text-white tracking-tight">
//               {initialId ? `Edit Record: ${initialId}` : 'New Cattle Intake'}
//             </h2>
//             <p className="text-xs text-white/40 uppercase font-black tracking-widest">Precision Feedlot Management</p>
//           </div>
//         </div>
//         <button 
//           onClick={onCancel}
//           className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors"
//         >
//           <X className="w-6 h-6" />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="p-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
//           {/* Section 1: Source Info */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
//               <MapPin className="w-4 h-4 text-[#4A6741]" />
//               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Source & Acquisition</h3>
//             </div>
            
//             <div className="space-y-4">
//               <FormField label="Seller / Ranch Name" error={errors.sellerName}>
//                 <input {...register('sellerName')} className="form-input" placeholder="e.g. Red River Ranch" />
//               </FormField>

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField label="Price/Head ($)" error={errors.purchasePricePerHead}>
//                   <input type="number" step="0.01" {...register('purchasePricePerHead')} className="form-input" />
//                 </FormField>
//                 <FormField label="Purchase Date" error={errors.purchaseDate}>
//                   <input type="date" {...register('purchaseDate')} className="form-input" />
//                 </FormField>
//               </div>

//               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <ShieldCheck className="w-4 h-4 text-indigo-600" />
//                   <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Compliance</span>
//                 </div>
//                 <input {...register('vetName')} placeholder="Clearing Veterinarian" className="form-input-sub" />
//                 <input {...register('movementDocRef')} placeholder="Movement Permit #" className="form-input-sub" />
//               </div>
//             </div>
//           </div>

//           {/* Section 2: Physical Specs */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
//               <Tag className="w-4 h-4 text-[#4A6741]" />
//               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Biological Profile</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-6">
//                 <FormField label="Tag Number / EID" error={errors.tagNumber}>
//                   <input 
//                     {...register('tagNumber')} 
//                     placeholder="TX-0000" 
//                     className="w-full p-4 border-2 border-slate-100 rounded-2xl text-2xl font-mono font-bold text-[#4A6741] focus:border-[#4A6741] outline-none transition-all" 
//                   />
//                 </FormField>

//                 <FormField label="Assigned Pen" error={errors.penId}>
//                   <div className="relative">
//                     <select 
//                       {...register('penId')} 
//                       className="form-input appearance-none pr-10"
//                       disabled={isLoadingPens}
//                     >
//                       <option value="">Select Location...</option>
//                       {pens.map(p => (
//                         <option key={p.id} value={p.id} disabled={p.headCount >= p.capacity}>
//                           Pen {p.penNumber} — {p.headCount}/{p.capacity} Head {p.headCount >= p.capacity ? '(FULL)' : ''}
//                         </option>
//                       ))}
//                     </select>
//                     <button 
//                       type="button"
//                       onClick={fetchPens}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4A6741]"
//                     >
//                       <RefreshCw className={`w-4 h-4 ${isLoadingPens ? 'animate-spin' : ''}`} />
//                     </button>
//                   </div>
//                 </FormField>
//               </div>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="Breed">
//                     <input {...register('breed')} className="form-input" placeholder="Angus" />
//                   </FormField>
//                   <FormField label="Gender">
//                     <select {...register('gender')} className="form-input">
//                       <option value="Steer">Steer</option>
//                       <option value="Heifer">Heifer</option>
//                       <option value="Bull">Bull</option>
//                     </select>
//                   </FormField>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField label="Weight (kg)" error={errors.entryWeight}>
//                     <div className="relative">
//                       <input type="number" step="0.1" {...register('entryWeight')} className="form-input pr-10" />
//                       <Scale className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
//                     </div>
//                   </FormField>
//                   <FormField label="Age (Months)">
//                     <input type="number" {...register('ageMonths')} className="form-input" />
//                   </FormField>
//                 </div>

//                 <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">
//                       <User className="w-4 h-4 text-slate-500" />
//                     </div>
//                     <div>
//                       <p className="text-xs font-bold text-slate-700">Internal Stock</p>
//                       <p className="text-[10px] text-slate-400 font-medium">Born on-site</p>
//                     </div>
//                   </div>
//                   <input type="checkbox" {...register('isInternal')} className="w-5 h-5 accent-[#4A6741] rounded-lg" />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Footer */}
//         <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
//           <button 
//             type="button" 
//             onClick={onCancel}
//             className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
//           >
//             Cancel
//           </button>
//           <button 
//             type="submit" 
//            // disabled={isSubmitting || (initialId && !isDirty)}
//             disabled={!!isSubmitting || (initialId ? !isDirty : false)}
//             className="bg-[#4A6741] text-[#E6C9A2] px-12 py-4 rounded-2xl font-bold shadow-xl shadow-[#4A6741]/20 flex items-center gap-3 hover:bg-[#3d5535] disabled:opacity-50 transition-all active:scale-95"
//           >
//             {isSubmitting ? (
//               <Loader2 className="w-5 h-5 animate-spin" />
//             ) : initialId ? (
//               <Save className="w-5 h-5" />
//             ) : (
//               <Truck className="w-5 h-5" />
//             )}
//             {isSubmitting ? 'Syncing...' : initialId ? 'Update Record' : 'Register Intake'}
//           </button>
//         </div>
//       </form>

//       {/* Internal CSS for Clean Form Fields */}
//       <style jsx>{`
//         .form-input {
//           width: 100%;
//           padding: 0.65rem 1rem;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           border-radius: 0.75rem;
//           font-size: 0.875rem;
//           outline: none;
//           transition: all 0.2s;
//         }
//         .form-input:focus {
//           background: white;
//           border-color: #4A6741;
//           box-shadow: 0 0 0 4px rgba(74, 103, 65, 0.05);
//         }
//         .form-input-sub {
//           width: 100%;
//           padding: 0.65rem 1rem;
//           background: white;
//           border: 1px solid #e0e7ff;
//           border-radius: 0.75rem;
//           font-size: 0.875rem;
//           outline: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// // --- Helper Component ---
// const FormField = ({ label, children, error }: any) => (
//   <div className="space-y-1.5">
//     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
//     {children}
//     {error && (
//       <div className="flex items-center gap-1 mt-1 text-red-500 ml-1">
//         <AlertCircle className="w-3 h-3" />
//         <span className="text-[10px] font-bold">{error.message}</span>
//       </div>
//     )}
//   </div>
// );