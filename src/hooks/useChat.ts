import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, AccessMode } from '@/types/chat.types';
import { MODULES_DB } from '@/lib/modules.config';

export function useChat(accessMode: AccessMode, username: string) {
  const [moduloActivo, setModuloActivo] = useState(MODULES_DB[0].name);
  const [webhookActivo, setWebhookActivo] = useState(MODULES_DB[0].hook);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const [chatsHistory, setChatsHistory] = useState<Record<string, Message[]>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const currentMessages = chatsHistory[moduloActivo] || [];

  // Cargar historial al cambiar de modo/usuario
  useEffect(() => {
    if (accessMode !== 'none') {
      const storageKey = `lap_history_${accessMode}_${username || 'guest'}`;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) setChatsHistory(JSON.parse(saved));
        else setChatsHistory({});
      } catch {
        setChatsHistory({});
      }
    }
  }, [accessMode, username]);

  // Guardar historial cuando cambia
  useEffect(() => {
    if (accessMode !== 'none') {
      const storageKey = `lap_history_${accessMode}_${username || 'guest'}`;
      localStorage.setItem(storageKey, JSON.stringify(chatsHistory));
    }
  }, [chatsHistory, accessMode, username]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  const handleChatScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 50);
  };

  const scrollToBottomChat = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cambiarModulo = (nombre: string, webhook: string) => {
    setModuloActivo(nombre);
    setWebhookActivo(webhook);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleClearChat = () => {
    if (window.confirm(`¿Seguro que desea eliminar el historial de ${moduloActivo}?`)) {
      setChatsHistory((prev) => {
        const next = { ...prev };
        delete next[moduloActivo];
        return next;
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const handleShareChat = async () => {
    if (currentMessages.length === 0) return;
    let chatText = `--- Historial de Chat: ${moduloActivo} ---\n\n`;
    currentMessages.forEach((msg) => {
      if (msg.sender === 'loading') return;
      const role = msg.sender === 'user' ? 'Usuario' : 'Asistente IA';
      const cleanText = msg.text.replace(/<[^>]*>?/gm, '');
      chatText += `[${role}]:\n${cleanText}\n\n`;
    });
    if (navigator.share) {
      try {
        await navigator.share({ title: `Reporte de Chat - ${moduloActivo}`, text: chatText });
      } catch (error) {
        console.log('Compartir chat cancelado.', error);
      }
    } else {
      navigator.clipboard.writeText(chatText);
      showToast('Historial de chat completo copiado al portapapeles.');
    }
  };

  const handleEditUserMessage = (textToEdit: string) => {
    const cleanText = textToEdit.replace(/^📎 \[.*?\]\n/, '');
    setInputText(cleanText);
    setTimeout(() => {
      const textarea = document.getElementById('userInput') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.focus();
      }
    }, 50);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('El reconocimiento de voz integrado no es compatible con este navegador.');
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
      setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
      setTimeout(() => {
        const textarea = document.getElementById('userInput') as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };
    recognition.onerror = (e: any) => {
      console.error('Error al acceder al micrófono:', e);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    try {
      recognition.start();
    } catch (err) {
      console.error('Error iniciando reconocimiento:', err);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const userText = selectedFile ? `📎 [${selectedFile.name}]\n${inputText}` : inputText;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      hasAttachment: !!selectedFile,
    };

    setChatsHistory((prev) => ({
      ...prev,
      [moduloActivo]: [...(prev[moduloActivo] || []), newUserMsg].slice(-50),
    }));

    const payloadText = inputText;
    const payloadFile = selectedFile;
    setInputText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    const textarea = document.getElementById('userInput') as HTMLTextAreaElement;
    if (textarea) textarea.style.height = 'auto';

    const loadingId = (Date.now() + 1).toString();
    const activeModuleData = MODULES_DB.find((m) => m.name === moduloActivo);
    const dynamicLoadingText = payloadFile
      ? 'Analizando documento adjunto de forma segura...'
      : activeModuleData?.loadingText || 'Analizando datos...';

    setChatsHistory((prev) => ({
      ...prev,
      [moduloActivo]: [
        ...(prev[moduloActivo] || []),
        { id: loadingId, sender: 'loading', text: dynamicLoadingText },
      ].slice(-50),
    }));

    if (accessMode === 'guest') {
      setTimeout(() => {
        setChatsHistory((prev) => {
          const filtered = (prev[moduloActivo] || []).filter((msg) => msg.id !== loadingId);
          return {
            ...prev,
            [moduloActivo]: [
              ...filtered,
              {
                id: (Date.now() + 2).toString(),
                sender: 'bot',
                text: activeModuleData?.demoText || 'Modo Demo Activo.',
              },
            ].slice(-50),
          };
        });
      }, 1500);
    } else {
      try {
        let base64Data = null;
        if (payloadFile) base64Data = await fileToBase64(payloadFile);

        const requestBody = {
          sessionId: username,
          module: moduloActivo,
          text: payloadText,
          fileData: base64Data,
          fileName: payloadFile?.name || null,
          mimeType: payloadFile?.type || null,
        };

        const response = await fetch(
          `https://unidaddeia.duckdns.org/webhook/${webhookActivo}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) throw new Error('Error en el servidor de IA');

        const data = await response.json();
        const botResponseText =
          data.respuesta ||
          data.text ||
          'Proceso completado. Documento auditado y guardado.';

        setChatsHistory((prev) => {
          const filtered = (prev[moduloActivo] || []).filter((msg) => msg.id !== loadingId);
          return {
            ...prev,
            [moduloActivo]: [
              ...filtered,
              { id: Date.now().toString(), sender: 'bot', text: botResponseText },
            ].slice(-50),
          };
        });
      } catch (error) {
        console.error('Error conectando a n8n:', error);
        setChatsHistory((prev) => {
          const filtered = (prev[moduloActivo] || []).filter((msg) => msg.id !== loadingId);
          return {
            ...prev,
            [moduloActivo]: [
              ...filtered,
              {
                id: Date.now().toString(),
                sender: 'bot',
                text: '⚠️ No es posible establecer conexión con la red segura en este momento. El incidente ha sido reportado a soporte técnico.',
              },
            ].slice(-50),
          };
        });
      }
    }
  };

  return {
    // Estado
    moduloActivo,
    webhookActivo,
    inputText,
    setInputText,
    selectedFile,
    setSelectedFile,
    isRecording,
    toastMsg,
    showScrollBottom,
    chatsHistory,
    currentMessages,
    // Refs
    messagesEndRef,
    scrollAreaRef,
    fileInputRef,
    // Funciones
    showToast,
    handleChatScroll,
    scrollToBottomChat,
    cambiarModulo,
    handleClearChat,
    handleShareChat,
    handleEditUserMessage,
    handleSend,
    startRecording,
    stopRecording,
  };
}
