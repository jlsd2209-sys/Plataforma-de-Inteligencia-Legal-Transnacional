import { useState, useEffect } from 'react';
import { Copy, Check, Share2, Volume2, VolumeX, ThumbsUp, ThumbsDown } from 'lucide-react';

type Props = {
  text: string;
  theme: string;
  accessMode: string;
  showToast: (msg: string) => void;
};

export const BotMessageActions = ({ text, theme, accessMode, showToast }: Props) => {
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
      showToast('Respuesta copiada al portapapeles.');
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Su navegador no soporta la función de lectura en voz alta.');
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
      showToast('Evaluación simulada en Modo Demo.');
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
          fecha: fechaVE,
        }),
      });
      showToast('Gracias por su evaluación. Nos ayuda a mejorar.');
    } catch (error) {
      console.error('Error enviando evaluación:', error);
    }
  };

  const btnClass = `p-1.5 rounded-md transition-colors ${
    theme === 'dark'
      ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]'
      : 'text-gray-500 hover:text-[#c5a059] hover:bg-[#eee7d5]'
  }`;

  return (
    <div className="flex items-center gap-1 ml-2 mt-1">
      <button
        onClick={handleSpeak}
        className={btnClass}
        title={isSpeaking ? 'Detener lectura' : 'Escuchar respuesta'}
      >
        {isSpeaking ? (
          <VolumeX size={14} className="text-red-400" />
        ) : (
          <Volume2 size={14} />
        )}
      </button>
      <button onClick={handleCopy} className={btnClass} title="Copiar respuesta">
        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      </button>
      <button onClick={handleShare} className={btnClass} title="Compartir respuesta">
        <Share2 size={14} />
      </button>
      <button
        onClick={() => handleFeedback('up')}
        className={`${btnClass} ${feedback === 'up' ? '!text-green-500' : ''}`}
        title="Buena respuesta"
      >
        <ThumbsUp size={14} />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={`${btnClass} ${feedback === 'down' ? '!text-red-500' : ''}`}
        title="Mala respuesta"
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  );
};
