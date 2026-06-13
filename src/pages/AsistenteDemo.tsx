import { useState, useRef, useEffect } from 'react';
import logoShield from '@/assets/logo.png.png';
import { useSearchParams } from 'react-router-dom';
import { Particles } from '@/components/Particles';
import {
  Sun, Moon, Menu, X, LogOut, Trash2, Copy, Check,
  ThumbsUp, ThumbsDown, Paperclip, Mic, Square, Share2, Volume2, VolumeX, Share, Edit2, ChevronDown, ChevronUp, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { id: string; sender: 'user' | 'bot' | 'loading'; text: string; };

// ── Tipo para los modales de confirmación ──
type ConfirmModal = {
  type: 'logout' | 'clearChat';
  modulo?: string;
} | null;

const MODULES_DB = [
  { name: 'Monitor de Riesgo', hook: 'webhook-riesgo', icon: '🌐', demoText: "En la versión verificada para clientes, nuestro módulo cruza esta información en tiempo real para anticipar vulnerabilidades corporativas antes de que ocurran. Nuestro sistema es capaz de predecir contingencias binacionales evaluando miles de indicadores diarios. Para obtener un reporte completo, blindar sus operaciones y desbloquear la matriz predictiva aplicada a su caso, contacte a nuestros especialistas para habilitar su cuenta.", loadingText: "Analizando su consulta..." },
  { name: 'Análisis Legal', hook: 'webhook-penal', icon: '⚖️', demoText: "En nuestro entorno verificado, este módulo estructura una defensa comparada, cruzando legislación vigente de Argentina y/o Venezuela junto con los tratados bilaterales para encontrar la mejor ruta de mitigación, generando dictámenes con niveles altos de precisión argumentativa. Para un análisis confidencial y detallado por nuestra red de expertos, inicie su proceso de alta como cliente.", loadingText: "Analizando su consulta..." },
  { name: 'Auditoría Documental', hook: 'webhook-auditoria', icon: '📄', demoText: "En la red verificada, este servicio es capaz de procesar cientos de folios en segundos, detectando cláusulas abusivas, contingencias ocultas y vacíos normativos que el ojo humano podría pasar por alto. Si desea someter su documentación a nuestro ecosistema legal bajo estricto secreto profesional, contacte a nuestro equipo.", loadingText: "Analizando su consulta..." },
  { name: 'Memoria Institucional', hook: 'webhook-memoria', icon: '🏛️', demoText: "Este módulo exclusivo permite a nuestros clientes interactuar con el 'Cerebro Histórico' de sus casos, encontrando precedentes exactos, respuestas estratégicas en tiempo real y estandarizando sus decisiones legales victoriosas en el pasado. Su historial legal es su mayor activo; contáctenos para digitalizar y blindar su memoria corporativa.", loadingText: "Analizando su consulta..." },
  { name: 'Informes Automáticos', hook: 'webhook-informes', icon: '📊', demoText: "En la versión sin restricciones, nuestro sistema cruza la data solicitada y emite un reporte estructurado de los casos, argumentado y estructurado con los estándares más altos, listos para ser presentados ante Juntas Directivas, ahorrando días de trabajo analítico. Habilite su usuario para obtener documentos listos para la acción.", loadingText: "Analizando su consulta..." },
  { name: 'Boletín Jurídico', hook: 'webhook-boletin', icon: '📖', demoText: "A diferencia de un boletín tradicional, este modelo monitorea gacetas oficiales y despachos legislativos 24/7, filtrando únicamente los cambios normativos que impactan directamente en el sector de cada cliente. No sufra sorpresas legales; contáctenos para configurar su radar personalizado.", loadingText: "Analizando su consulta..." }
];

const BotMessageActions = ({ text, theme, showToast }: { text: string; theme: string; showToast: (msg: string) => void; }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'up' | 'down'>('none');

  useEffect(() => { return () => { if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }; }, [isSpeaking]);

  const handleCopy = () => { navigator.clipboard.writeText(text.replace(/<[^>]*>?/gm, '')); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleShare = async () => { const plainText = text.replace(/<[^>]*>?/gm, ''); if (navigator.share) { try { await navigator.share({ title: 'Análisis Legal - Unidad de IA', text: plainText }); } catch (error) { console.log('Compartir cancelado', error); } } else { handleCopy(); showToast("Respuesta copiada."); } };
  const handleSpeak = () => { if (!('speechSynthesis' in window)) { showToast("Navegador no soporta lectura en voz alta."); return; } if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); } else { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>?/gm, '')); utterance.lang = 'es-VE'; utterance.onend = () => setIsSpeaking(false); utterance.onerror = () => setIsSpeaking(false); window.speechSynthesis.speak(utterance); setIsSpeaking(true); } };
  const handleFeedback = (type: 'up' | 'down') => { if (feedback !== 'none') return; setFeedback(type); showToast("Evaluación simulada en Modo Demo."); };

  const btnClass = `p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]' : 'text-gray-500 hover:text-[#c5a059] hover:bg-[#eee7d5]'}`;

  return (
    <div className="flex items-center gap-1 ml-2 mt-1">
      <button onClick={handleSpeak} className={btnClass}>{isSpeaking ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} />}</button>
      <button onClick={handleCopy} className={btnClass}>{copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}</button>
      <button onClick={handleShare} className={btnClass}><Share2 size={14} /></button>
      <button onClick={() => handleFeedback('up')} className={`${btnClass} ${feedback === 'up' ? '!text-green-500' : ''}`}><ThumbsUp size={14} /></button>
      <button onClick={() => handleFeedback('down')} className={`${btnClass} ${feedback === 'down' ? '!text-red-500' : ''}`}><ThumbsDown size={14} /></button>
    </div>
  );
};

const UserMessageBubble = ({ msg, theme, currentColors, onEdit }: { msg: Message; theme: string; currentColors: any; onEdit: (text: string) => void; }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isLong = msg.text.length > 300;
  const displayText = isLong && !expanded ? msg.text.substring(0, 300) + '...' : msg.text;
  const handleCopy = () => { navigator.clipboard.writeText(msg.text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const btnClass = `p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]' : 'text-gray-500 hover:text-[#c5a059] hover:bg-[#eee7d5]'}`;

  return (
    <div className="flex flex-col items-end max-w-[90%] md:max-w-[85%]">
      <div className={`${currentColors.userBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tr-none shadow-md`}><p className="text-[15px] md:text-[16px] leading-normal md:leading-relaxed whitespace-pre-wrap break-words">{displayText}</p></div>
      <div className="flex items-center gap-1 mr-2 mt-1">
        {isLong && <button onClick={() => setExpanded(!expanded)} className={btnClass}>{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>}
        <button onClick={handleCopy} className={btnClass}>{copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}</button>
        <button onClick={() => onEdit(msg.text)} className={btnClass}><Edit2 size={14} /></button>
      </div>
    </div>
  );
};

export default function AsistenteDemo({ onLogout }: { onLogout: () => void }) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('modulo') || 'webhook-riesgo';
  const initialModule = MODULES_DB.find(m => m.hook === urlParam) || MODULES_DB[0];
  const [moduloActivo, setModuloActivo] = useState(initialModule.name);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // ── Estado para modales de confirmación personalizados ──
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>(null);

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const storageKey = `lap_history_guest`;
  const [chatsHistory, setChatsHistory] = useState<Record<string, Message[]>>(() => { try { const saved = localStorage.getItem(storageKey); return saved ? JSON.parse(saved) : {}; } catch { return {}; } });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessages = chatsHistory[moduloActivo] || [];
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(chatsHistory)); }, [chatsHistory]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [currentMessages]);

  // ── Confirmación de acciones ──
  const confirmAction = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'logout') {
      setConfirmModal(null);
      // Pequeño delay para que el modal cierre antes de llamar al padre
      setTimeout(() => onLogout(), 50);
    } else if (confirmModal.type === 'clearChat') {
      setChatsHistory(prev => { const s = { ...prev }; delete s[moduloActivo]; return s; });
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    setConfirmModal(null);
  };

  const handleClearChat = () => setConfirmModal({ type: 'clearChat', modulo: moduloActivo });
  const handleLogout = () => setConfirmModal({ type: 'logout' });

  const handleShareChat = async () => { if (currentMessages.length === 0) return; let chatText = `--- Historial Demo: ${moduloActivo} ---\n\n`; currentMessages.forEach(msg => { if (msg.sender === 'loading') return; const role = msg.sender === 'user' ? 'Usuario' : 'Asistente IA'; chatText += `[${role}]:\n${msg.text.replace(/<[^>]*>?/gm, '')}\n\n`; }); if (navigator.share) { try { await navigator.share({ title: `Reporte Demo`, text: chatText }); } catch (error) { console.log('Compartir cancelado', error); } } else { navigator.clipboard.writeText(chatText); showToast("Historial copiado."); } };
  const cambiarModulo = (nombre: string) => { setModuloActivo(nombre); setIsMobileMenuOpen(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  const handleChatScroll = () => { if (!scrollAreaRef.current) return; const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current; setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 50); };
  const scrollToBottomChat = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { showToast("Navegador no soporta micrófono."); return; }
    const recognition = new SpeechRecognition(); recognition.lang = 'es-VE'; recognition.continuous = false; recognition.interimResults = false; recognitionRef.current = recognition;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => { const transcript = event.results[0][0].transcript; setInputText(prev => prev ? prev + ' ' + transcript : transcript); setTimeout(() => { const textarea = document.getElementById('userInput'); if (textarea) { textarea.style.height = 'auto'; textarea.style.height = textarea.scrollHeight + "px"; messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); } }, 100); };
    recognition.onerror = () => setIsRecording(false); recognition.onend = () => setIsRecording(false);
    try { recognition.start(); } catch (err) { console.error("Error micrófono", err); }
  };
  const stopRecording = () => { if (recognitionRef.current && isRecording) { recognitionRef.current.stop(); setIsRecording(false); } };
  const handleEditUserMessage = (textToEdit: string) => { setInputText(textToEdit); setTimeout(() => { const textarea = document.getElementById('userInput'); if (textarea) { textarea.style.height = "auto"; textarea.style.height = textarea.scrollHeight + "px"; textarea.focus(); } }, 50); };

  const handleSend = () => {
    if (!inputText.trim()) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
    setChatsHistory(prev => ({ ...prev, [moduloActivo]: [...(prev[moduloActivo] || []), newUserMsg].slice(-50) }));
    setInputText('');
    const textarea = document.getElementById('userInput'); if (textarea) textarea.style.height = 'auto';
    const loadingId = (Date.now() + 1).toString();
    const activeModuleData = MODULES_DB.find(m => m.name === moduloActivo);
    setChatsHistory(prev => ({ ...prev, [moduloActivo]: [...(prev[moduloActivo] || []), { id: loadingId, sender: 'loading', text: activeModuleData?.loadingText || "Analizando..." }].slice(-50) }));
    setTimeout(() => {
      setChatsHistory(prev => {
        const filtered = (prev[moduloActivo] || []).filter(msg => msg.id !== loadingId);
        return { ...prev, [moduloActivo]: [...filtered, { id: (Date.now() + 2).toString(), sender: 'bot', text: activeModuleData?.demoText || "Modo Demo Activo." }].slice(-50) };
      });
    }, 1500);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const palettes = {
    dark: { appBG: 'bg-[#151f32]', sidebarOverlay: 'bg-[#0a1526]/85 backdrop-blur-[2px]', sidebarBtnText: 'text-gray-200', sidebarBtnHover: 'hover:bg-[#111827]', sidebarBtnActive: 'bg-[#1f2937] border-[#c5a059]', mainHeaderBG: 'bg-[#151f32]/90', mainHeaderBorder: 'border-[#1e2a40]', mainTitle: 'text-gray-100', greetingP: 'text-gray-300', botBubble: 'bg-[#1e2a40] text-gray-200 border-[#c5a059]', userBubble: 'bg-[#2a303c] text-gray-100 border-gray-700', footerBG: 'bg-[#1e2a40]', textArea: 'text-gray-100', sendBtn: 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#c5a059]/20', scrollBtn: 'bg-[#151f32] text-[#c5a059] border border-[#c5a059]/50 hover:bg-[#1e2a40] shadow-xl' },
    light: { appBG: 'bg-[#fdfcf5]', sidebarOverlay: 'bg-[#0a1526]/95', sidebarBtnText: 'text-gray-200', sidebarBtnHover: 'hover:bg-[#111827]', sidebarBtnActive: 'bg-[#1f2937] border-[#c5a059]', mainHeaderBG: 'bg-[#fdfcf5]/80', mainHeaderBorder: 'border-[#c5a059]/30', mainTitle: 'text-[#0a1526]', greetingP: 'text-[#2a303c]', botBubble: 'bg-[#eee7d5] text-[#2a303c] border-[#c5a059]', userBubble: 'bg-[#151f32] text-white border-none', footerBG: 'bg-[#eee7d5]', textArea: 'text-[#2a303c]', sendBtn: 'bg-[#0a1526] text-[#c5a059] border border-[#0a1526] hover:bg-[#111827]', scrollBtn: 'bg-[#0a1526] text-[#c5a059] border border-[#0a1526] hover:bg-[#111827] shadow-lg' }
  };
  const currentColors = palettes[theme];

  return (
    <div
      className={`flex w-screen overscroll-none ${currentColors.appBG} font-sans transition-colors duration-300`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />}

  {/* ── MODAL DE CONFIRMACIÓN PERSONALIZADO ── */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] overflow-hidden"
            >
              <div className="p-8 flex flex-col items-center text-center">

                {/* Icono de acción */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  confirmModal.type === 'logout'
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  {confirmModal.type === 'logout'
                    ? <LogOut size={22} className="text-red-400" />
                    : <Trash2 size={22} className="text-red-400" />
                  }
                </div>

                {/* Título */}
                <h3 className="text-white font-serif text-lg tracking-wide mb-2">
                  {confirmModal.type === 'logout' ? 'Cerrar Sesión' : 'Eliminar Historial'}
                </h3>

                {/* Mensaje */}
                <p className="text-gray-300 text-sm leading-relaxed mb-8">
                  {confirmModal.type === 'logout'
                    ? '¿Seguro que desea cerrar sesión y salir de la plataforma segura?'
                    : `¿Seguro que desea eliminar el historial de ${confirmModal.modulo}? Esta acción no puede deshacerse.`
                  }
                </p>

                {/* Botones */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-300 border border-gray-700 hover:border-gray-400 hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmAction}
                    className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-3 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95"
                  >
                    {confirmModal.type === 'logout' ? 'Salir' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`fixed md:relative top-0 left-0 z-50 h-full flex flex-col border-r border-gray-800 overflow-x-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'} ${isDesktopSidebarCollapsed ? 'md:w-[80px]' : 'md:w-[260px]'}`}>
        <button className="absolute top-4 right-4 z-50 md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
        <div className="absolute inset-0 z-0 overflow-hidden"><img src="/fondo-servicios.jpg.png" alt="" className="w-full h-full object-cover" /><div className={`absolute inset-0 ${currentColors.sidebarOverlay} transition-colors duration-300`}></div></div>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60"><Particles count={25} /></div>
        <div className={`hidden md:flex relative z-20 w-full pt-5 px-5 transition-all duration-300 ${isDesktopSidebarCollapsed ? 'justify-center px-0' : 'justify-end'}`}>
          <button onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)} className={`p-2 rounded-lg transition-all text-gray-400 hover:text-[#c5a059] ${currentColors.sidebarBtnHover}`}><Menu size={22} /></button>
        </div>
        <div className="pt-2 pb-6 px-6 relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-300" onMouseEnter={() => setIsLogoHovered(true)} onMouseLeave={() => setIsLogoHovered(false)}>
          <div className={`relative ${isDesktopSidebarCollapsed ? 'md:w-10 md:h-12 w-20 h-24' : 'w-20 h-24'} mb-3 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110`}><img src={logoShield} alt="." className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]" /></div>
          <h2 className={`text-center text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${isLogoHovered ? 'gradient-text-gold' : 'text-white'} ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>Plataforma Legal Transnacional</h2>
        </div>
        <nav className={`flex-1 overflow-y-auto px-3 space-y-1 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${currentColors.sidebarBtnText}`}>
          <p className={`text-[10px] text-gray-500 font-bold px-3 mb-2 uppercase ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>Centro de Inteligencia Legal</p>
          {MODULES_DB.map((mod) => (
            <button key={mod.hook} onClick={() => cambiarModulo(mod.name)} title={isDesktopSidebarCollapsed ? mod.name : undefined} className={`w-full flex items-center p-3 rounded-lg text-sm transition-all ${currentColors.sidebarBtnHover} border-l-4 ${moduloActivo === mod.name ? currentColors.sidebarBtnActive : 'border-transparent hover:border-[#c5a059]'}`}>
              <div className="flex items-center justify-center w-5 h-5 text-lg flex-shrink-0">{mod.icon}</div>
              <span className={`ml-3 whitespace-nowrap ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>{mod.name}</span>
            </button>
          ))}
        </nav>
        <div className={`border-t border-gray-800 relative z-10 flex transition-all duration-300 ${isDesktopSidebarCollapsed ? 'p-4 flex-col items-center gap-4' : 'p-4 flex-row items-center justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c5a059]/20 to-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center flex-shrink-0 font-bold shadow-lg">G</div>
            <div className={`flex flex-col truncate transition-opacity duration-300 ${isDesktopSidebarCollapsed ? 'hidden' : 'block'}`}>
              <span className="text-[15px] md:text-[16px] font-medium text-gray-200 truncate">Invitado</span>
              <span className="text-[10px] text-[#c5a059] uppercase tracking-wider truncate">Modo Demo</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center p-2.5 bg-gray-500/10 text-gray-400 hover:bg-[#c5a059]/10 hover:text-[#c5a059] rounded-xl transition-all"><LogOut size={18} /></button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden transition-all duration-300">
        <header className={`flex-shrink-0 w-full min-h-[4rem] border-b ${currentColors.mainHeaderBorder} flex items-center justify-between px-4 md:px-6 ${currentColors.mainHeaderBG} backdrop-blur-md z-30 transition-colors duration-300`}>
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <button className={`md:hidden p-2 -ml-2 rounded-full transition-all flex-shrink-0 ${theme === 'dark' ? 'text-gray-300 hover:bg-[#1e2a40]' : 'text-gray-600 hover:bg-gray-200'}`} onClick={() => setIsMobileMenuOpen(true)}><Menu size={22} /></button>
            <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3 flex-1">
              <h2 className={`font-medium ${currentColors.mainTitle} tracking-wide text-[15px] md:text-lg leading-tight`}>{moduloActivo}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium border border-blue-500/30 text-blue-400 bg-blue-500/10">Modo Demo</span>
            </div>
          </div>
          <div className="flex gap-2 md:gap-4 items-center flex-shrink-0">
            {currentMessages.length > 0 && (
              <>
                <button onClick={handleShareChat} className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]' : 'text-[#2a303c] hover:text-[#c5a059] hover:bg-[#eee7d5]'} transition-all`}><Share size={18} /></button>
                <button onClick={handleClearChat} className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-[#1e2a40]' : 'text-[#2a303c] hover:text-red-500 hover:bg-[#eee7d5]'} transition-all`}><Trash2 size={18} /></button>
              </>
            )}
            <button onClick={toggleTheme} className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#1e2a40]' : 'text-[#2a303c] hover:bg-[#eee7d5]'} transition-all`}>{theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}</button>
            <div className="flex gap-2 items-center"><span className="hidden sm:inline text-xs text-gray-500">Demo</span><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span></div>
          </div>
        </header>

        <section className={`flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain px-4 md:px-12 py-4 md:py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative ${currentColors.textArea}`} ref={scrollAreaRef} onScroll={handleChatScroll}>
          <div className="flex flex-col space-y-6 w-full max-w-3xl mx-auto flex-shrink-0">
            {currentMessages.length === 0 && (
              <div className="flex gap-4 items-start mb-4">
                <img src={logoShield} className="w-8 h-10 md:w-10 md:h-12 object-contain" alt="." />
                <div className="space-y-4 mt-1">
                  <p className={`text-lg md:text-xl font-light ${currentColors.mainTitle}`}>Conectado a la red de <strong>{moduloActivo}</strong>.</p>
                  <p className={`${currentColors.greetingP} leading-relaxed text-[15px] md:text-[16px]`}>¿En qué asunto legal específico puedo ayudarle?</p>
                </div>
              </div>
            )}
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start mt-2'}`}>
                {msg.sender === 'user' && <UserMessageBubble msg={msg} theme={theme} currentColors={currentColors} onEdit={handleEditUserMessage} />}
                {msg.sender === 'loading' && <div className="text-[#c5a059] text-[15px] font-medium animate-pulse ml-2">{msg.text}</div>}
                {msg.sender === 'bot' && (
                  <div className="flex flex-col gap-1 max-w-[90%]">
                    <div className={`${currentColors.botBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tl-none border-l-4 shadow-md overflow-hidden`}>
                      <div className={`leading-normal md:leading-relaxed bot-message-html-content max-w-none ${theme === 'dark' ? 'text-gray-200' : 'text-[#2a303c]'} [&_*]:font-sans [&_*]:text-current [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h4]:text-[16px] [&_h4]:font-bold [&_h4]:mt-4 [&_h4]:mb-2 [&_p]:text-[15px] md:[&_p]:text-[16px] [&_p]:mb-2 md:[&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul_ul]:list-[circle] [&_ul_ul]:mt-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:mt-2 [&_li]:text-[15px] md:[&_li]:text-[16px] [&_li]:mb-1 [&_strong]:font-bold [&_li:has(h4)]:list-none [&_li_h4]:-ml-4 [&_li_h4]:block`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                    <BotMessageActions text={msg.text} theme={theme} showToast={showToast} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex-1 min-h-[1px]"></div>
          <div ref={messagesEndRef} />
          <AnimatePresence>
            {showScrollBottom && (<motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={scrollToBottomChat} className={`fixed bottom-28 md:bottom-32 right-6 md:right-12 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentColors.scrollBtn}`}><ArrowDown size={20} /></motion.button>)}
          </AnimatePresence>
        </section>

        {/* ---- MENSAJE FLOTANTE AJUSTADO AL CONTENIDO ---- */}
        {toastMsg && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 text-[#e2c792] border border-[#c5a059]/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center gap-3 text-[14px] font-medium animate-in fade-in zoom-in-95 duration-300 text-center whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis">
            <Check size={16} className="flex-shrink-0 text-[#c5a059]" />
            <span className="truncate">{toastMsg}</span>
          </div>
        )}

        <footer className="flex-shrink-0 w-full px-4 py-2 sm:p-4 pb-4 md:pb-8 bg-transparent relative z-20">
          <div className="max-w-3xl mx-auto relative group">
            <div className={`${currentColors.footerBG} rounded-[24px] md:rounded-3xl border border-gray-700 p-1.5 flex flex-row items-end gap-1 focus-within:border-[#c5a059] transition-all shadow-2xl duration-300 min-h-[50px]`}>
              <div className="flex-shrink-0 mb-0.5">
                <button onClick={() => showToast("Verifique su cuenta para adjuntar archivos.")} className={`p-2.5 rounded-full transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#c5a059]/10' : 'text-gray-500 hover:text-[#c5a059] hover:bg-gray-200'}`}><Paperclip size={20} /></button>
              </div>
              <div className="flex-1 flex flex-col justify-center min-h-[44px]">
                {isRecording ? (
                  <div className="flex items-center gap-3 text-red-500 animate-pulse px-2 h-full"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[15px] font-medium tracking-wide">Escuchando...</span></div>
                ) : (
                  <textarea id="userInput" value={inputText} onChange={(e) => { setInputText(e.target.value); e.target.style.height = "24px"; e.target.style.height = e.target.scrollHeight + "px"; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Escriba o adjunte (Demo)..." rows={1} className={`w-full bg-transparent outline-none text-[16px] resize-none max-h-[120px] md:max-h-[220px] py-3 px-1 pl-2 [&::-webkit-scrollbar]:hidden ${currentColors.textArea}`} style={{ minHeight: '44px', lineHeight: '20px' }} />
                )}
              </div>
              <div className="flex-shrink-0 mb-0.5 ml-1">
                {isRecording ? (
                  <button onClick={stopRecording} className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"><Square size={20} className="fill-current" /></button>
                ) : (
                  inputText.trim() ? (
                    <button onClick={handleSend} className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg></button>
                  ) : (
                    <button onClick={startRecording} className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`}><Mic size={20} /></button>
                  )
                )}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
