import { useState, useRef, useEffect } from 'react';
import logoShield from '@/assets/logo.png.png';
import { useSearchParams } from 'react-router-dom';
import { Particles } from '@/components/Particles';
import {
  Sun, Moon, Send, Menu, X, LogOut, User, Trash2, Copy, Check,
  ThumbsUp, ThumbsDown, Paperclip, FileText, Mic, Square,
  Share2, Volume2, VolumeX, Share, Edit2, ChevronDown, ChevronUp, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Importamos la pantalla de login desde su propio archivo
import LoginPage, { type AccessMode } from '@/components/asistente/LoginPage';

// ==========================================
// TIPOS
// ==========================================
type Message = {
  id: string;
  sender: 'user' | 'bot' | 'loading';
  text: string;
  hasAttachment?: boolean;
};

// ==========================================
// BASE DE DATOS DE MÓDULOS
// ==========================================
const MODULES_DB = [
  {
    name: 'Monitor de Riesgo',
    hook: 'webhook-riesgo',
    icon: '🌐',
    demoText: "En la versión verificada para clientes, nuestro módulo cruza esta información en tiempo real para anticipar vulnerabilidades corporativas antes de que ocurran. Nuestro sistema es capaz de predecir contingencias binacionales evaluando miles de indicadores diarios. Para obtener un reporte completo, blindar sus operaciones y desbloquear la matriz predictiva aplicada a su caso, contacte a nuestros especialistas para habilitar su cuenta.",
    loadingText: "Analizando su consulta..."
  },
  {
    name: 'Análisis Legal',
    hook: 'webhook-penal',
    icon: '⚖️',
    demoText: "En nuestro entorno verificado, este módulo estructura una defense comparada, cruzando legislación vigente de Argentina y/o Venezuela junto con los tratados bilaterales para encontrar la mejor ruta de mitigación, generando dictámenes con niveles altos de precisión argumentativa. Para un análisis confidencial y detallado por nuestra red de expertos, inicie su proceso de alta como cliente.",
    loadingText: "Analizando su consulta..."
  },
  {
    name: 'Auditoría Documental',
    hook: 'webhook-auditoria',
    icon: '📄',
    demoText: "En la red verificada, este servicio es capaz de procesar cientos de folios en segundos, detectando cláusulas abusivas, contingencias ocultas y vacíos normativos que el ojo humano podría pasar por alto. Si desea someter su documentación a nuestro ecosistema legal bajo estricto secreto profesional, contacte a nuestro equipo.",
    loadingText: "Analizando su consulta..."
  },
  {
    name: 'Memoria Institucional',
    hook: 'webhook-memoria',
    icon: '🏛️',
    demoText: "Este módulo exclusivo permite a nuestros clientes interactuar con el 'Cerebro Histórico' de sus casos, encontrando precedentes exactos, respuestas estratégicas en tiempo real y estandarizando sus decisiones legales victoriosas en el pasado. Su historial legal es su mayor activo; contáctenos para digitalizar y blindar su memoria corporativa.",
    loadingText: "Analizando su consulta..."
  },
  {
    name: 'Informes Automáticos',
    hook: 'webhook-informes',
    icon: '📊',
    demoText: "En la versión sin restricciones, nuestro sistema cruza la data solicitada y emite un reporte estructurado de los casos, argumentado y maquetado con los estándares más altos, listos para ser presentados ante Juntas Directivas, ahorrando días de trabajo analítico. Habilite su usuario para obtener documentos listos para la acción.",
    loadingText: "Analizando su consulta..."
  },
  {
    name: 'Boletín Jurídico',
    hook: 'webhook-boletin',
    icon: '📖',
    demoText: "A diferencia de un boletín tradicional, este modelo monitorea gacetas oficiales y despachos legislativos 24/7, filtrando únicamente los cambios normativos que impactan directamente en el sector de cada cliente. No sufra sorpresas legales; contáctenos para configurar su radar personalizado.",
    loadingText: "Analizando su consulta..."
  }
];

// ==========================================
// SUBCOMPONENTE: ACCIONES DEL MENSAJE DEL BOT
// ==========================================
const BotMessageActions = ({
  text, theme, accessMode, showToast
}: {
  text: string; theme: string; accessMode: AccessMode; showToast: (msg: string) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'up' | 'down'>('none');

  useEffect(() => {
    return () => {
      if (isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/<[^>]*>?/gm, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const plainText = text.replace(/<[^>]*>?/gm, '');
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Análisis Legal - Unidad de IA', text: plainText });
      } catch (error) {
        console.log('Compartir cancelado o no disponible.', error);
      }
    } else {
      handleCopy();
      showToast("Respuesta copiada al portapapeles.");
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      showToast("Su navegador no soporta la función de lectura en voz alta.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const plainText = text.replace(/<[^>]*>?/gm, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'es-VE';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleFeedback = async (type: 'up' | 'down') => {
    if (feedback !== 'none') return;
    setFeedback(type);
    if (accessMode === 'guest') {
      showToast("Evaluación simulada en Modo Demo.");
      return;
    }
    try {
      const fechaVE = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
      await fetch('https://unidaddeia.duckdns.org/webhook/evaluacion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluacion: type === 'up' ? 'Buena' : 'Mala',
          mensaje_bot: text.replace(/<[^>]*>?/gm, ''),
          fecha: fechaVE
        })
      });
      showToast("Gracias por su evaluación. Nos ayuda a mejorar.");
    } catch (error) {
      console.error("Error enviando evaluación:", error);
    }
  };

  const btnClass = `p-1.5 rounded-md transition-colors ${
    theme === 'dark'
      ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]'
      : 'text-gray-500 hover:text-[#c5a059] hover:bg-[#eee7d5]'
  }`;

  return (
    <div className="flex items-center gap-1 ml-2 mt-1">
      <button onClick={handleSpeak} className={btnClass} title={isSpeaking ? "Detener lectura" : "Escuchar respuesta"}>
        {isSpeaking ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} />}
      </button>
      <button onClick={handleCopy} className={btnClass} title="Copiar respuesta">
        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      </button>
      <button onClick={handleShare} className={btnClass} title="Compartir respuesta">
        <Share2 size={14} />
      </button>
      <button onClick={() => handleFeedback('up')} className={`${btnClass} ${feedback === 'up' ? '!text-green-500' : ''}`} title="Buena respuesta">
        <ThumbsUp size={14} />
      </button>
      <button onClick={() => handleFeedback('down')} className={`${btnClass} ${feedback === 'down' ? '!text-red-500' : ''}`} title="Mala respuesta">
        <ThumbsDown size={14} />
      </button>
    </div>
  );
};

// ==========================================
// SUBCOMPONENTE: MENSAJE DEL USUARIO
// ==========================================
const UserMessageBubble = ({
  msg, theme, currentColors, onEdit
}: {
  msg: Message; theme: string; currentColors: any; onEdit: (text: string) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isLong = msg.text.length > 300;
  const displayText = isLong && !expanded ? msg.text.substring(0, 300) + '...' : msg.text;

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnClass = `p-1.5 rounded-md transition-colors ${
    theme === 'dark'
      ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]'
      : 'text-gray-500 hover:text-[#c5a059] hover:bg-[#eee7d5]'
  }`;

  return (
    <div className="flex flex-col items-end max-w-[90%] md:max-w-[85%]">
      <div className={`${currentColors.userBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tr-none shadow-md`}>
        <p className="text-[15px] md:text-[16px] leading-normal md:leading-relaxed whitespace-pre-wrap break-words">
          {displayText}
        </p>
      </div>
      <div className="flex items-center gap-1 mr-2 mt-1">
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} className={btnClass} title={expanded ? "Mostrar menos" : "Mostrar más"}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
        <button onClick={handleCopy} className={btnClass} title="Copiar mi mensaje">
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
        <button onClick={() => onEdit(msg.text)} className={btnClass} title="Editar para reusar">
          <Edit2 size={14} />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL: PÁGINA DEL ASISTENTE
// ==========================================
export default function AsistentePage() {
  // --- Estado de sesión (recibido del Login) ---
  const [accessMode, setAccessMode] = useState<AccessMode>('none');
  const [username, setUsername] = useState('');

  // --- Estados de Control para Modales de Interfaz Estilizados ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);

  // --- Toasts flotantes (solo en chat) ---
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('modulo') || 'webhook-riesgo';
  const initialModule = MODULES_DB.find(m => m.hook === urlParam) || MODULES_DB[0];

  const [moduloActivo, setModuloActivo] = useState(initialModule.name);
  const [webhookActivo, setWebhookActivo] = useState(initialModule.hook);
  const [inputText, setInputText] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const [chatsHistory, setChatsHistory] = useState<Record<string, Message[]>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessages = chatsHistory[moduloActivo] || [];

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // ---- Cargar / guardar historial según sesión ----
  useEffect(() => {
    if (accessMode !== 'none') {
      const storageKey = `lap_history_${accessMode}_${username || 'guest'}`;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) setChatsHistory(JSON.parse(saved));
        else setChatsHistory({});
      } catch { setChatsHistory({}); }
    }
  }, [accessMode, username]);

  useEffect(() => {
    if (accessMode !== 'none') {
      const storageKey = `lap_history_${accessMode}_${username || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(chatsHistory));
    }
  }, [chatsHistory, accessMode, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // ---- Callback del LoginPage ----
  const handleLoginSuccess = (mode: AccessMode, user?: string) => {
    setAccessMode(mode);
    setUsername(user || '');
  };

  // ---- Funciones Ejecutoras Finales de los Modales ----
  const handleConfirmLogout = () => {
    setAccessMode('none');
    setUsername('');
    setModuloActivo(initialModule.name);
    setWebhookActivo(initialModule.hook);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setShowLogoutModal(false);
  };

  const handleConfirmClearChat = () => {
    setChatsHistory(prev => { const s = { ...prev }; delete s[moduloActivo]; return s; });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setShowClearHistoryModal(false);
    showToast(`Historial de ${moduloActivo} eliminado.`);
  };

  const handleShareChat = async () => {
    if (currentMessages.length === 0) return;
    let chatText = `--- Historial de Chat: ${moduloActivo} ---\n\n`;
    currentMessages.forEach(msg => {
      if (msg.sender === 'loading') return;
      const role = msg.sender === 'user' ? 'Usuario' : 'Asistente IA';
      chatText += `[${role}]:\n${msg.text.replace(/<[^>]*>?/gm, '')}\n\n`;
    });
    if (navigator.share) {
      try { await navigator.share({ title: `Reporte de Chat - ${moduloActivo}`, text: chatText }); }
      catch (error) { console.log('Compartir chat cancelado.', error); }
    } else {
      navigator.clipboard.writeText(chatText);
      showToast("Historial de chat completo copiado al portapapeles.");
    }
  };

  const cambiarModulo = (nombre: string, webhook: string) => {
    setModuloActivo(nombre);
    setWebhookActivo(webhook);
    setIsMobileMenuOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleChatScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 50);
  };

  const scrollToBottomChat = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { showToast("El reconocimiento de voz integrado no es compatible con este navegador."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-VE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev ? prev + ' ' + transcript : transcript);
      setTimeout(() => {
        const textarea = document.getElementById('userInput');
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + "px";
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    };
    recognition.onerror = (e: any) => { console.error("Error al acceder al micrófono:", e); setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    try { recognition.start(); } catch (err) { console.error("Error iniciando reconocimiento:", err); }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) { recognitionRef.current.stop(); setIsRecording(false); }
  };

  const handleEditUserMessage = (textToEdit: string) => {
    const cleanText = textToEdit.replace(/^📎 \[.*?\]\n/, '');
    setInputText(cleanText);
    setTimeout(() => {
      const textarea = document.getElementById('userInput');
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        textarea.focus();
      }
    }, 50);
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const userText = selectedFile ? `📎 [${selectedFile.name}]\n${inputText}` : inputText;
    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText, hasAttachment: !!selectedFile };

    setChatsHistory(prev => ({ ...prev, [moduloActivo]: [...(prev[moduloActivo] || []), newUserMsg].slice(-50) }));

    const payloadText = inputText;
    const payloadFile = selectedFile;
    setInputText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    const textarea = document.getElementById('userInput');
    if (textarea) textarea.style.height = 'auto';

    const loadingId = (Date.now() + 1).toString();
    const activeModuleData = MODULES_DB.find(m => m.name === moduloActivo);
    const dynamicLoadingText = payloadFile ? "Analizando documento adjunto de forma segura..." : (activeModuleData?.loadingText || "Analizando datos...");

    setChatsHistory(prev => ({
      ...prev,
      [moduloActivo]: [...(prev[moduloActivo] || []), { id: loadingId, sender: 'loading', text: dynamicLoadingText }].slice(-50)
    }));

    if (accessMode === 'guest') {
      setTimeout(() => {
        setChatsHistory(prev => {
          const filtered = (prev[moduloActivo] || []).filter(msg => msg.id !== loadingId);
          return { ...prev, [moduloActivo]: [...filtered, { id: (Date.now() + 2).toString(), sender: 'bot', text: activeModuleData?.demoText || "Modo Demo Activo." }].slice(-50) };
        });
      }, 1500);
    } else {
      try {
        let base64Data = null;
        if (payloadFile) base64Data = await fileToBase64(payloadFile);
        const response = await fetch(`https://unidaddeia.duckdns.org/webhook/${webhookActivo}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: username, module: moduloActivo, text: payloadText, fileData: base64Data, fileName: payloadFile?.name || null, mimeType: payloadFile?.type || null })
        });
        if (!response.ok) throw new Error('Error en el servidor de IA');
        const data = await response.json();
        const botResponseText = data.respuesta || data.text || "Proceso completado. Documento auditado y guardado.";
        setChatsHistory(prev => {
          const filtered = (prev[moduloActivo] || []).filter(msg => msg.id !== loadingId);
          return { ...prev, [moduloActivo]: [...filtered, { id: Date.now().toString(), sender: 'bot', text: botResponseText }].slice(-50) };
        });
      } catch (error) {
        console.error("Error conectando a n8n:", error);
        setChatsHistory(prev => {
          const filtered = (prev[moduloActivo] || []).filter(msg => msg.id !== loadingId);
          return { ...prev, [moduloActivo]: [...filtered, { id: Date.now().toString(), sender: 'bot', text: "⚠️ No es posible establecer conexión con la red segura en este momento. El incidente ha sido reportado a soporte técnico." }].slice(-50) };
        });
      }
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const palettes = {
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
      sendBtn: 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#c5a059]/20',
      scrollBtn: 'bg-[#151f32] text-[#c5a059] border border-[#c5a059]/50 hover:bg-[#1e2a40] shadow-xl'
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
      scrollBtn: 'bg-[#0a1526] text-[#c5a059] border border-[#0a1526] hover:bg-[#111827] shadow-lg'
    }
  };

  const currentColors = palettes[theme];

  // ==========================================
  // SI NO HAY SESIÓN → MOSTRAR LOGIN
  // ==========================================
  if (accessMode === 'none') {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  // ==========================================
  // INTERFAZ PRINCIPAL DEL CHAT
  // ==========================================
  return (
    <div className={`fixed inset-0 h-screen max-h-screen w-screen max-w-full overflow-hidden overscroll-none ${currentColors.appBG} font-sans transition-colors duration-300 flex`}>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ---- SIDEBAR ---- */}
      <aside className={`fixed md:relative top-0 left-0 z-40 h-full flex flex-col border-r border-gray-800 overflow-x-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'} ${isDesktopSidebarCollapsed ? 'md:w-[80px]' : 'md:w-[260px]'}`}>
        <button className="absolute top-4 right-4 z-50 md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={24} />
        </button>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="/fondo-servicios.jpg.png" alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${currentColors.sidebarOverlay} transition-colors duration-300`}></div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <Particles count={25} />
        </div>

        <div className={`hidden md:flex relative z-20 w-full pt-5 px-5 transition-all duration-300 ${isDesktopSidebarCollapsed ? 'justify-center px-0' : 'justify-end'}`}>
          <button onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)} className={`p-2 rounded-lg transition-all text-gray-400 hover:text-[#c5a059] ${currentColors.sidebarBtnHover}`} title={isDesktopSidebarCollapsed ? "Expandir panel" : "Minimizar panel"}>
            <Menu size={22} />
          </button>
        </div>

        <div className="pt-2 pb-6 px-6 relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-300" onMouseEnter={() => setIsLogoHovered(true)} onMouseLeave={() => setIsLogoHovered(false)}>
          <div className={`relative ${isDesktopSidebarCollapsed ? 'md:w-10 md:h-12 w-20 h-24' : 'w-20 h-24'} mb-3 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
            <img src={logoShield} alt="." className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]" />
          </div>
          <h2 className={`text-center text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${isLogoHovered ? 'gradient-text-gold' : 'text-white'} ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>
            Plataforma Legal Transnacional
          </h2>
        </div>

        <nav className={`flex-1 overflow-y-auto px-3 space-y-1 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${currentColors.sidebarBtnText}`}>
          <p className={`text-[10px] text-gray-500 font-bold px-3 mb-2 uppercase ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>Centro de Inteligencia Legal</p>
          {MODULES_DB.map((mod) => (
            <button key={mod.hook} onClick={() => cambiarModulo(mod.name, mod.hook)} title={isDesktopSidebarCollapsed ? mod.name : undefined}
              className={`w-full flex items-center p-3 rounded-lg text-sm transition-all ${currentColors.sidebarBtnHover} border-l-4 ${moduloActivo === mod.name ? currentColors.sidebarBtnActive : 'border-transparent hover:border-[#c5a059]'}`}>
              <div className="flex items-center justify-center w-5 h-5 text-lg flex-shrink-0">{mod.icon}</div>
              <span className={`ml-3 whitespace-nowrap ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>{mod.name}</span>
            </button>
          ))}
        </nav>

        <div className={`border-t border-gray-800 relative z-10 flex transition-all duration-300 ${isDesktopSidebarCollapsed ? 'p-4 flex-col items-center gap-4' : 'p-4 flex-row items-center justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden" title={isDesktopSidebarCollapsed ? (accessMode === 'client' ? username : 'Invitado') : undefined}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c5a059]/20 to-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center flex-shrink-0 font-bold shadow-lg">
              {accessMode === 'client' ? <User size={18} /> : 'G'}
            </div>
            <div className="flex flex-col truncate transition-opacity duration-300 setup-user-sidebar">
              <span className={`text-[15px] md:text-[16px] font-medium text-gray-200 truncate ${isDesktopSidebarCollapsed ? 'hidden' : 'block'}`}>{accessMode === 'client' ? username : 'Invitado'}</span>
              <span className={`text-[10px] text-[#c5a059] uppercase tracking-wider truncate ${isDesktopSidebarCollapsed ? 'hidden' : 'block'}`}>{accessMode === 'client' ? 'Cuenta Verificada' : 'Modo Demo'}</span>
            </div>
          </div>
          <button onClick={() => setShowLogoutModal(true)} className="flex items-center justify-center p-2.5 bg-gray-500/10 text-gray-400 hover:bg-[#c5a059]/10 hover:text-[#c5a059] rounded-xl transition-all" title="Cerrar sesión segura">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ---- MAIN CONTAINER ---- */}
      <main className="flex-1 flex flex-col relative w-full h-full max-h-screen min-w-0 min-h-0 overflow-hidden overscroll-none transition-all duration-300">

        {/* ── HEADER COMPLETAMENTE FIJO (sticky top-0 & flex-shrink-0) ── */}
        <header className={`w-full flex-shrink-0 sticky top-0 min-h-[4rem] border-b ${currentColors.mainHeaderBorder} flex items-center justify-between px-4 md:px-6 ${currentColors.mainHeaderBG} backdrop-blur-md z-30 transition-colors duration-300`}>
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <button className={`md:hidden p-2 -ml-2 rounded-full transition-all flex-shrink-0 ${theme === 'dark' ? 'text-gray-300 hover:bg-[#1e2a40]' : 'text-gray-600 hover:bg-gray-200'}`} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3 flex-1">
              <h2 className={`font-medium ${currentColors.mainTitle} tracking-wide text-[15px] md:text-lg leading-tight`}>{moduloActivo}</h2>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium border ${accessMode === 'client' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                {accessMode === 'client' ? 'Verificado' : 'Modo Demo'}
              </span>
            </div>
          </div>
          <div className="flex gap-2 md:gap-4 items-center flex-shrink-0">
            {currentMessages.length > 0 && (
              <>
                <button onClick={handleShareChat} className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]' : 'text-[#2a303c] hover:text-[#c5a059] hover:bg-[#eee7d5]'} transition-all`} title="Compartir historial completo">
                  <Share size={18} />
                </button>
                <button onClick={() => setShowClearHistoryModal(true)} className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-[#1e2a40]' : 'text-[#2a303c] hover:text-red-500 hover:bg-[#eee7d5]'} transition-all`} title="Limpiar historial de este módulo">
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button onClick={toggleTheme} className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#1e2a40]' : 'text-[#2a303c] hover:bg-[#eee7d5]'} transition-all`} title={theme === 'dark' ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}>
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="flex gap-2 items-center">
              <span className="hidden sm:inline text-xs text-gray-500">Esperando...</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
          </div>
        </header>

        {/* ---- ÁREA DE MENSAJES (ÚNICA CON SCROLL VERTICAL) ---- */}
        <section
          className={`flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-none px-4 md:px-12 py-4 md:py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative ${currentColors.textArea}`}
          ref={scrollAreaRef}
          onScroll={handleChatScroll}
        >
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
                {msg.sender === 'user' && (
                  <UserMessageBubble msg={msg} theme={theme} currentColors={currentColors} onEdit={handleEditUserMessage} />
                )}
                {msg.sender === 'loading' && (
                  <div className="text-[#c5a059] text-[15px] font-medium animate-pulse ml-2">{msg.text}</div>
                )}
                {msg.sender === 'bot' && (
                  <div className="flex flex-col gap-1 max-w-[90%]">
                    <div className={`${currentColors.botBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tl-none border-l-4 shadow-md overflow-hidden`}>
                      <div
                        className={`leading-normal md:leading-relaxed bot-message-html-content max-w-none ${theme === 'dark' ? 'text-gray-200' : 'text-[#2a303c]'} [&_*]:font-sans [&_*]:text-current [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h4]:text-[16px] [&_h4]:font-bold [&_h4]:mt-4 [&_h4]:mb-2 [&_p]:text-[15px] md:[&_p]:text-[16px] [&_p]:mb-2 md:[&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul_ul]:list-[circle] [&_ul_ul]:mt-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:mt-2 [&_li]:text-[15px] md:[&_li]:text-[16px] [&_li]:mb-1 [&_strong]:font-bold [&_li:has(h4)]:list-none [&_li_h4]:-ml-4 [&_li_h4]:block`}
                        dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                      />
                    </div>
                    <BotMessageActions text={msg.text} theme={theme} accessMode={accessMode} showToast={showToast} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 min-h-[1px]"></div>
          <div ref={messagesEndRef} />

          {/* Botón flotante para bajar */}
          <AnimatePresence>
            {showScrollBottom && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                onClick={scrollToBottomChat}
                className={`fixed bottom-28 md:bottom-32 right-6 md:right-12 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentColors.scrollBtn}`}
              >
                <ArrowDown size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </section>

        {/* ---- TOAST ---- */}
        {toastMsg && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-[#0a1526] text-[#c5a059] border border-[#c5a059]/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center gap-3 text-[14px] font-medium animate-in fade-in zoom-in-95 duration-300 text-center whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis">
            <Check size={16} className="flex-shrink-0" />
            <span className="truncate">{toastMsg}</span>
          </div>
        )}

        {/* ---- FOOTER / INPUT ---- */}
        <footer className="flex-shrink-0 w-full px-4 py-2 sm:p-4 pb-4 md:pb-8 bg-transparent relative z-20">
          <div className="max-w-3xl mx-auto relative group">

            {selectedFile && (
              <div className={`absolute -top-10 left-4 ${theme === 'dark' ? 'bg-[#1e2a40] border-gray-700' : 'bg-[#eee7d5] border-[#c5a059]/30'} text-[#c5a059] text-xs py-1.5 px-3 rounded-t-xl border border-b-0 flex items-center gap-2 shadow-lg`}>
                <FileText size={14} />
                <span className="truncate max-w-[200px] font-medium">{selectedFile.name}</span>
                <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="hover:text-red-400 ml-1 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}

            <div className={`${currentColors.footerBG} ${selectedFile ? 'rounded-tl-none' : ''} rounded-[24px] md:rounded-3xl border border-gray-700 p-1.5 flex flex-row items-end gap-1 focus-within:border-[#c5a059] transition-all shadow-2xl duration-300 min-h-[50px]`}>

              <div className="flex-shrink-0 mb-0.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xlsx,.jpg,.jpeg,.png,.webp,.mp3,.wav,.ogg,.m4a,.aac,.mp4,.mov,.avi,.mkv"
                />
                <button
                  onClick={() => {
                    if (accessMode === 'guest') {
                      showToast("Verifique su cuenta para adjuntar archivos.");
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`p-2.5 rounded-full transition-all ${selectedFile ? 'bg-[#c5a059]/20 text-[#c5a059]' : (theme === 'dark' ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#c5a059]/10' : 'text-gray-500 hover:text-[#c5a059] hover:bg-gray-200')}`}
                  title="Adjuntar Archivo, Audio o Video"
                >
                  <Paperclip size={20} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center min-h-[44px]">
                {isRecording ? (
                  <div className="flex items-center gap-3 text-red-500 animate-pulse px-2 h-full">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-[15px] font-medium tracking-wide">Escuchando...</span>
                  </div>
                ) : (
                  <textarea
                    id="userInput"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = "24px";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder={accessMode === 'client' ? "Escriba o adjunte archivos..." : "Escriba o adjunte (Demo)..."}
                    rows={1}
                    className={`w-full bg-transparent outline-none text-[16px] resize-none max-h-[120px] md:max-h-[220px] py-3 px-1 [&::-webkit-scrollbar]:hidden ${currentColors.textArea} ${accessMode === 'guest' ? 'pl-2' : ''}`}
                    style={{ minHeight: '44px', lineHeight: '20px' }}
                  />
                )}
              </div>

              <div className="flex-shrink-0 mb-0.5 ml-1">
                {isRecording ? (
                  <button onClick={stopRecording} className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95" title="Detener transcripción">
                    <Square size={20} className="fill-current" />
                  </button>
                ) : (
                  (inputText.trim() || selectedFile) ? (
                    <button onClick={handleSend} className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`} title="Enviar mensaje">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={startRecording} className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`} title="Grabar mensaje de voz">
                      <Mic size={20} />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ==========================================
          MODALES PREMIUM DE INTERFAZ (TARJETA ÚNICA)
          ========================================== */}
      <AnimatePresence>
        {/* 1. MODAL DETALLE DE CIERRE DE SESIÓN */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* ── TARJETA ÚNICA ── */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] overflow-hidden"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center justify-center text-center pt-8 px-10"
              >
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-full mb-4 text-red-400">
                  <LogOut size={26} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  ¿Cerrar Sesión Segura?
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  ¿Está seguro de que desea salir de la sesión actual y abandonar el Modo Demo?
                </p>
              </motion.div>

              {/* Acciones con Botón de Efecto Dorado Solicitado */}
              <div className="p-6 flex flex-col gap-3">
                <button
                  onClick={handleConfirmLogout}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#c5a059]/20 text-sm"
                >
                  Aceptar y Salir
                </button>

                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-3 px-6 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-xl transition-all duration-200 text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. MODAL PARA ELIMINAR EL HISTORIAL DE CHAT */}
        {showClearHistoryModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* ── TARJETA ÚNICA ── */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] overflow-hidden"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center justify-center text-center pt-8 px-10"
              >
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-full mb-4 text-red-400">
                  <Trash2 size={26} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  ¿Eliminar Historial?
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  ¿Está seguro de que desea eliminar el historial de <strong>{moduloActivo}</strong>? Esta operación es inmediata y no se puede deshacer.
                </p>
              </motion.div>

              {/* Acciones con Paleta Dorada Cohesiva */}
              <div className="p-6 flex flex-col gap-3">
                <button
                  onClick={handleConfirmClearChat}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#c5a059]/20 text-sm"
                >
                  Confirmar y Eliminar
                </button>

                <button
                  onClick={() => setShowClearHistoryModal(false)}
                  className="w-full py-3 px-6 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-xl transition-all duration-200 text-sm font-medium"
                >
                  Mantener Historial
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
