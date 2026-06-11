import { useState } from 'react';
import logoShield from '@/assets/logo.png.png';
import { Particles } from '@/components/Particles';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { FloatingButtons } from '@/components/FloatingButtons';

// ==========================================
// ESTILOS PARA EL EFECTO DE BRILLO (SHINE)
// ==========================================
const shineEffect = `
  @keyframes shine {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shine {
    background: linear-gradient(90deg, #fff 0%, #c5a059 50%, #fff 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shine 3s linear infinite;
  }
`;

export type AccessMode = 'none' | 'client' | 'guest';

interface LoginPageProps {
  onLogin: (mode: AccessMode, username?: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; isError?: boolean } | null>(null);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a1526] font-sans overflow-hidden">
      <style>{shineEffect}</style>
      
      {/* Fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src="/fondo-servicios.jpg.png" alt="Fondo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Particles count={40} />
      </div>

      {/* Tarjeta Principal */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500">
        
        {notification ? (
           // ... (Tu código de notificación se mantiene igual)
           <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-serif text-white mb-4">{notification.title}</h3>
              <p className="text-gray-400 mb-8">{notification.message}</p>
              <button onClick={() => setNotification(null)} className="w-full py-3.5 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase rounded-xl">Aceptar</button>
           </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8" onMouseEnter={() => setIsLoginHovered(true)} onMouseLeave={() => setIsLoginHovered(false)}>
              <div className="w-24 h-28 mb-4 transition-transform duration-300 group-hover:scale-110">
                <img src={logoShield} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
              </div>
              
              {/* Título con efecto de brillo al hacer hover */}
              <h2 className={`text-xl font-serif tracking-wide transition-all duration-500 ${isLoginHovered ? 'animate-shine' : 'text-white'}`}>
                {isRegistering ? 'Nuevo Registro' : isRecovering ? 'Recuperar Acceso' : 'Acceso Seguro'}
              </h2>
              <p className="text-[#c5a059] text-xs uppercase tracking-widest mt-1">Plataforma de Inteligencia Legal</p>
            </div>

            {/* Formulario */}
            <form className="space-y-4">
              {/* ... (Tus inputs aquí, manteniendo las clases que ya tenías) */}
              
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95 mt-2"
              >
                <Lock size={18} />
                {isRegistering ? 'Solicitar Registro' : isRecovering ? 'Enviar Enlace' : 'Ingresar a la red'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-4">
               {/* ... (Tus botones de navegación inferior) */}
            </div>
          </>
        )}
      </div>

      <FloatingButtons />
    </div>
  );
}
