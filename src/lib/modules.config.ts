import type { ModuleConfig } from '@/types/chat.types';

export const MODULES_DB: ModuleConfig[] = [
  {
    name: 'Monitor de Riesgo',
    hook: 'webhook-riesgo',
    icon: '🌐',
    demoText:
      'En la versión verificada para clientes, nuestro módulo cruza esta información en tiempo real para anticipar vulnerabilidades corporativas antes de que ocurran. Nuestro sistema es capaz de predecir contingencias binacionales evaluando miles de indicadores diarios. Para obtener un reporte completo, blindar sus operaciones y desbloquear la matriz predictiva aplicada a su caso, contacte a nuestros especialistas para habilitar su cuenta.',
    loadingText: 'Analizando su consulta...',
  },
  {
    name: 'Análisis Legal',
    hook: 'webhook-penal',
    icon: '⚖️',
    demoText:
      'En nuestro entorno verificado, este módulo estructura una defensa comparada, cruzando legislación vigente de Argentina y/o Venezuela junto con los tratados bilaterales para encontrar la mejor ruta de mitigación, generando dictámenes con niveles altos de precisión argumentativa. Para un análisis confidencial y detallado por nuestra red de expertos, inicie su proceso de alta como cliente.',
    loadingText: 'Analizando su consulta...',
  },
  {
    name: 'Auditoría Documental',
    hook: 'webhook-auditoria',
    icon: '📄',
    demoText:
      'En la red verificada, este servicio es capaz de procesar cientos de folios en segundos, detectando cláusulas abusivas, contingencias ocultas y vacíos normativos que el ojo humano podría pasar por alto. Si desea someter su documentación a nuestro ecosistema legal bajo estricto secreto profesional, contacte a nuestro equipo.',
    loadingText: 'Analizando su consulta...',
  },
  {
    name: 'Memoria Institucional',
    hook: 'webhook-memoria',
    icon: '🏛️',
    demoText:
      'Este módulo exclusivo permite a nuestros clientes interactuar con el 'Cerebro Histórico' de sus casos, encontrando precedentes exactos, respuestas estratégicas en tiempo real y estandarizando sus decisiones legales victoriosas en el pasado. Su historial legal es su mayor activo; contáctenos para digitalizar y blindar su memoria corporativa.',
    loadingText: 'Analizando su consulta...',
  },
  {
    name: 'Informes Automáticos',
    hook: 'webhook-informes',
    icon: '📊',
    demoText:
      'En la versión sin restricciones, nuestro sistema cruza la data solicitada y emite un reporte estructurado de los casos, argumentado y maquetado con los estándares más altos, listos para ser presentados ante Juntas Directivas, ahorrando días de trabajo analítico. Habilite su usuario para obtener documentos listos para la acción.',
    loadingText: 'Analizando su consulta...',
  },
  {
    name: 'Boletín Jurídico',
    hook: 'webhook-boletin',
    icon: '📖',
    demoText:
      'A diferencia de un boletín tradicional, este modelo monitorea gacetas oficiales y despachos legislativos 24/7, filtrando únicamente los cambios normativos que impactan directamente en el sector de cada cliente. No sufra sorpresas legales; contáctenos para configurar su radar personalizado',
    loadingText: 'Analizando su consulta...',
  },
];

export const COLOR_PALETTES = {
  dark: {
    appBG: 'bg-[#151f32]',
    sidebarOverlay: 'bg-[#0a1526]/85 backdrop-blur-[2px]',
    sidebarBtnText: 'text-gray-200',
    sidebarBtnHover: 'hover:bg-[#111827]',
    sidebarBtnActive: 'bg-[#1f2937] border-[#c5a059]',
    mainHeaderBG: 'bg-[#151f32]/90',
    mainHeaderBorder: 'border-[#1e2a40]',
    mainTitle: 'text-gray-100',
    greetingP: 'text-gray-300',
    botBubble: 'bg-[#1e2a40] text-gray-200 border-[#c5a059]',
    userBubble: 'bg-[#2a303c] text-gray-100 border-gray-700',
    footerBG: 'bg-[#1e2a40]',
    textArea: 'text-gray-100',
    sendBtn:
      'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#c5a059]/20',
    scrollBtn:
      'bg-[#151f32] text-[#c5a059] border border-[#c5a059]/50 hover:bg-[#1e2a40] shadow-xl',
  },
  light: {
    appBG: 'bg-[#fdfcf5]',
    sidebarOverlay: 'bg-[#0a1526]/95',
    sidebarBtnText: 'text-gray-200',
    sidebarBtnHover: 'hover:bg-[#111827]',
    sidebarBtnActive: 'bg-[#1f2937] border-[#c5a059]',
    mainHeaderBG: 'bg-[#fdfcf5]/80',
    mainHeaderBorder: 'border-[#c5a059]/30',
    mainTitle: 'text-[#0a1526]',
    greetingP: 'text-[#2a303c]',
    botBubble: 'bg-[#eee7d5] text-[#2a303c] border-[#c5a059]',
    userBubble: 'bg-[#151f32] text-white border-none',
    footerBG: 'bg-[#eee7d5]',
    textArea: 'text-[#2a303c]',
    sendBtn: 'bg-[#0a1526] text-[#c5a059] border border-[#0a1526] hover:bg-[#111827]',
    scrollBtn:
      'bg-[#0a1526] text-[#c5a059] border border-[#0a1526] hover:bg-[#111827] shadow-lg',
  },
};
