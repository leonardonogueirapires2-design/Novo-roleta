import React from 'react';
import { Ban, Frown, XCircle } from 'lucide-react';

export type NotificationType = 'BANKRUPT' | 'PASS' | 'WRONG_GUESS' | null;

interface TurnNotificationProps {
  isOpen: boolean;
  type: NotificationType;
  message: string;
}

export const TurnNotification: React.FC<TurnNotificationProps> = ({ isOpen, type, message }) => {
  if (!isOpen || !type) return null;

  const isBankrupt = type === 'BANKRUPT';
  const isPass = type === 'PASS';
  const isWrong = type === 'WRONG_GUESS';

  let bgColor = '';
  let borderColor = '';
  let iconBg = '';
  let iconColor = '';
  let icon = null;
  let title = '';
  let titleColor = '';
  let messageColor = '';
  let barColor = '';

  if (isBankrupt) {
    bgColor = 'bg-zinc-900';
    borderColor = 'border-coke-red';
    iconBg = 'bg-coke-red';
    iconColor = 'text-white';
    icon = <Frown size={64} strokeWidth={2.5} />;
    title = 'PERDEU TUDO!';
    titleColor = 'text-red-500';
    messageColor = 'text-gray-300';
    barColor = 'bg-coke-red';
  } else if (isPass) {
    bgColor = 'bg-yellow-400';
    borderColor = 'border-white';
    iconBg = 'bg-white';
    iconColor = 'text-yellow-500';
    icon = <Ban size={64} strokeWidth={2.5} />;
    title = 'PASSA A VEZ!';
    titleColor = 'text-white drop-shadow-md';
    messageColor = 'text-coke-red';
    barColor = 'bg-white';
  } else if (isWrong) {
    bgColor = 'bg-coke-red';
    borderColor = 'border-white';
    iconBg = 'bg-white';
    iconColor = 'text-coke-red';
    icon = <XCircle size={64} strokeWidth={2.5} />;
    title = 'ERROU!';
    titleColor = 'text-white';
    messageColor = 'text-white/90';
    barColor = 'bg-white';
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`
        transform transition-all scale-100
        relative w-full max-w-md p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center border-4
        ${bgColor} ${borderColor}
      `}>
        <div className={`
          p-6 rounded-full mb-6 shadow-xl transform scale-110
          ${iconBg} ${iconColor}
        `}>
          {icon}
        </div>

        <h2 className={`text-4xl font-black mb-2 uppercase tracking-tighter ${titleColor}`}>
          {title}
        </h2>
        
        <p className={`text-xl font-bold mb-6 ${messageColor}`}>
          {message}
        </p>

        {/* Progress Bar Timer */}
        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
           <div 
             className={`h-full ${barColor}`} 
             style={{ 
               width: '100%',
               animation: 'shrink 5s linear forwards' 
             }} 
           />
        </div>
      </div>
      
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};