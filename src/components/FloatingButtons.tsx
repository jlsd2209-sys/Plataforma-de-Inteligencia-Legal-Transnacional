import { useState, useEffect, useRef } from 'react';
import { ArrowUp, X, Send, Mic, Square, Sun, Moon, Trash2, BotMessageSquare, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoShield from '@/assets/logo.png.png'; 
import { Particles } from '@/components/Particles';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

// ==========================================
// SUBCOMPONENTE: MENSAJE DEL USUARIO (LIMPIO)
// ==========================================
const UserMessageBubble = ({ msg, currentColors }: { msg: Message, currentColors: any }) => {
  return (
    <div className="flex flex-col items-end max-w-[90%] md:max-w-[85%]">
      <div className={`${currentColors.userBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tr-none shadow-md`}>
        <p className="text-[13.2px] md:text-[14px] leading-snug md:leading-normal whitespace-pre-wrap break-words">
          {msg.text}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL FLOTANTE
// ==========================================
export const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Estados para el Agente
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicia en 'light' por defecto
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Estado para el botón de "bajar al último mensaje"
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Estados de micrófono
  const [isRecording, setIsRecording] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const recognitionRef = useRef<any>(null);

  const initialMessage: Message = { 
    id: 'welcome', 
    sender: 'bot', 
    text: '¡Hola! Soy el Asesor Virtual de la Plataforma de Inteligencia Legal Transnacional. ¿Te gustaría conocer nuestros servicios o agendar una consulta con un experto?' 
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

// Paleta de colores (ACTUALIZADA CON scrollBtn)
  const palettes = {
    dark: {
      windowBg: 'bg-[#151f32]',
      msgAreaBg: 'bg-transparent',
      userBubble: 'bg-[#2a303c] text-gray-100 border border-gray-700',
      botBubble: 'bg-[#1e2a40] border-l-4 border-[#c5a059] text-gray-200',
      inputAreaBg: 'bg-[#0a1526] border-gray-800',
      inputWrap: 'bg-[#151f32] border-gray-700',
      inputText: 'text-white placeholder-gray-500',
      sendBtn: 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#c5a059]/20',
      scrollBtn: 'bg-[#151f32] text-[#c5a059] border border-[#c5a059]/50 hover:bg-[#1e2a40] shadow-xl'
    },
    light: {
      windowBg: 'bg-[#fdfcf5]',
      msgAreaBg: 'bg-transparent',
      userBubble: 'bg-[#151f32] text-white border-none',
      botBubble: 'bg-[#eee7d5] border-l-4 border-[#c5a059] text-[#2a303c]',
      inputAreaBg: 'bg-[#fdfcf5] border-[#c5a059]/30',
      inputWrap: 'bg-white border-[#c5a059]/30',
      inputText: 'text-[#2a303c] placeholder-gray-400',
      sendBtn: 'bg-[#0a1526] text-[#c5a059] border border-[#0a1526] hover:bg-[#111827]',
      scrollBtn: 'bg-[#0a1526] text-[#c5a059] border border-[#0a1526] hover:bg-[#111827] shadow-lg'
    }
  };

  const currentColors = palettes[theme];
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Lógica de Scroll de la página principal
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Controlar cuándo mostrar la flecha para bajar en el chat
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
    scrollToBottomChat();
  }, [messages, isLoading]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleClearChat = () => setConfirmClear(true);

  // Lógica del Micrófono
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Reconocimiento de voz no compatible con este navegador.");
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
        const textarea = document.getElementById('chatInput');
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
        }
      }, 50);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    try { recognition.start(); } catch (err) {}
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const textarea = document.getElementById('chatInput');
    if (textarea) {
      textarea.style.height = 'auto';
    }

    try {
      const fechaVE = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });

      // WEBHOOK N8N
      const response = await fetch('https://unidaddeia.duckdns.org/webhook/agente-comercial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: 'visitante-web', 
          mensaje: userMsg.text,
          fecha_actual: fechaVE
        })
      });

      if (!response.ok) throw new Error('Error en el servidor');
      const data = await response.json();
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), sender: 'bot', 
        text: data.respuesta || data.text || 'Entendido. ¿Deseas agendar una cita para detallar este asunto?' 
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', text: 'Mis sistemas de comunicación están saturados en este momento. Por favor, intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
  {confirmClear && (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] overflow-hidden"
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-500/10 border border-red-500/30">
            <Trash2 size={22} className="text-red-400" />
          </div>
          <h3 className="text-white font-serif text-lg tracking-wide mb-2">
            Reiniciar Conversación
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-8">
            ¿Deseas reiniciar la conversación? El historial actual se eliminará.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setConfirmClear(false)}
             className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-300 border border-gray-700 hover:border-red-500/50 hover:text-red-300 hover:bg-red-500/5 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
              >
              Cancelar
            </button>
            <button
              onClick={() => { setMessages([initialMessage]); setConfirmClear(false); }}
              className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-3 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      
      <style>{`
        @keyframes agent-pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); background-color: rgba(255, 255, 255, 0.9); }
          50% { transform: scale(1.3); box-shadow: 0 0 0 15px rgba(197, 160, 89, 0); background-color: rgba(197, 160, 89, 0.5); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(197, 160, 89, 0); background-color: rgba(255, 255, 255, 0); }
        }
      `}</style>

      {/* TOAST FLOTANTE */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-[#0a1526] text-[#c5a059] border border-[#c5a059]/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center gap-3 text-[14px] font-medium whitespace-nowrap max-w-[90vw]"
          >
            <Check size={16} /> <span className="truncate">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. VENTANA DE CHAT FLOTANTE */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} transition={{ duration: 0.3 }}
            className={`fixed bottom-24 right-4 md:right-8 z-50 w-[90vw] sm:w-[380px] h-[550px] max-h-[75vh] ${currentColors.windowBg} border border-[#c5a059]/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden transition-colors duration-300`}
          >
            {/* Header del Chat */}
            <div className="relative p-4 border-b border-[#c5a059]/20 flex justify-between items-center shrink-0 overflow-hidden min-h-[75px]">
              <div className="absolute inset-0 z-0">
                <img src="/fondo-servicios.jpg.png" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
              </div>
              <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                <Particles count={15} />
              </div>

              <div 
                className="flex items-center gap-3 relative z-10 cursor-pointer group"
                onMouseEnter={() => setIsHeaderHovered(true)}
                onMouseLeave={() => setIsHeaderHovered(false)}
              >
                <div className="relative w-10 h-11 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img src={logoShield} alt="." className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                </div>
                <div>
                  <h3 className={`font-serif font-bold leading-tight text-[15px] transition-colors duration-300 ${isHeaderHovered ? 'gradient-text-gold text-[#c5a059]' : 'text-white'}`}>
                    ASESOR VIRTUAL
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-green-500 text-[10px] uppercase tracking-wider font-bold">En línea</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 relative z-10">
                <button onClick={handleClearChat} className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-white/10" title="Limpiar historial">
                  <Trash2 size={18} />
                </button>
                <button onClick={toggleTheme} className="text-gray-300 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10" title="Modo Día/Noche">
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-300 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10">
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Área de Mensajes */}
            <div className="relative flex-1 min-h-0">
              <div 
                ref={scrollAreaRef}
                onScroll={handleChatScroll}
                className={`absolute inset-0 overflow-y-auto p-4 space-y-4 ${currentColors.msgAreaBg} [&::-webkit-scrollbar]:hidden transition-colors duration-300`}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'user' ? (
                      <UserMessageBubble msg={msg} currentColors={currentColors} />
                    ) : (
                      <div className="flex flex-col gap-1 max-w-[90%]">
                        <div className={`${currentColors.botBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tl-none shadow-md overflow-hidden`}>
                          <div 
                            className={`leading-snug md:leading-normal text-[13.2px] md:text-[14px] font-sans max-w-none [&_strong]:font-bold [&_p]:mb-1.60 md:[&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-4`}
                            dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`${currentColors.botBubble} p-4 rounded-3xl rounded-tl-none shadow-md flex gap-1.5`}>
                      <span className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Botón Flotante para ir abajo */}
              <AnimatePresence>
                {showScrollBottom && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToBottomChat}
                    className={`absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentColors.scrollBtn}`}
                  >
                    <ArrowDown size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input Expandible ACTUALIZADO Y CENTRADO */}
            <div className={`p-3 border-t ${currentColors.inputAreaBg} shrink-0 transition-colors duration-300 z-10 bg-inherit`}>
              <div className={`flex flex-row items-center gap-1 border rounded-[24px] p-1.5 pr-1.5 focus-within:border-[#c5a059] transition-all duration-300 shadow-2xl min-h-[48px] ${currentColors.inputWrap}`}>
                
                <div className="flex-1 flex flex-col justify-center pl-2">
                  {isRecording ? (
                    <div className="flex items-center gap-3 text-red-500 animate-pulse px-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <span className="text-[14px] font-medium tracking-wide">Escuchando...</span>
                    </div>
                  ) : (
                    <textarea 
                      id="chatInput"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        e.target.style.height = "auto"; 
                        e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                      }}
                      onKeyDown={(e) => { 
                        if (e.key === 'Enter' && !e.shiftKey) { 
                          e.preventDefault(); 
                          handleSendMessage(); 
                        } 
                      }}
                      placeholder="Escribe tu consulta aquí..."
                      rows={1}
                      className={`w-full bg-transparent outline-none text-[14px] resize-none py-1.5 px-2 my-auto [&::-webkit-scrollbar]:hidden ${currentColors.inputText}`}
                      style={{ minHeight: '24px', maxHeight: '100px', lineHeight: '24px' }}
                    />
                  )}
                </div>

                <div className="flex-shrink-0">
                  {isRecording ? (
                    <button onClick={stopRecording} className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95" title="Detener grabación">
                      <Square size={18} className="fill-current" />
                    </button>
                  ) : inputText.trim() ? (
                    <button onClick={handleSendMessage} disabled={isLoading} className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`} title="Enviar mensaje">
                      <Send size={18} className="ml-0.5" />
                    </button>
                  ) : (
                    <button onClick={startRecording} disabled={isLoading} className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`} title="Grabar mensaje de voz">
                      <Mic size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. BOTÓN DEL AGENTE DE IA */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Abrir asesor virtual"
        className="fixed bottom-8 right-4 md:right-8 w-[60px] h-[60px] z-50 flex items-center justify-center outline-none group"
      >
        {!isChatOpen && (
          <div className="absolute inset-0 rounded-full z-0" style={{ animation: 'agent-pulse 2.5s infinite' }} />
        )}
        
        <div className={`relative z-10 w-full h-full rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(197,160,89,0.5)] ${
          isChatOpen ? 'bg-[#151f32] border border-gray-700' : 'bg-gradient-to-br from-[#0a1526] to-[#151f32] border-2 border-[#c5a059]'
        }`}>
          {isChatOpen ? (
            <X size={28} className="text-white" />
          ) : (
            <BotMessageSquare size={30} className="text-[#c5a059] drop-shadow-[0_0_8px_rgba(197,160,89,0.6)] transition-transform group-hover:scale-110" />
          )}
        </div>
      </button>

      {/* 3. BOTÓN SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={scrollToTop}
            className="fixed bottom-8 left-4 md:left-8 w-12 h-12 bg-gradient-to-br from-gold to-gold-bright rounded-full flex items-center justify-center text-navy-dark shadow-lg z-50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/40"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
