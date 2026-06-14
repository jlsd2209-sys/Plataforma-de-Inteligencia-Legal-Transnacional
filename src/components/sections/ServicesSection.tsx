import { motion } from 'framer-motion';
import { Globe, Scale, FileSearch, Landmark, FileBarChart, Newspaper } from 'lucide-react';
import { Particles } from '../Particles';
import { Link } from 'react-router-dom';

/* ── CONFIGURACIÓN DE DISEÑO ── */
const SECTION_PADDING = 'py-14'; 
const TITLE_SIZE = 'text-3xl md:text-4xl'; 
/* ───────────────────────────── */

const modulesList = [
  { icon: Globe, title: 'Monitor de Riesgo', hook: 'webhook-riesgo', desc: 'Vigilancia continua de indicadores de riesgo preventivo.' },
  { icon: Scale, title: 'Análisis Legal', hook: 'webhook-penal', desc: 'Evaluación jurisdiccional transnacional asistida por IA.' },
  { icon: FileSearch, title: 'Auditoría Documental', hook: 'webhook-auditoria', desc: 'Análisis exhaustivo e inteligente de documentación legal.' },
  { icon: Landmark, title: 'Memoria Institucional', hook: 'webhook-memoria', desc: 'Repositorio de precedentes y jurisprudencia corporativa.' },
  { icon: FileBarChart, title: 'Informes Automáticos', hook: 'webhook-informes', desc: 'Reportes y dictámenes generados en tiempo real.' },
  { icon: Newspaper, title: 'Boletín Jurídico', hook: 'webhook-boletin', desc: 'Actualizaciones normativas periódicas mediante alertas.' }
];

const Card = ({ item, index }: {item: typeof modulesList[0]; index: number;}) => (
  <Link to={`/asistente?modulo=${item.hook}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.04 }}
      // Redujimos el py (padding vertical) para que sean menos altas
      className="group relative flex flex-col text-center px-4 py-5 md:px-6 md:py-6 bg-cream/5 backdrop-blur-md rounded-2xl border-2 border-[#c5a059]/30 transition-all duration-400 hover:border-[#c5a059] hover:shadow-2xl hover:shadow-cyan/20 overflow-hidden cursor-pointer h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-0" />
      
      <div className="relative z-10 flex flex-col h-full justify-center items-center">
        {/* Ícono con menos espacio debajo (mb-3 en vez de mb-6) */}
        <div className="text-[#c5a059] mb-3 flex justify-center">
          <item.icon className="w-12 h-12 relative z-10" strokeWidth={1.5} />
        </div>

        {/* Título casi pegado a la descripción (mb-1) */}
        <div className="flex items-center justify-center mb-1">
          <span className="text-lg font-serif font-bold text-white leading-tight">
            {item.title}
          </span>
        </div>

        {/* Descripción pegada al título */}
        <p className="text-gray-300 text-sm leading-relaxed mt-1">
          {item.desc}
        </p>
      </div>
    </motion.div>
  </Link>
);

export const ServicesSection = () => {
  return (
    <section id="servicios" className={`${SECTION_PADDING} relative pt-[40px] pb-[40px]`}>
      
      {/* ── FONDO ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src="/fondo-servicios.jpg.png" alt="" onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Particles count={50} />
      </div>

      <div className="relative z-20 container mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className={`${TITLE_SIZE} font-serif font-bold gradient-text-gold`}>
            Centro de Inteligencia Legal Transnacional
          </h2>
        </motion.div>
        
        {/* LA MAGIA DEL GRID: 
            gap-x-10 (separa a los lados)
            gap-y-12 (separa filas arriba y abajo)
            max-w-[1200px] (permite que se estiren más hacia las esquinas) */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8 md:gap-x-10 md:gap-y-12 max-w-[1200px] mx-auto`}>
          {modulesList.map((item, i) => <Card key={item.title} item={item} index={i} />)}
        </div>
      </div>
    </section>
  );
};
