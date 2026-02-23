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

                  <button type="submit" disabled={isSubmitting} className="w-full bg-ranch-forest text-black py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-ranch-forest-dark transition-colors disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Submit Inquiry</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-2 space-y-6 order-2">
            <div className="bg-ranch-charcoal rounded-2xl p-6 sm:p-8 text-black shadow-md">
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