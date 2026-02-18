import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Send, MapPin, Phone, Mail, CheckCircle2,
  FileText, Download, BookOpen, BarChart3, Loader2,
  DollarSign, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { SafeUser } from '@/app/types';

const resources = [
  {
    icon: FileText,
    title: 'Business Overview',
    size: '0.318MB',
    type: 'PDF',
    link: "/docs/busoverview-01.pdf",
    requiredRole: null 
  },
  {
    icon: BarChart3,
    title: 'Financial Summary',
    size: '0.263 MB',
    type: 'PDF',
    link: "/docs/finreport-01.pdf",
    requiredRole: ['shareholder']
  },
  {
    icon: BookOpen,
    title: 'Sustainability Report',
    size: '0.253 MB',
    type: 'PDF',
    link: "/docs/susreport-01.pdf",
    requiredRole: null
  },
  {
    icon: FileText,
    title: 'Partnership Guide',
    size: '0.253 MB',
    type: 'PDF',
    link: "/docs/partnerguide-01.pdf",
    requiredRole: ['partner']
  },
  {
    icon: FileText,
    title: 'Business 5 Year Plan',
    size: '0.253 MB',
    type: 'PDF',
    link: "/docs/5ybusplan-01.pdf",
    requiredRole: ['shareholder', 'partner']
  },
];

const INITIAL_STATE = {
  name: '',
  email: '',
  phone: '',
  company: '',
  inquiryType: '',
  pledgeAmount: '',
  paymentStructure: '',
  paymentDate: '',
  message: '',
};

const inquiryTypes = [
  { value: 'partnership', label: 'Partnership Inquiry' },
  { value: 'investment', label: 'Investment Opportunity' },
  { value: 'services', label: 'Service Request' },
  { value: 'general', label: 'General Question' },
];

interface ContactSectionProps {
  currentUser: SafeUser | null | undefined;
}

const ContactSection: React.FC<ContactSectionProps> = ({ currentUser }) => {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Fixed Permission Logic ---
  const checkPermission = (requiredRoles: string[] | null) => {
    if (!currentUser) return false;
    
    const userRoles = currentUser.roles.map(r => r.toLowerCase());
    
    // Admins and Executives see everything
    if (currentUser.isAdmin || userRoles.includes('admin') || userRoles.includes('executive')) {
      return true;
    }

    // If no specific role is required, allow any authorized member
    if (!requiredRoles || requiredRoles.length === 0) {
      const baseRoles = ['partner', 'investor', 'shareholder'];
      return userRoles.some(r => baseRoles.includes(r));
    }

    // Check if the user has ANY of the roles required for this specific file
    return requiredRoles.some(role => userRoles.includes(role.toLowerCase()));
  };

  const handleDownload = (resource: typeof resources[0]) => {
    if (!checkPermission(resource.requiredRole)) {
      const roleLabel = resource.requiredRole ? resource.requiredRole.join(' or ') : "authorized users";
      toast.error(`Access Restricted: Available to ${roleLabel}s only.`);
      return;
    }
    window.open(resource.link, '_blank');
    toast.success(`Downloading ${resource.title}...`);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      toast.error("Please fill in required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Submission failed');
      setIsSubmitted(true);
      setFormData(INITIAL_STATE);
      toast.success('Inquiry sent successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-24 bg-ranch-cream relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ranch-charcoal mt-3 mb-4">
            Start the Conversation
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form Side */}
          <div className={`lg:col-span-3 order-1 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-ranch-cream-dark">
              {isSubmitted ? (
                <div className="text-center py-10 sm:py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-ranch-charcoal mb-2">Message Sent</h3>
                  <button onClick={() => setIsSubmitted(false)} className="text-ranch-terracotta font-bold text-sm">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-1.5 text-ranch-slate">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30 focus:ring-2 focus:ring-ranch-terracotta/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-1.5 text-ranch-slate">Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30 focus:ring-2 focus:ring-ranch-terracotta/20 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1.5 text-ranch-slate">Inquiry Type *</label>
                    <select required value={formData.inquiryType} onChange={(e) => handleChange('inquiryType', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30 focus:ring-2 focus:ring-ranch-terracotta/20 outline-none">
                      <option value="">Select type...</option>
                      {inquiryTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  {formData.inquiryType === 'investment' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                      <div className="sm:col-span-2 flex items-center gap-2 text-emerald-800 font-black text-[10px] uppercase"><DollarSign className="w-3 h-3"/> Pledge Details</div>
                      <input type="text" placeholder="Amount (USD)" value={formData.pledgeAmount} onChange={(e) => handleChange('pledgeAmount', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                      <select value={formData.paymentStructure} onChange={(e) => handleChange('paymentStructure', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500/20 outline-none">
                        <option value="">Payment Plan...</option>
                        <option value="upfront">Upfront</option>
                        <option value="milestone">Milestone-based</option>
                      </select>
                    </div>
                  )}

                  <textarea required value={formData.message} onChange={(e) => handleChange('message', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30 focus:ring-2 focus:ring-ranch-terracotta/20 outline-none" placeholder="Your message..."></textarea>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-ranch-forest text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-ranch-forest-dark transition-colors disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Submit Inquiry</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-2 space-y-6 order-2">
            <div className="bg-ranch-charcoal rounded-2xl p-6 sm:p-8 text-white shadow-md">
              <h3 className="font-serif text-xl font-bold mb-6 text-ranch-cream">Office Info</h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex gap-4 items-center"><MapPin className="w-4 h-4 text-ranch-terracotta"/> 06 Elseworth Road Belgravia, Zimbabwe</div>
                <div className="flex gap-4 items-center"><Phone className="w-4 h-4 text-ranch-terracotta"/> (263) 773-416592</div>
                <div className="flex gap-4 items-center"><Mail className="w-4 h-4 text-ranch-terracotta"/> partnerships@heritagebeefzim.com</div>
              </div>
            </div>

            {/* Resources Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-ranch-cream-dark">
              <h3 className="font-serif text-xl font-bold text-ranch-charcoal mb-6 flex items-center gap-2">
                <Download className="w-5 h-5 text-ranch-terracotta" /> Documents
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  const hasAccess = checkPermission(resource.requiredRole);

                  return (
                    <button
                      key={resource.title}
                      onClick={() => handleDownload(resource)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left group 
                        ${hasAccess 
                          ? 'hover:bg-ranch-cream/50 border-transparent hover:border-ranch-cream-dark opacity-100' 
                          : 'bg-gray-50 border-gray-100 opacity-60'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform 
                        ${hasAccess ? 'bg-ranch-terracotta/10 group-hover:scale-110' : 'bg-gray-200'}`}>
                        <Icon className={`w-5 h-5 ${hasAccess ? 'text-ranch-terracotta' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-ranch-charcoal text-sm truncate">{resource.title}</div>
                        <div className="text-ranch-slate text-[10px] uppercase font-semibold flex items-center gap-2">
                          {resource.type} • {resource.size}
                          {!hasAccess && resource.requiredRole && (
                            <span className="text-ranch-terracotta font-bold flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> {resource.requiredRole.join(' & ')} only
                            </span>
                          )}
                        </div>
                      </div>
                      {hasAccess ? (
                        <Download className="w-4 h-4 text-ranch-slate group-hover:text-ranch-terracotta transition-colors" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
// import React, { useState } from 'react';
// import { useScrollAnimation } from '@/hooks/useScrollAnimation';
// import {
//   Send, MapPin, Phone, Mail, Clock, CheckCircle2,
//   FileText, Download, BookOpen, BarChart3, Loader2,
//   DollarSign, Calendar, Briefcase, Lock
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { SafeUser } from '@/app/types';

// const INITIAL_STATE = {
//   name: '',
//   email: '',
//   phone: '',
//   company: '',
//   inquiryType: '',
//   pledgeAmount: '',
//   paymentStructure: '',
//   paymentDate: '',
//   message: '',
// };

// const inquiryTypes = [
//   { value: 'partnership', label: 'Partnership Inquiry' },
//   { value: 'investment', label: 'Investment Opportunity' },
//   { value: 'services', label: 'Service Request' },
//   { value: 'general', label: 'General Question' },
// ];

// const resources = [
//   {
//     icon: FileText,
//     title: 'Business Overview',
//     description: 'Complete company profile and capabilities statement',
//     size: '0.318MB',
//     type: 'PDF',
//     link: "/docs/busoverview-01.pdf"
//   },
//   {
//     icon: BarChart3,
//     title: 'Financial Summary',
//     description: '5-year financial projections and market analysis',
//     size: '0.263 MB',
//     type: 'PDF',
//     link: "/docs/finreport-01.pdf"
//   },
//   {
//     icon: BookOpen,
//     title: 'Sustainability Report',
//     description: 'Annual environmental impact and stewardship report',
//     size: '0.253 MB',
//     type: 'PDF',
//     link: "/docs/susreport-01.pdf"
//   },
//   {
//     icon: FileText,
//     title: 'Partnership Guide',
//     description: 'Detailed tier comparison and partnership terms',
//     size: '0.253 MB',
//     type: 'PDF',
//     link: "/docs/partnerguide-01.pdf"
//   },
//    {
//     icon: FileText,
//     title: 'Business 5 Year Plan',
//     description: 'Detailed 5 Year business plan',
//     size: '0.253 MB',
//     type: 'PDF',
//     link: "/docs/5ybusplan-01.pdf"
//   },
// ];

// interface ContactSectionProps {
//   //hasPermission?: boolean; // Toggle this based on user auth/permission state
//   currentUser:SafeUser|null|undefined
// }

// const ContactSection: React.FC<ContactSectionProps> = ({currentUser }) => {
//   const { ref, isVisible } = useScrollAnimation(0.05);
//   const [formData, setFormData] = useState(INITIAL_STATE);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//  let allowedRoles: String[] = ['admin', 'executive', 'partner', 'investor','shareholder'];
//   const hasPermission = currentUser?.isAdmin || currentUser?.roles.filter((role: string) =>
//     allowedRoles.some((y) => y.toLowerCase().includes(role.toLowerCase())))

//   const validate = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
//     if (!formData.inquiryType) newErrors.inquiryType = 'Please select an inquiry type';
//     if (!formData.message.trim()) newErrors.message = 'Message is required';
    
//     if (formData.inquiryType === 'investment') {
//         if (!formData.pledgeAmount) newErrors.pledgeAmount = 'Amount is required';
//         if (!formData.paymentStructure) newErrors.paymentStructure = 'Selection is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setIsSubmitting(true);
//     try {
//       const response = await fetch('/api/enquiries', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       if (!response.ok) throw new Error('Submission failed');
//       setIsSubmitted(true);
//       setFormData(INITIAL_STATE);
//       toast.success('Inquiry sent to Heritage Beef team!');
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleDownload = (resource: typeof resources[0]) => {
//     if (!hasPermission) {
//       toast.error("Access Restricted: Please contact administration for these documents.");
//       return;
//     }
//     // Logic for actual download
//     window.open(resource.link, '_blank');
//     toast.success(`Downloading ${resource.title}...`);
//   };

//   return (
//     <section id="contact" className="py-12 sm:py-24 bg-ranch-cream relative overflow-hidden">
//       <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//           <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
//             Get In Touch
//           </span>
//           <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ranch-charcoal mt-3 mb-4">
//             Start the Conversation
//           </h2>
//         </div>

//         <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
//           {/* Form Side */}
//           <div className={`lg:col-span-3 order-1 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-ranch-cream-dark">
//               {isSubmitted ? (
//                 <div className="text-center py-10 sm:py-12">
//                   <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
//                   <h3 className="font-serif text-2xl font-bold text-ranch-charcoal mb-2">Message Sent</h3>
//                   <button onClick={() => setIsSubmitted(false)} className="text-ranch-terracotta font-bold text-sm">Send Another</button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-[10px] font-bold uppercase mb-1.5">Full Name *</label>
//                       <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30" />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold uppercase mb-1.5">Email *</label>
//                       <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30" />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-[10px] font-bold uppercase mb-1.5">Inquiry Type *</label>
//                     <select value={formData.inquiryType} onChange={(e) => handleChange('inquiryType', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30">
//                       <option value="">Select type...</option>
//                       {inquiryTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//                     </select>
//                   </div>

//                   {formData.inquiryType === 'investment' && (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
//                       <div className="sm:col-span-2 flex items-center gap-2 text-emerald-800 font-black text-[10px] uppercase"><DollarSign className="w-3 h-3"/> Pledge Details</div>
//                       <input type="text" placeholder="Amount (USD)" value={formData.pledgeAmount} onChange={(e) => handleChange('pledgeAmount', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-emerald-200" />
//                       <select value={formData.paymentStructure} onChange={(e) => handleChange('paymentStructure', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-emerald-200">
//                         <option value="">Payment Plan...</option>
//                         <option value="upfront">Upfront</option>
//                         <option value="milestone">Milestone-based</option>
//                       </select>
//                     </div>
//                   )}

//                   <textarea value={formData.message} onChange={(e) => handleChange('message', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30" placeholder="Your message..."></textarea>

//                   <button type="submit" disabled={isSubmitting} className="w-full bg-ranch-forest py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
//                     {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Submit Inquiry</>}
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>

//           {/* Info Side */}
//           <div className="lg:col-span-2 space-y-6 order-2">
//             <div className="bg-ranch-forest rounded-2xl p-6 sm:p-8 text-black shadow-md">
//               <h3 className="font-serif text-xl font-bold mb-6">Office Info</h3>
//               <div className="space-y-4 text-sm font-medium">
//                 <div className="flex gap-4"><MapPin className="w-4 h-4"/> 06 Elseworth Road Belgravia, Zimbabwe</div>
//                 <div className="flex gap-4"><Phone className="w-4 h-4"/> (263) 773-416592</div>
//                 <div className="flex gap-4"><Mail className="w-4 h-4"/> partnerships@heritagebeefzim.com</div>
//               </div>
//             </div>

//             {/* Resources Card with Permission Logic */}
//             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-ranch-cream-dark">
//               <h3 className="font-serif text-xl font-bold text-ranch-charcoal mb-6 flex items-center gap-2">
//                 <Download className="w-5 h-5 text-ranch-terracotta" /> {hasPermission ? 'Resources' : 'Protected Documents'}
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {resources.map((resource) => {
//                   const Icon = resource.icon;
//                   return (
//                     <button
//                       key={resource.title}
//                       onClick={() => handleDownload(resource)}
//                       className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left group 
//                         ${hasPermission 
//                           ? 'hover:bg-ranch-cream/50 border-transparent hover:border-ranch-cream-dark opacity-100 cursor-pointer' 
//                           : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'}`}
//                     >
//                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform 
//                         ${hasPermission ? 'bg-ranch-terracotta/10 group-hover:scale-110' : 'bg-gray-200'}`}>
//                         <Icon className={`w-5 h-5 ${hasPermission ? 'text-ranch-terracotta' : 'text-gray-400'}`} />
//                       </div>
//                       <div className="flex-grow min-w-0">
//                         <div className="font-bold text-ranch-charcoal text-sm truncate">{resource.title}</div>
//                         <div className="text-ranch-slate text-[10px] uppercase font-semibold">{resource.type} • {resource.size}</div>
//                       </div>
//                       {hasPermission ? (
//                         <Download className="w-4 h-4 text-ranch-slate group-hover:text-ranch-terracotta transition-colors" />
//                       ) : (
//                         <Lock className="w-4 h-4 text-gray-400" />
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//               {!hasPermission && (
//                 <p className="mt-4 text-[10px] text-ranch-slate text-center italic">
//                   * Documentation is reserved for verified partners and shareholders.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;
// import React, { useState } from 'react';
// import { useScrollAnimation } from '@/hooks/useScrollAnimation';
// import {
//   Send, MapPin, Phone, Mail, Clock, CheckCircle2,
//   FileText, Download, BookOpen, BarChart3, Loader2,
//   Info, ShieldCheck, Briefcase, DollarSign, Calendar, Wallet
// } from 'lucide-react';
// import { toast } from 'sonner';

// const INITIAL_STATE = {
//   name: '',
//   email: '',
//   phone: '',
//   company: '',
//   inquiryType: '',
//   pledgeAmount: '',
//   paymentStructure: '',
//   paymentDate: '',
//   message: '',
// };

// const inquiryTypes = [
//   { value: 'partnership', label: 'Partnership Inquiry' },
//   { value: 'investment', label: 'Investment Opportunity' },
//   { value: 'services', label: 'Service Request' },
//   { value: 'general', label: 'General Question' },
// ];

// const resources = [
//   {
//     icon: FileText,
//     title: 'Business Overview',
//     description: 'Complete company profile and capabilities statement',
//     size: '2.4 MB',
//     type: 'PDF',
//     link: "/file/x.pdf"
//   },
//   {
//     icon: BarChart3,
//     title: 'Financial Summary',
//     description: '5-year financial projections and market analysis',
//     size: '1.8 MB',
//     type: 'PDF',
//   },
//   {
//     icon: BookOpen,
//     title: 'Sustainability Report',
//     description: 'Annual environmental impact and stewardship report',
//     size: '3.1 MB',
//     type: 'PDF',
//   },
//   {
//     icon: FileText,
//     title: 'Partnership Guide',
//     description: 'Detailed tier comparison and partnership terms',
//     size: '1.2 MB',
//     type: 'PDF',
//   },
// ];

// const ContactSection: React.FC = () => {
//   const { ref, isVisible } = useScrollAnimation(0.05);
//   const [formData, setFormData] = useState(INITIAL_STATE);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const validate = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
//     if (!formData.inquiryType) newErrors.inquiryType = 'Please select an inquiry type';
//     if (!formData.message.trim()) newErrors.message = 'Message is required';
    
//     // Conditional validation for Investment
//     if (formData.inquiryType === 'investment') {
//         if (!formData.pledgeAmount) newErrors.pledgeAmount = 'Amount is required';
//         if (!formData.paymentStructure) newErrors.paymentStructure = 'Selection is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setIsSubmitting(true);
//     try {
//       const response = await fetch('/api/enquiries', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Submission failed');
//       }
//       setIsSubmitted(true);
//       setFormData(INITIAL_STATE);
//       toast.success('Inquiry sent to Heritage Beef team!');
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => {
//         const next = { ...prev };
//         delete next[field];
//         return next;
//       });
//     }
//   };

//   const handleDownload = (resource: typeof resources[0]) => {
//     toast.success(`Downloading ${resource.title}...`);
//   };

//   return (
//     <section id="contact" className="py-12 sm:py-24 bg-ranch-cream relative overflow-hidden">
//       <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//           <span className="text-ranch-terracotta text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
//             Get In Touch
//           </span>
//           <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ranch-charcoal mt-3 mb-4">
//             Start the Conversation
//           </h2>
//           <p className="text-ranch-slate max-w-2xl mx-auto text-base sm:text-lg px-2">
//             Whether you are interested in partnership, investment, or our services, we would love to hear from you.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
//           <div className={`lg:col-span-3 order-1 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-ranch-cream-dark">
//               {isSubmitted ? (
//                 <div className="text-center py-10 sm:py-12">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <CheckCircle2 className="w-8 h-8 text-green-600" />
//                   </div>
//                   <h3 className="font-serif text-2xl font-bold text-ranch-charcoal mb-2">Message Sent</h3>
//                   <p className="text-ranch-slate mb-6 text-sm sm:text-base px-4">
//                     Our team will review your inquiry and respond within 24 business hours.
//                   </p>
//                   <button onClick={() => setIsSubmitted(false)} className="text-ranch-terracotta hover:text-ranch-terracotta-dark font-bold text-sm transition-colors">
//                     Send Another Message
//                   </button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//                     <div>
//                       <label className="block text-[10px] sm:text-xs font-bold text-ranch-charcoal mb-1.5 uppercase tracking-wide">Full Name *</label>
//                       <input
//                         type="text"
//                         value={formData.name}
//                         onChange={(e) => handleChange('name', e.target.value)}
//                         className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm appearance-none ${errors.name ? 'border-red-400 bg-red-50' : 'border-ranch-cream-dark bg-ranch-cream/30'} focus:outline-none focus:ring-2 focus:ring-ranch-forest/20 transition-all`}
//                         placeholder="John Smith"
//                       />
//                       {errors.name && <span className="text-red-500 text-[10px] mt-1 font-medium">{errors.name}</span>}
//                     </div>
//                     <div>
//                       <label className="block text-[10px] sm:text-xs font-bold text-ranch-charcoal mb-1.5 uppercase tracking-wide">Email *</label>
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) => handleChange('email', e.target.value)}
//                         className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm appearance-none ${errors.email ? 'border-red-400 bg-red-50' : 'border-ranch-cream-dark bg-ranch-cream/30'} focus:outline-none focus:ring-2 focus:ring-ranch-forest/20 transition-all`}
//                         placeholder="john@company.com"
//                       />
//                       {errors.email && <span className="text-red-500 text-[10px] mt-1 font-medium">{errors.email}</span>}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//                     <div>
//                       <label className="block text-[10px] sm:text-xs font-bold text-ranch-charcoal mb-1.5 uppercase tracking-wide">Phone</label>
//                       <input
//                         type="tel"
//                         value={formData.phone}
//                         onChange={(e) => handleChange('phone', e.target.value)}
//                         className="w-full px-4 py-3 rounded-xl border border-ranch-cream-dark bg-ranch-cream/30 text-base sm:text-sm focus:outline-none transition-all"
//                         placeholder="(263) 773-416592"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] sm:text-xs font-bold text-ranch-charcoal mb-1.5 uppercase tracking-wide">Inquiry Type *</label>
//                       <div className="relative">
//                           <select
//                           value={formData.inquiryType}
//                           onChange={(e) => handleChange('inquiryType', e.target.value)}
//                           className={`w-full px-4 py-3 rounded-xl border appearance-none text-base sm:text-sm ${errors.inquiryType ? 'border-red-400 bg-red-50' : 'border-ranch-cream-dark bg-ranch-cream/30'} focus:outline-none transition-all`}
//                           >
//                           <option value="">Select type...</option>
//                           {inquiryTypes.map(type => (
//                               <option key={type.value} value={type.value}>{type.label}</option>
//                           ))}
//                           </select>
//                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ranch-slate">
//                               <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
//                           </div>
//                       </div>
//                       {errors.inquiryType && <span className="text-red-500 text-[10px] mt-1 font-medium">{errors.inquiryType}</span>}
//                     </div>
//                   </div>

//                   {/* START: CONDITIONAL INVESTMENT FIELDS */}
//                   {formData.inquiryType === 'investment' && (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
//                       <div className="sm:col-span-2">
//                         <h4 className="text-[10px] font-black uppercase text-emerald-800 tracking-[0.15em] flex items-center gap-2 mb-2">
//                           <DollarSign className="w-3 h-3" /> Pledge Details
//                         </h4>
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-ranch-charcoal mb-1.5 uppercase">Pledge Amount (USD) *</label>
//                         <input
//                           type="text"
//                           value={formData.pledgeAmount}
//                           onChange={(e) => handleChange('pledgeAmount', e.target.value)}
//                           placeholder="e.g. 50,000"
//                           className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm ${errors.pledgeAmount ? 'border-red-400' : 'border-emerald-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
//                         />
//                         {errors.pledgeAmount && <span className="text-red-500 text-[9px] font-medium">{errors.pledgeAmount}</span>}
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-ranch-charcoal mb-1.5 uppercase">Payment Plan *</label>
//                         <select
//                           value={formData.paymentStructure}
//                           onChange={(e) => handleChange('paymentStructure', e.target.value)}
//                           className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm ${errors.paymentStructure ? 'border-red-400' : 'border-emerald-200'} focus:outline-none`}
//                         >
//                           <option value="">Select structure...</option>
//                           <option value="upfront">Full Upfront</option>
//                           <option value="monthly">Monthly Contributions</option>
//                           <option value="quarterly">Quarterly Installments</option>
//                           <option value="periodic">Periodic / Milestone-based</option>
//                         </select>
//                         {errors.paymentStructure && <span className="text-red-500 text-[9px] font-medium">{errors.paymentStructure}</span>}
//                       </div>
//                       <div className="sm:col-span-2">
//                         <label className="block text-[10px] font-bold text-ranch-charcoal mb-1.5 uppercase">Target Injection Date</label>
//                         <div className="relative">
//                           <input
//                             type="date"
//                             value={formData.paymentDate}
//                             onChange={(e) => handleChange('paymentDate', e.target.value)}
//                             className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm focus:outline-none"
//                           />
//                           <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* END: CONDITIONAL INVESTMENT FIELDS */}

//                   {/* PARTNERSHIP NOTICE */}
//                   {formData.inquiryType === 'partnership' && (
//                     <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
//                       <div className="flex gap-3">
//                         <Briefcase className="w-5 h-5 text-indigo-600 shrink-0" />
//                         <div>
//                           <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1">Partnership Guidelines</h4>
//                           <p className="text-[11px] leading-relaxed text-indigo-800/80">
//                             Our 2025 Model Selection Framework prioritizes operational synergy. Please highlight your resources and reach below.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-[10px] sm:text-xs font-bold text-ranch-charcoal mb-1.5 uppercase tracking-wide">Message *</label>
//                     <textarea
//                       value={formData.message}
//                       onChange={(e) => handleChange('message', e.target.value)}
//                       rows={4}
//                       className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm ${errors.message ? 'border-red-400 bg-red-50' : 'border-ranch-cream-dark bg-ranch-cream/30'} focus:outline-none transition-all resize-none`}
//                       placeholder={formData.inquiryType === 'investment' ? "Optional: Tell us about your investment experience or specific goals..." : "Tell us more..."}
//                     />
//                     {errors.message && <span className="text-red-500 text-[10px] mt-1 font-medium">{errors.message}</span>}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-ranch-forest hover:bg-ranch-forest-light disabled:opacity-70 text-black py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <><Send className="w-4 h-4" /> Submit Inquiry</>
//                     )}
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>

//           <div className={`lg:col-span-2 space-y-6 order-2 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             {/* Office Info Card */}
//             <div className="bg-ranch-forest rounded-2xl p-6 sm:p-8 text-black shadow-md">
//               <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">Office Info</h3>
//               <div className="space-y-6">
//                 {[
//                   { icon: MapPin, label: 'Headquarters', val: <>06 Elseworth Road Belgravia<br />Zimbabwe</> },
//                   { icon: Phone, label: 'Phone', val: <a href="tel:+263773416592" className="hover:underline">(263) 773-416592</a> },
//                   { icon: Mail, label: 'Email', val: <a href="mailto:partnerships@heritagebeefzim.com" className="hover:underline break-all text-xs sm:text-sm">partnerships@heritagebeefzim.com</a> },
//                   { icon: Clock, label: 'Business Hours', val: <>Mon-Fri: 7AM - 6PM<br />Sat: 8AM - 12PM</> }
//                 ].map((item, idx) => (
//                   <div key={idx} className="flex items-start gap-4">
//                     <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
//                       <item.icon className="w-4 h-4 text-black" />
//                     </div>
//                     <div>
//                       <div className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-60">{item.label}</div>
//                       <div className="text-sm font-medium">{item.val}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Resources Card */}
//             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-ranch-cream-dark">
//               <h3 className="font-serif text-xl font-bold text-ranch-charcoal mb-6 flex items-center gap-2">
//                 <Download className="w-5 h-5 text-ranch-terracotta" /> Resources
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {resources.map((resource) => {
//                   const Icon = resource.icon;
//                   return (
//                     <button
//                       key={resource.title}
//                       onClick={() => handleDownload(resource)}
//                       className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-ranch-cream/50 transition-all text-left group border border-transparent hover:border-ranch-cream-dark"
//                     >
//                       <div className="w-10 h-10 bg-ranch-terracotta/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
//                         <Icon className="w-5 h-5 text-ranch-terracotta" />
//                       </div>
//                       <div className="flex-grow min-w-0">
//                         <div className="font-bold text-ranch-charcoal text-sm truncate">{resource.title}</div>
//                         <div className="text-ranch-slate text-[10px] uppercase font-semibold">{resource.type} • {resource.size}</div>
//                       </div>
//                       <Download className="w-4 h-4 text-ranch-slate group-hover:text-ranch-terracotta transition-colors" />
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;