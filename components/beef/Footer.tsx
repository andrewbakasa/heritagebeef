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
  const [isLoading, setIsLoading] = useState(false);

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // const handleNewsletter = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     toast.error('Please enter a valid email address');
  //     return;
  //   }
  //   toast.success('Subscribed successfully!', {
  //     description: 'You\'ll receive our quarterly industry insights and company updates.',
  //   });
  //   setEmail('');
  // };

  const handleNewsletter = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast.error('Please enter a valid email address');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Something went wrong');

    toast.success('Subscribed successfully!', {
      description: 'You\'ll receive our quarterly industry insights and company updates.',
    });
    setEmail('');
  } catch (error: any) {
    toast.error(error.message || 'Failed to subscribe');
  } finally {
    setIsLoading(false);
  }
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
              {/* <button
                type="submit"
                className="bg-ranch-terracotta hover:bg-ranch-terracotta-dark px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 flex-shrink-0"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button> */}

            
              <button
                type="submit"
                disabled={isLoading}
                className="bg-ranch-terracotta hover:bg-ranch-terracotta-dark disabled:opacity-50 ... "
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
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