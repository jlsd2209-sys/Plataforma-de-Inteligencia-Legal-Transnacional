import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoShield from '@/assets/logo.png.png';
import { Particles } from '@/components/Particles';

const navItems = [{
  href: '#home',
  label: 'Inicio'
}, {
  href: '#servicios',
  label: 'Servicios'
}, {
  href: '#nosotros',
  label: 'Nosotros'
}, {
  href: '#contacto',
  label: 'Contacto'
}];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = navItems.map((item) => item.href.substring(1));
      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy-dark/95 backdrop-blur-md shadow-lg' : 'bg-navy-dark/80 backdrop-blur-sm'}`}>
        <nav className="container flex justify-between items-center h-24">
          
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')} 
            className="flex items-center gap-2 md:gap-4 group cursor-pointer max-w-[80%] md:max-w-none"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <div className="relative flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-out w-[48px] h-[48px] md:w-[64px] md:h-[64px] group-hover:w-[54px] group-hover:h-[54px] md:group-hover:w-[72px] md:group-hover:h-[72px]">
              <img 
                alt="LAP Global & IA Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]" 
                src={logoShield} 
              />
            </div>
            
            <span 
              className={`inline-block font-serif text-lg md:text-xl xl:text-2xl font-bold leading-tight transition-all duration-300 ${
                isLogoHovered ? 'gradient-text-gold' : 'text-white'
              }`}
            >
              Plataforma de Inteligencia Legal Transnacional
            </span>
          </a>

          <ul className="hidden md:flex gap-10">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              const isHovered = hoveredLink === item.href;
              const applyGold = isActive || isHovered;

              return (
                <li key={item.href}>
                  <a 
                    href={item.href} 
                    onClick={(e) => handleNavClick(e, item.href)} 
                    onMouseEnter={() => setHoveredLink(item.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`relative font-medium py-2 text-lg transition-all duration-300 inline-block cursor-pointer
                      ${isActive ? 'font-bold scale-105' : 'hover:scale-105'}`}
                  >
                    <span className={applyGold ? 'gradient-text-gold inline-block' : 'text-white'}>
                      {item.label}
                    </span>
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold to-gold-bright transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
                  </a>
                </li>
              );
            })}
          </ul>

          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={32} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <div className="md:hidden">
            {/* Overlay oscuro para apagar el fondo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menú Flotante más estrecho (w-40 en lugar de w-48) */}
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'tween', duration: 0.3 }} 
              className="fixed top-0 right-0 w-40 h-auto pb-8 border-l border-b border-[#c5a059]/40 rounded-bl-3xl px-5 pt-24 z-[70] shadow-[-15px_15px_30px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              {/* Fondo del panel */}
              <div className="absolute inset-0 z-0">
                <img src="/fondo-servicios.jpg.png" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
              </div>

              {/* Partículas */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                <Particles count={15} />
              </div>

              {/* Botón Cerrar */}
              <button className="absolute top-6 right-5 text-white z-10" onClick={() => setIsMenuOpen(false)}>
                <X size={32} />
              </button>
              
              {/* Enlaces */}
              <ul className="flex flex-col gap-4 relative z-10">
                {navItems.map((item, index) => (
                  <motion.li 
                    key={item.href} 
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: index * 0.1 }}
                  >
                    <a 
                      href={item.href} 
                      onClick={(e) => handleNavClick(e, item.href)} 
                      className={`text-lg md:text-xl font-medium transition-all duration-300 inline-block ${
                        activeSection === item.href.substring(1) ? 'gradient-text-gold' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
