import { motion } from 'framer-motion';
import { Flag, Brain, Globe, GraduationCap, Video, Award } from 'lucide-react';
import { Particles } from '@/components/Particles';

const advantages = [{
  icon: Flag,
  title: 'Doble Jurisdicción',
  description: 'Matrícula profesional activa en Venezuela y Argentina. Capacidad legal para ejercer plenamente en ambos países.',
  badge: {
    icon: Award,
    text: 'Matrículas'
  },
  flags: ['🇻🇪', '🇦🇷']
}, {
  icon: Brain,
  title: 'Especialización en IA',
  description: 'Postgrado en Inteligencia Artificial Generativa, Prompting y Derecho (Universidad de Buenos Aires).',
  badge: {
    icon: GraduationCap,
    text: 'Postgrado UBA'
  },
  hasPulse: true
}, {
  icon: Globe,
  title: 'Alcance Regional',
  description: 'Atención a clientes en Argentina y Venezuela, de manera presencial y virtual. Cobertura transfronteriza real.',
  badge: {
    icon: Video,
    text: 'Capacidad PJN'
  },
  hasOrbit: true
}];

export const AdvantagesSection = () => {
  return (
    <section id="nosotros" className="py-14 bg-gradient-to-b from-navy-dark to-charcoal pt-[40px] pb-[40px]">
      <div className="container mx-auto px-4 md:px-8">     
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-10"
        >
          {/* Hemos reducido dramáticamente el tamaño de la fuente para que sea un sub-título */}
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-serif font-bold mb-6 gradient-text-gold pb-2">           
            ¿Plataforma de Inteligencia Legal Transnacional?
          </h2>
        </motion.div>

        {/* CLAVE: max-w-[320px] comprime las tarjetas en móvil. md:max-w-[1050px] les da espacio en PC. md:gap-12 las separa. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-[320px] md:max-w-[1050px] mx-auto">
          {advantages.map((advantage, index) => (
            <motion.div 
              key={advantage.title} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: index * 0.1 }} 
              className="group relative bg-cream/5 backdrop-blur-sm border-2 border-gold/30 rounded-2xl p-6 text-center transition-all duration-400 hover:-translate-y-2 hover:border-gold-bright hover:shadow-2xl hover:shadow-cyan/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              
              {/* Círculo del icono: w-16 en móvil, w-20 en escritorio */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 flex items-center justify-center bg-gradient-to-br from-gold/20 to-cyan/10 rounded-full border-2 border-gold">
                <advantage.icon className="w-8 h-8 md:w-10 md:h-10 text-gold-bright relative z-10" />
                
                {advantage.flags && (
                  <div className="absolute -top-1 -right-1 flex gap-1 text-lg md:text-2xl">
                    {advantage.flags.map((flag, i) => <span key={i}>{flag}</span>)}
                  </div>
                )}
                
                {advantage.hasPulse && (
                  <div className="absolute w-[120%] h-[120%] rounded-full border-2 border-cyan" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
                )}
                
                {advantage.hasOrbit && (
                  <div className="absolute w-[140%] h-[140%] rounded-full border border-dashed border-gold opacity-30" style={{ animation: 'rotate-orbit 20s linear infinite' }} />
                )}
              </div>

              <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-3 relative z-10 leading-tight">
                {advantage.title}
              </h3>
              
              <p className="text-sm text-cream-light/80 mb-5 leading-relaxed relative z-10">
                {advantage.description}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-gold/20 to-gold-bright/10 rounded-full text-[12px] md:text-sm text-gold-bright border border-gold/50 relative z-10">
                <advantage.badge.icon className="w-3 h-3 md:w-4 md:h-4" />
                {advantage.badge.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
