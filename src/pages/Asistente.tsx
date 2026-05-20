import { useState, useRef, useEffect } from 'react';
import logoShield from '@/assets/logo.png.png'; 
import { useSearchParams } from 'react-router-dom';
import { Particles } from '@/components/Particles'; 
import { Sun, Moon, Send, Menu, X, Lock, Eye, EyeOff, LogOut, User, Trash2, Copy, Check, ThumbsUp, ThumbsDown, Paperclip, FileText, Mic, Square, Share2, Volume2, VolumeX, Share, Edit2, ChevronDown, ChevronUp, ArrowDown } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  sender: 'user' | 'bot' | 'loading';
  text: string;
  hasAttachment?: boolean; 
};

// ==========================================
// SUBCOMPONENTE: ACCIONES DEL MENSAJE DEL BOT
// ==========================================
const BotMessageActions = ({ text, theme, accessMode, showToast }: { text: string, theme: string, accessMode: string, showToast: (msg: string) => void }) => {
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
        await navigator.share({
          title: 'Análisis Legal - Unidad de IA',
          text: plainText,
        });
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
    
    // BLOQUEO DE N8N PARA EL MODO DEMO
    if (accessMode === 'guest') {
      showToast("Evaluación simulada en Modo Demo.");
      return; // El código se detiene aquí y no envía nada al Webhook
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
// SUBCOMPONENTE: MENSAJE DEL USUARIO (CON EDICIÓN Y EXPANSIÓN)
// ==========================================
const UserMessageBubble = ({ msg, theme, currentColors, onEdit }: { msg: Message, theme: string, currentColors: any, onEdit: (text: string) => void }) => {
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
    demoText: "En nuestro entorno verificado, este módulo estructura una defensa comparada, cruzando legislación vigente de Argentina y/o Venezuela junto con los tratados bilaterales para encontrar la mejor ruta de mitigación, generando dictámenes con niveles altos de precisión argumentativa. Para un análisis confidencial y detallado por nuestra red de expertos, inicie su proceso de alta como cliente.",
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

export default function AsistentePage() {
  const [accessMode, setAccessMode] = useState<'none' | 'client' | 'guest'>('none');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false); 
  const [registerName, setRegisterName] = useState(''); 
  const [registerPhone, setRegisterPhone] = useState(''); 
  
  // MODALES GRANDES (LOGIN/REGISTRO)
  const [notification, setNotification] = useState<{title: string, message: string, isError?: boolean} | null>(null);
  
  // TOASTS FLOTANTES PEQUEÑOS (INTERFAZ CHAT)
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isNotificationHovered, setIsNotificationHovered] = useState(false); 

  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('modulo') || 'webhook-riesgo';
  const initialModule = MODULES_DB.find(m => m.hook === urlParam) || MODULES_DB[0];

  const [moduloActivo, setModuloActivo] = useState(initialModule.name);
  const [webhookActivo, setWebhookActivo] = useState(initialModule.hook);
  const [inputText, setInputText] = useState('');
  
  // ESTADOS PARA MANEJO DE ARCHIVOS
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESTADOS PARA GRABACIÓN DE AUDIO / TRANSCRIPCIÓN
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false); 

  const [chatsHistory, setChatsHistory] = useState<Record<string, Message[]>>(() => {
    try {
      const savedHistory = localStorage.getItem('lap_chatsHistory');
      return savedHistory ? JSON.parse(savedHistory) : {};
    } catch (error) {
      return {};
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessages = chatsHistory[moduloActivo] || [];

  // NUEVO: Estados y funciones para la flecha de bajar
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const handleChatScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    if (scrollHeight - scrollTop - clientHeight > 50) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }
  };

  const scrollToBottomChat = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (accessMode !== 'none') {
      const storageKey = `lap_history_${accessMode}_${username || 'guest'}`;
      try {
        const savedHistory = localStorage.getItem(storageKey);
        if (savedHistory) setChatsHistory(JSON.parse(savedHistory));
        else setChatsHistory({});
      } catch (error) {
        setChatsHistory({});
      }
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'cliente123' && password === 'cliente123') {
      setLoginError(false);
      setAccessMode('client');
    } else {
      setLoginError(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fechaVE = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });

      await fetch('https://unidaddeia.duckdns.org/webhook/registro-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: registerName,
          correo: username, 
          telefono: registerPhone,
          password: password,
          fecha: fechaVE
        })
      });
      
      setNotification({
        title: 'Solicitud Enviada',
        message: 'Su solicitud de acceso ha sido recibida con éxito. Nuestro equipo de asesores verificará su perfil y se pondrá en contacto pronto.'
      });
      
      setIsRegistering(false); 
      setUsername('');
      setPassword('');
      setRegisterName('');
      setRegisterPhone('');
    } catch (error) {
      console.error("Error al registrar:", error);
      setNotification({
        title: 'Error de Conexión',
        message: 'Hubo un error de conexión al enviar su solicitud. Por favor intente nuevamente en unos minutos.',
        isError: true
      });
    }
  };

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fechaVE = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });

      await fetch('https://unidaddeia.duckdns.org/webhook/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: username, 
          fecha: fechaVE
        })
      });
      
      setNotification({
        title: 'Recuperación en Proceso',
        message: 'Si el correo ingresado coincide con nuestros registros seguros, recibirá instrucciones detalladas para restablecer su acceso.'
      });
      
      setIsRecovering(false); 
      setUsername('');
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      setNotification({
        title: 'Error de Conexión',
        message: 'Hubo un error de comunicación con el servidor. Por favor intente nuevamente en unos minutos.',
        isError: true
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Seguro que desea cerrar sesión de forma segura?")) {
      setAccessMode('none');
      setUsername('');
      setPassword('');
      setRegisterName('');
      setRegisterPhone('');
      setModuloActivo(initialModule.name);
      setWebhookActivo(initialModule.hook);
      setSelectedFile(null); 
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const handleClearChat = () => {
    if (window.confirm(`¿Seguro que desea eliminar el historial de ${moduloActivo}?`)) {
      setChatsHistory(prev => {
        const newState = { ...prev };
        delete newState[moduloActivo];
        return newState;
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const handleShareChat = async () => {
    if (currentMessages.length === 0) return;
    
    let chatText = `--- Historial de Chat: ${moduloActivo} ---\n\n`;
    currentMessages.forEach(msg => {
      if (msg.sender === 'loading') return;
      const role = msg.sender === 'user' ? 'Usuario' : 'Asistente IA';
      const cleanText = msg.text.replace(/<[^>]*>?/gm, ''); 
      chatText += `[${role}]:\n${cleanText}\n\n`;
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Reporte de Chat - ${moduloActivo}`,
          text: chatText,
        });
      } catch (error) {
        console.log('Compartir chat cancelado.', error);
      }
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("El reconocimiento de voz integrado no es compatible con este navegador.");
      return;
    }

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

    recognition.onerror = (e: any) => {
      console.error("Error al acceder al micrófono:", e);
      setIsRecording(false);
    };
    
    recognition.onend = () => setIsRecording(false);
    
    try {
      recognition.start();
    } catch (err) {
      console.error("Error iniciando reconocimiento:", err);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
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
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: userText,
      hasAttachment: !!selectedFile 
    };
    
    setChatsHistory(prev => ({
      ...prev,
      [moduloActivo]: [...(prev[moduloActivo] || []), newUserMsg].slice(-50)
    }));
    
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
          const filteredMessages = (prev[moduloActivo] || []).filter(msg => msg.id !== loadingId);
          return {
            ...prev,
            [moduloActivo]: [...filteredMessages, { id: (Date.now() + 2).toString(), sender: 'bot', text: activeModuleData?.demoText || "Modo Demo Activo." }].slice(-50)
          };
        });
      }, 1500);

    } else {
      try {
        let base64Data = null;
        if (payloadFile) {
          base64Data = await fileToBase64(payloadFile);
        }

        const requestBody = {
          sessionId: username,
          module: moduloActivo,
          text: payloadText,
          fileData: base64Data, 
          fileName: payloadFile?.name || null,
          mimeType: payloadFile?.type || null
        };

        const response = await fetch(`https://unidaddeia.duckdns.org/webhook/${webhookActivo}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Error en el servidor de IA');
        }

        const data = await response.json();
        const botResponseText = data.respuesta || data.text || "Proceso completado. Documento auditado y guardado.";

        setChatsHistory(prev => {
          const filteredMessages = (prev[moduloActivo] || []).filter(msg => msg.id !== loadingId);
          return {
            ...prev,
            [moduloActivo]: [...filteredMessages, { id: Date.now().toString(), sender: 'bot', text: botResponseText }].slice(-50)
          };
        });

      } catch (error) {
        console.error("Error conectando a n8n:", error);
        setChatsHistory(prev => {
          const filteredMessages = (prev[moduloActivo] || []).filter(msg => msg.id !== loadingId);
          return {
            ...prev,
            [moduloActivo]: [...filteredMessages, { id: Date.now().toString(), sender: 'bot', text: "⚠️ No es posible establecer conexión con la red segura en este momento. El incidente ha sido reportado a soporte técnico." }].slice(-50)
          };
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
  // PANTALLA DE ACCESO, REGISTRO Y RECUPERACIÓN
  // ==========================================
  if (accessMode === 'none') {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a1526] font-sans overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="/fondo-servicios.jpg.png" alt="Fondo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <Particles count={40} />
        </div>
        
        <div className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500">
          
          {notification ? (
            <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div 
                className="flex flex-col items-center mb-4 group cursor-pointer" 
                onMouseEnter={() => setIsNotificationHovered(true)} 
                onMouseLeave={() => setIsNotificationHovered(false)}
              >
                <div className="relative w-24 h-28 mb-4 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src={logoShield} alt="LAP Global" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
                </div>
                <h3 className={`text-2xl font-serif tracking-wide transition-colors duration-300 ${isNotificationHovered && !notification.isError ? 'gradient-text-gold text-[#c5a059]' : notification.isError ? 'text-red-400' : 'text-white'}`}>
                  {notification.title}
                </h3>
              </div>

              <p className={`text-[15px] mb-8 leading-relaxed px-2 ${notification.isError ? 'text-red-400' : 'text-gray-400'}`}>
                {notification.message}
              </p>
              <button 
                onClick={() => setNotification(null)}
                className="w-full flex justify-center items-center py-3.5 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95"
              >
                Aceptar
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8 group cursor-pointer" onMouseEnter={() => setIsLoginHovered(true)} onMouseLeave={() => setIsLoginHovered(false)}>
                <div className="relative w-24 h-28 mb-4 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src={logoShield} alt="LAP Global" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
                </div>
                <h2 className={`text-xl font-serif tracking-wide transition-colors duration-300 ${isLoginHovered ? 'gradient-text-gold' : 'text-white'}`}>
                  {isRegistering ? 'Nuevo Registro' : isRecovering ? 'Recuperar Acceso' : 'Acceso Seguro'}
                </h2>
                <p className="text-[#c5a059] text-xs uppercase tracking-widest mt-1">Plataforma de Inteligencia Legal</p>
              </div>
              
              <form onSubmit={isRegistering ? handleRegister : isRecovering ? handleRecoverPassword : handleLogin} className="space-y-4">
                
                {isRegistering && (
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nombre completo" 
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all" 
                    />
                  </div>
                )}

                <div>
                  <input 
                    type="text" 
                    placeholder={isRegistering || isRecovering ? "Correo electrónico" : "Usuario o Correo"} 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required
                    className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all" 
                  />
                </div>

                {isRegistering && (
                  <div>
                    <input 
                      type="tel" 
                      placeholder="Número de teléfono (Ej: +54 9 11...)" 
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      required
                      className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all" 
                    />
                  </div>
                )}

                {!isRecovering && (
                  <div className="space-y-1">
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 pr-12 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#c5a059] transition-colors focus:outline-none">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    {!isRegistering && (
                      <div className="flex justify-end pr-1 pt-1">
                        <button type="button" onClick={() => setIsRecovering(true)} className="text-xs text-gray-400 hover:text-[#c5a059] transition-colors">¿Olvidó su contraseña?</button>
                      </div>
                    )}
                  </div>
                )}

                {loginError && !isRegistering && !isRecovering && <p className="text-red-400 text-sm text-center animate-pulse">Credenciales incorrectas. Intente nuevamente.</p>}
                
                <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95 mt-2">
                  <Lock size={18} /> {isRegistering ? 'Solicitar Registro' : isRecovering ? 'Enviar Enlace' : 'Ingresar a la red'}
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-4">
                {isRecovering ? (
                  <p className="text-gray-400 text-sm">
                    ¿Recordó su contraseña?{' '}
                    <button onClick={() => setIsRecovering(false)} className="text-[#c5a059] hover:text-white transition-colors font-medium">Inicia sesión</button>
                  </p>
                ) : isRegistering ? (
                  <p className="text-gray-400 text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <button onClick={() => setIsRegistering(false)} className="text-[#c5a059] hover:text-white transition-colors font-medium">Inicia sesión</button>
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    ¿No eres cliente aún?{' '}
                    <button onClick={() => setIsRegistering(true)} className="text-[#c5a059] hover:text-white transition-colors font-medium">Solicita tu acceso</button>
                  </p>
                )}

                <button onClick={() => setAccessMode('guest')} className="text-[#c5a059] hover:text-white text-sm font-medium transition-colors border border-[#c5a059]/30 px-6 py-2 rounded-full hover:bg-[#c5a059]/10">Entrar a la versión Demo (Invitado)</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 flex w-screen overflow-hidden overscroll-none ${currentColors.appBG} font-sans transition-colors duration-300`}>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed md:relative top-0 left-0 z-50 h-full flex flex-col border-r border-gray-800 overflow-x-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'} ${isDesktopSidebarCollapsed ? 'md:w-[80px]' : 'md:w-[260px]'}`}>
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

        <div className={`pt-2 pb-6 px-6 relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-300`} onMouseEnter={() => setIsLogoHovered(true)} onMouseLeave={() => setIsLogoHovered(false)}>
          <div className={`relative ${isDesktopSidebarCollapsed ? 'md:w-10 md:h-12 w-20 h-24' : 'w-20 h-24'} mb-3 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
            <img src={logoShield} alt="LAP Global Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]" />
          </div>
          <h2 className={`text-center text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${isLogoHovered ? 'gradient-text-gold' : 'text-white'} ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>
            Plataforma Legal Transnacional
          </h2>
        </div>

        <nav className={`flex-1 overflow-y-auto px-3 space-y-1 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${currentColors.sidebarBtnText}`}>
          <p className={`text-[10px] text-gray-500 font-bold px-3 mb-2 uppercase ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>Centro de Inteligencia Legal</p>
          {MODULES_DB.map((mod) => (
            <button key={mod.hook} onClick={() => cambiarModulo(mod.name, mod.hook)} title={isDesktopSidebarCollapsed ? mod.name : undefined} className={`w-full flex items-center p-3 rounded-lg text-sm transition-all ${currentColors.sidebarBtnHover} border-l-4 ${moduloActivo === mod.name ? currentColors.sidebarBtnActive : 'border-transparent hover:border-[#c5a059]'}`}>
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
            <div className={`flex flex-col truncate transition-opacity duration-300 ${isDesktopSidebarCollapsed ? 'hidden' : 'block'}`}>
              <span className="text-[15px] md:text-[16px] font-medium text-gray-200 truncate">{accessMode === 'client' ? username : 'Invitado'}</span>
              <span className="text-[10px] text-[#c5a059] uppercase tracking-wider truncate">{accessMode === 'client' ? 'Cuenta Verificada' : 'Modo Demo'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center p-2.5 bg-gray-500/10 text-gray-400 hover:bg-[#c5a059]/10 hover:text-[#c5a059] rounded-xl transition-all" title="Cerrar sesión segura">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative w-full h-full min-w-0 min-h-0 overflow-hidden overscroll-none transition-all duration-300">
        
        <header className={`w-full flex-shrink-0 min-h-[4rem] border-b ${currentColors.mainHeaderBorder} flex items-center justify-between px-4 md:px-6 ${currentColors.mainHeaderBG} backdrop-blur-md z-30 transition-colors duration-300`}>
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
                <button onClick={handleClearChat} className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-[#1e2a40]' : 'text-[#2a303c] hover:text-red-500 hover:bg-[#eee7d5]'} transition-all`} title="Limpiar historial de este módulo">
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

        <section 
          className={`flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-none px-4 md:px-12 py-4 md:py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative ${currentColors.textArea}`}
          ref={scrollAreaRef}
          onScroll={handleChatScroll}
        >
          
          <div className="flex flex-col space-y-6 w-full max-w-3xl mx-auto flex-shrink-0">
            {currentMessages.length === 0 && (
              <div className="flex gap-4 items-start mb-4">
                <img src={logoShield} className="w-8 h-10 md:w-10 md:h-12 object-contain" alt="Logo" />
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

          {/* Botón Flotante para ir abajo */}
          <AnimatePresence>
            {showScrollBottom && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                onClick={scrollToBottomChat}
                className={`fixed bottom-28 md:bottom-32 right-6 md:right-12 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentColors.scrollBtn}`}
              >
                <ArrowDown size={20} />
              </motion.button>
            )}
          </AnimatePresence>

        </section>

        {/* CONTENEDOR DEL TOAST FLOTANTE */}
        {toastMsg && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-[#0a1526] text-[#c5a059] border border-[#c5a059]/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center gap-3 text-[14px] font-medium animate-in fade-in zoom-in-95 duration-300 text-center whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis">
            <Check size={16} className="flex-shrink-0" />
            <span className="truncate">{toastMsg}</span>
          </div>
        )}

        <footer className="flex-shrink-0 w-full px-4 py-2 sm:p-4 pb-4 md:pb-8 bg-transparent relative z-20">
          <div className="max-w-3xl mx-auto relative group">
            
            {selectedFile && (
              <div className={`absolute -top-10 left-4 ${theme === 'dark' ? 'bg-[#1e2a40] border-gray-700' : 'bg-[#eee7d5] border-[#c5a059]/30'} text-[#c5a059] text-xs py-1.5 px-3 rounded-t-xl border border-b-0 flex items-center gap-2 shadow-lg`}>
                <FileText size={14} />
                <span className="truncate max-w-[200px] font-medium">{selectedFile.name}</span>
                <button 
                  onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} 
                  className="hover:text-red-400 ml-1 transition-colors"
                >
                  <X size={14}/>
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
                      // TEXTO REDUCIDO APLICADO AQUÍ
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
                      if (e.key === 'Enter' && !e.shiftKey) { 
                        e.preventDefault(); 
                        handleSend(); 
                      } 
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
                  <button 
                    onClick={stopRecording}
                    className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    title="Detener transcripción"
                  >
                    <Square size={20} className="fill-current" />
                  </button>
                ) : (
                  (inputText.trim() || selectedFile) ? (
                    <button 
                      onClick={handleSend}
                      className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`}
                      title="Enviar mensaje"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      onClick={startRecording}
                      className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`}
                      title="Grabar mensaje de voz"
                    >
                      <Mic size={20} />
                    </button>
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
