import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, LogIn, Shield, Users } from 'lucide-react'; 
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import { SafeUser } from '@/app/types';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Value Chain', href: '#value-chain' },
  { label: 'Operations', href: '#operations' },
  { label: 'Services', href: '#services' },
  { label: 'Investment', href: '#investment' },
  { label: 'Gallery', href: '#gallery' },
  // { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  currentUser: SafeUser | null|undefined;
  forceScrolled?: boolean // Changed to lowercase boolean for TS best practices
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, forceScrolled }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      if (pathname === '/') {
        const sections = navLinks.map(l => l.href.replace('#', ''));
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.getBoundingClientRect().top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Combined logic to force scrolled state appearance
  const isScrolled = Boolean(forceScrolled || scrolled);

  const scrollTo = (href: string) => {
    if (pathname !== '/') {
      router.push(`/${href}`);
      setMobileOpen(false);
      return;
    }

    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileOpen(false);
  };
  const isAdmin = (currentUser?.isAdmin) || currentUser?.roles?.some((r: string) => ['admin'].includes(r.toLowerCase()));
  const hasAccessToData = (currentUser?.isAdmin) || currentUser?.roles?.some((r: string) => ['admin', 'engineer','dataCapture'].includes(r.toLowerCase()));

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <button onClick={() => scrollTo('#hero')} className="flex items-center gap-3 group focus:outline-none">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-all shadow-lg ${
                isScrolled ? 'bg-ranch-forest-dark' : 'bg-white/10 backdrop-blur-sm border border-white/20'
            }`}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-ranch-terracotta" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="text-left">
              <span className={`block font-serif text-xl font-black tracking-tight leading-none transition-colors ${
                isScrolled ? 'text-ranch-forest-dark' : 'text-white'
              }`}>
                Heritage Beef
              </span>
              <span className={`block text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                isScrolled ? 'text-ranch-terracotta' : 'text-ranch-terracotta/90'
              }`}>
                Zimbabwe
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`relative px-3 py-2 text-sm font-bold transition-all duration-200 group ${
                    isScrolled 
                      ? isActive ? 'text-ranch-forest-dark' : 'text-gray-500 hover:text-ranch-forest-dark'
                      : isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-ranch-terracotta transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                  }`} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 border-r border-gray-300/30 pr-4 mr-1">
              {currentUser ? (
                <>
                  {isAdmin && (
                  
                      <button 
                        onClick={() => router.push('/users')}
                        className={`p-2 rounded-full transition-all hover:scale-110 ${isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'}`}
                        title="User Management"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                    )}  
                     {hasAccessToData && (
                      <button 
                        onClick={() => router.push('/di')}
                        className={`p-2 rounded-full transition-all hover:scale-110 ${isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'}`}
                        title="Data input"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                   
                  )}
                  
                  <button 
                    onClick={() => router.push(`/user/${currentUser.id}`)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-bold ${
                      isScrolled ? 'bg-ranch-forest-dark text-black hover:bg-gray-100' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title="Account"
                  >
                    <UserIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => signOut()}
                    className="p-2 text-red-500 hover:scale-110 transition-transform"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={loginModal.onOpen}
                  className={`text-sm font-bold px-4 py-2 transition-all hover:opacity-80 ${
                    isScrolled ? 'text-ranch-forest-dark' : 'text-white'
                  }`}
                >
                  Login
                </button>
              )}
            </div>

            <button
              onClick={() => scrollTo('#contact')}
              className={`hidden sm:block px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 hover:-translate-y-0.5 shadow-md hover:shadow-xl ${
                  isScrolled 
                  ? 'bg-ranch-forest-dark text-black hover:bg-gray-100' 
                  : 'bg-ranch-terracotta text-white hover:bg-gray-100 shadow-ranch-terracotta/20'
                }`}
            >
              Partner With Us
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-black hover:bg-gray-100' : 'text-black hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden absolute top-full left-0 w-full transition-all duration-300 ease-in-out ${
        mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="mx-4 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 space-y-1">
          {navLinks.map((link) => (
            <button 
              key={link.href} 
              onClick={() => scrollTo(link.href)} 
              className="block w-full text-left px-4 py-3 text-ranch-forest-dark hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold"
            >
              {link.label}
            </button>
          ))}
          
          <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
            {currentUser ? (
              <>
                  {isAdmin && (
                    <button 
                      onClick={() => { router.push('/users'); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-ranch-forest-dark hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold"
                >
                      <Users className="w-4 h-4 text-ranch-terracotta" />
                      Users
                    </button>
                  )}
                {hasAccessToData && (
                    <button 
                      onClick={() => { router.push('/di'); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-ranch-forest-dark hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold"
                >
                      <Shield className="w-4 h-4 text-ranch-terracotta" />
                      Data Input
                    </button>
                  )}
                <button 
                  onClick={() => { router.push(`/user/${currentUser.id}`); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-ranch-forest-dark hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold"
                >
                  <UserIcon className="w-4 h-4 text-ranch-terracotta" /> 
                  My Profile
                </button>

                <button 
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" /> 
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { loginModal.onOpen(); setMobileOpen(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-ranch-forest-dark hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold"
                >
                  <LogIn className="w-4 h-4 text-ranch-terracotta" /> 
                  Login
                </button>

                <button 
                  onClick={() => { registerModal.onOpen(); setMobileOpen(false); }} 
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-ranch-forest-dark px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Create Account
                </button>
              </>
            )}

            <button 
              onClick={() => scrollTo('#contact')} 
              className={`w-full bg-ranch-terracotta text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-ranch-terracotta-dark transition-colors ${
                  isScrolled 
                  ? 'bg-ranch-forest-dark text-black hover:bg-black' 
                  : 'bg-ranch-terracotta text-white hover:bg-gray-100 shadow-ranch-terracotta/20'
                }`}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;