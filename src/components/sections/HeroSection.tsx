import { motion } from 'framer-motion';
import { Calendar, ArrowDown } from 'lucide-react';
import { Particles } from '../Particles';
import bgCircles from '@/assets/bg-circles.png';

export const HeroSection = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden py-[100px] pb-0 pt-[50px]">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={bgCircles} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-dark/40" />
      </div>
      
      {/* Animated particles */}
      <Particles count={40} />

      {/* World map pattern overlay */}
      <div className="absolute inset-0 opacity-10 pt-[50px] pb-[50px]">
        <svg className="w-full h-full pt-0" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <path d="M100,200 L150,180 L200,190 L250,170 L300,180 L350,200 L400,190 L450,200 L500,180 L550,190 L600,200 L650,180 L700,190 L750,200 L800,180 L850,190 L900,200 L950,180 L1000,190 L1050,200 L1100,180" stroke="hsl(var(--navy-medium))" strokeWidth="1" fill="none" />
          <path d="M100,300 L150,320 L200,310 L250,330 L300,320 L350,300 L400,310 L450,300 L500,320 L550,310 L600,300 L650,320 L700,310 L750,300 L800,320 L850,310 L900,300 L950,320 L1000,310 L1050,300 L1100,320" stroke="hsl(var(--navy-medium))" strokeWidth="1" fill="none" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 text-center max-w-5xl px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          /* CAMBIO 1: mb-6 -> mb-3 md:mb-6 (Compactamos el margen inferior solo en móvil)
            CAMBIO 2: pb-2 -> pb-0 md:pb-2 (Eliminamos el padding inferior en móvil, mantenemos md:)
          */
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 md:mb-6 gradient-text-gold leading-tight pb-0 md:pb-1"
        >
          Innovación y Eficiencia Legal con IA 
        </motion.h1>
                     
        <motion.p 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }} 
          /* CAMBIO AQUÍ: Cambiamos md:text-xl por md:text-2xl */
          className="text-lg md:text-2xl text-cream-light/90 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Gestión legal automatizada mediante inteligencia artificial
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }} 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="#contacto" onClick={(e) => handleNavClick(e, '#contacto')} className="button-pulse inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-bright text-navy-dark font-semibold rounded-full transition-all hover:shadow-xl hover:shadow-gold/40">
            <Calendar size={20} />
            Solicitar Consulta
          </a>
          <a href="#servicios" onClick={(e) => handleNavClick(e, '#servicios')} className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-full transition-all hover:bg-white hover:text-navy-dark">
            <ArrowDown size={20} />
            Conocer Servicios
          </a>
        </motion.div>
      </div>
    </section>
  );
};
