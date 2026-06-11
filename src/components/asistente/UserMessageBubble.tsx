import { useState } from 'react';
import { Copy, Check, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Message } from '@/types/chat.types';

type Props = {
  msg: Message;
  theme: string;
  currentColors: Record<string, string>;
  onEdit: (text: string) => void;
};

export const UserMessageBubble = ({ msg, theme, currentColors, onEdit }: Props) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isLong = msg.text.length > 300;
  const displayText =
    isLong && !expanded ? msg.text.substring(0, 300) + '...' : msg.text;

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
      <div
        className={`${currentColors.userBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tr-none shadow-md`}
      >
        <p className="text-[15px] md:text-[16px] leading-normal md:leading-relaxed whitespace-pre-wrap break-words">
          {displayText}
        </p>
      </div>

      <div className="flex items-center gap-1 mr-2 mt-1">
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={btnClass}
            title={expanded ? 'Mostrar menos' : 'Mostrar más'}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
        <button onClick={handleCopy} className={btnClass} title="Copiar mi mensaje">
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
        <button
          onClick={() => onEdit(msg.text)}
          className={btnClass}
          title="Editar para reusar"
        >
          <Edit2 size={14} />
        </button>
      </div>
    </div>
  );
};
