import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowRight, MapPin, Phone, Mail,
  Linkedin, Facebook, Youtube
} from 'lucide-react';

const footerLinks = {
  'Value Chain': [
    { label: 'Genetics Program', href: '#value-chain' },
    { label: 'Custom Feeding', href: '#value-chain' },
    { label: 'Processing', href: '#value-chain' },
    { label: 'Distribution', href: '#value-chain' },
    { label: 'Retail Partners', href: '#value-chain' },
  ],
  'Services': [
    { label: 'Breeding Stock', href: '#services' },
    { label: 'Feedlot Services', href: '#services' },
    { label: 'Custom Processing', href: '#services' },
    { label: 'Wholesale', href: '#services' },
    { label: 'Quality Assurance', href: '#services' },
  ],
  'Company': [
    { label: 'About Heritage Beef Zim', href: '#hero' },
    { label: 'Operations Dashboard', href: '#operations' },
    { label: 'Photo Gallery', href: '#gallery' },
    { label: 'Partner Testimonials', href: '#testimonials' },
    { label: 'Sustainability', href: '#services' },
  ],
  'Investors': [
    { label: 'Investment Tiers', href: '#investment' },
    { label: 'Financial Projections', href: '#investment' },
    { label: 'ROI Calculator', href: '#investment' },
    { label: 'Annual Reports', href: '#contact' },
    { label: 'Partner Portal', href: '#contact' },
  ],
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Subscribed successfully!', {
      description: 'You\'ll receive our quarterly industry insights and company updates.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-ranch-forest-dark text-black">
      {/* Newsletter Banner */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Stay Informed</h3>
              <p className="text-black/60 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                Receive quarterly insights on market trends, operational updates, and investment opportunities.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:max-w-none lg:mx-0 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-grow px-4 py-3.5 rounded-xl bg-white/20 border border-black/10 text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-ranch-wheat/30 text-base sm:text-sm transition-all"
              />
              <button
                type="submit"
                className="bg-ranch-terracotta hover:bg-ranch-terracotta-dark px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 flex-shrink-0"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          
          {/* Brand & Contact */}
          <div className="sm:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-ranch-terracotta rounded-xl flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-xl font-bold block leading-tight">Heritage Beef Zim</span>
                <span className="block text-ranch-wheat text-[10px] uppercase font-bold tracking-[0.2em]">
                  Integrated Value Chain
                </span>
              </div>
            </div>
            
            <p className="text-black/60 text-sm leading-relaxed max-w-sm">
              A vertically integrated beef operation delivering premium quality through complete supply chain control — from genetics to your table.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-black/60">
                <MapPin className="w-5 h-5 text-ranch-wheat flex-shrink-0" />
                <span>06 Elseworth Road Belgravia<br />Zimbabwe</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-black/60">
                <Phone className="w-5 h-5 text-ranch-wheat flex-shrink-0" />
                <a href="tel:+263773416592" className="hover:text-black font-medium transition-colors">(263) 773-416592</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-black/60">
                <Mail className="w-5 h-5 text-ranch-wheat flex-shrink-0" />
                <a href="mailto:info@heritagebeefzim.com" className="hover:text-black font-medium transition-colors break-all">info@heritagebeefzim.com</a>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 sm:contents gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-5">
                <h4 className="font-bold text-xs uppercase tracking-widest text-ranch-wheat/80 border-b border-black/5 pb-2">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => scrollTo(link.href)}
                        className="text-black/50 hover:text-black text-sm font-medium transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/5 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="text-black/40 text-xs font-medium order-2 md:order-1">
              &copy; {new Date().getFullYear()} Heritage Beef Zim Co. <br className="sm:hidden" /> All rights reserved.
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 order-1 md:order-2">
              <div className="flex items-center gap-6">
                <button onClick={() => toast.info('Privacy Policy coming soon')} className="text-black/40 hover:text-black text-xs font-bold uppercase tracking-tighter transition-colors">Privacy</button>
                <button onClick={() => toast.info('Terms coming soon')} className="text-black/40 hover:text-black text-xs font-bold uppercase tracking-tighter transition-colors">Terms</button>
              </div>
              
              <div className="flex items-center gap-5">
                {[
                  { icon: Linkedin, href: 'https://linkedin.com' },
                  { icon: Facebook, href: 'https://facebook.com' },
                  { icon: Youtube, href: 'https://youtube.com' }
                ].map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" 
                     className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/40 hover:bg-ranch-terracotta hover:text-black transition-all">
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// import React, { useState } from 'react';
// import { toast } from 'sonner';
// import {
//   ArrowRight, MapPin, Phone, Mail,
//   Linkedin, Facebook, Youtube
// } from 'lucide-react';

// const footerLinks = {
//   'Value Chain': [
//     { label: 'Genetics Program', href: '#value-chain' },
//     { label: 'Custom Feeding', href: '#value-chain' },
//     { label: 'Processing', href: '#value-chain' },
//     { label: 'Distribution', href: '#value-chain' },
//     { label: 'Retail Partners', href: '#value-chain' },
//   ],
//   'Services': [
//     { label: 'Breeding Stock', href: '#services' },
//     { label: 'Feedlot Services', href: '#services' },
//     { label: 'Custom Processing', href: '#services' },
//     { label: 'Wholesale', href: '#services' },
//     { label: 'Quality Assurance', href: '#services' },
//   ],
//   'Company': [
//     { label: 'About Heritage Beef Zim', href: '#hero' },
//     { label: 'Operations Dashboard', href: '#operations' },
//     { label: 'Photo Gallery', href: '#gallery' },
//     { label: 'Partner Testimonials', href: '#testimonials' },
//     { label: 'Sustainability', href: '#services' },
//   ],
//   'Investors': [
//     { label: 'Investment Tiers', href: '#investment' },
//     { label: 'Financial Projections', href: '#investment' },
//     { label: 'ROI Calculator', href: '#investment' },
//     { label: 'Annual Reports', href: '#contact' },
//     { label: 'Partner Portal', href: '#contact' },
//   ],
// };

// const Footer: React.FC = () => {
//   const [email, setEmail] = useState('');

//   const scrollTo = (href: string) => {
//     const id = href.replace('#', '');
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleNewsletter = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       toast.error('Please enter a valid email address');
//       return;
//     }
//     toast.success('Subscribed successfully!', {
//       description: 'You\'ll receive our quarterly industry insights and company updates.',
//     });
//     setEmail('');
//   };

//   return (
//     <footer className="bg-ranch-forest-dark text-black">
//       {/* Newsletter Banner */}
//       <div className="border-b border-black/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div>
//               <h3 className="font-serif text-2xl font-bold mb-2">Stay Informed</h3>
//               <p className="text-black/60 text-sm">
//                 Receive quarterly insights on market trends, operational updates, and investment opportunities.
//               </p>
//             </div>
//             <form onSubmit={handleNewsletter} className="flex gap-3">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email address"
//                 className="flex-grow px-4 py-3 rounded-xl bg-white/10 border border-black/20 text-black placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-ranch-wheat/30 focus:border-ranch-wheat text-sm transition-all"
//               />
//               <button
//                 type="submit"
//                 className="bg-ranch-terracotta hover:bg-ranch-terracotta-dark px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg flex items-center gap-2 flex-shrink-0"
//               >
//                 Subscribe
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Main Footer */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
//           {/* Brand */}
//           <div className="col-span-2">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 bg-ranch-terracotta rounded-lg flex items-center justify-center">
//                 <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 2L2 7l10 5 10-5-10-5z" />
//                   <path d="M2 17l10 5 10-5" />
//                   <path d="M2 12l10 5 10-5" />
//                 </svg>
//               </div>
//               <div>
//                 <span className="font-serif text-lg font-bold">Heritage Beef Zim</span>
//                 <span className="block text-ranch-wheat text-[9px] uppercase tracking-[0.2em] -mt-0.5">
//                   Integrated Value Chain
//                 </span>
//               </div>
//             </div>
//             <p className="text-black/50 text-sm leading-relaxed mb-6 max-w-xs">
//               A vertically integrated beef operation delivering premium quality through complete supply chain control — from genetics to your table.
//             </p>
//             <div className="space-y-2 text-sm">
//               <div className="flex items-center gap-2 text-black/50">
//                 <MapPin className="w-4 h-4 text-ranch-wheat" />
//                06 Elseworth Road Belgravia<br />Zimbabwe
//               </div>
//               <div className="flex items-center gap-2 text-black/50">
//                 <Phone className="w-4 h-4 text-ranch-wheat" />
//                 <a href="tel:+263773416592" className="hover:text-white transition-colors">(263) 773-416592</a>
//               </div>
//               <div className="flex items-center gap-2 text-black/50">
//                 <Mail className="w-4 h-4 text-ranch-wheat" />
//                 <a href="mailto:info@heritagebeefzim.com" className="hover:text-white transition-colors">info@heritagebeefzim.com</a>
//               </div>
//             </div>
//           </div>

//           {/* Link Columns */}
//           {Object.entries(footerLinks).map(([title, links]) => (
//             <div key={title}>
//               <h4 className="font-semibold text-sm mb-4 text-ranch-wheat">{title}</h4>
//               <ul className="space-y-2.5">
//                 {links.map((link) => (
//                   <li key={link.label}>
//                     <button
//                       onClick={() => scrollTo(link.href)}
//                       className="text-black/50 hover:text-white text-sm transition-colors"
//                     >
//                       {link.label}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-white/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-black/40 text-xs">
//               &copy; {new Date().getFullYear()} Heritage Beef Zim Co. All rights reserved.
//             </div>
//             <div className="flex items-center gap-4">
//               <button onClick={() => toast.info('Privacy Policy page coming soon')} className="text-black/40 hover:text-white text-xs transition-colors">Privacy Policy</button>
//               <button onClick={() => toast.info('Terms of Service page coming soon')} className="text-black/40 hover:text-white text-xs transition-colors">Terms of Service</button>
//               <div className="flex items-center gap-3 ml-4">
//                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-white transition-colors">
//                   <Linkedin className="w-4 h-4" />
//                 </a>
//                 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-white transition-colors">
//                   <Facebook className="w-4 h-4" />
//                 </a>
//                 <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-white transition-colors">
//                   <Youtube className="w-4 h-4" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
