import { useState } from 'react';
import logoShield from '@/assets/logo.png.png';
import { Particles } from '@/components/Particles';
import { Lock, Eye, EyeOff, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingButtons } from '@/components/FloatingButtons';

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

  // Helper para volver al inicio
  const resetToLogin = () => {
    setIsRegistering(false);
    setIsRecovering(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'cliente123' && password === 'cliente123') {
      onLogin('client', username);
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a1526] font-sans overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img src="/fondo-servicios.jpg.png" alt="Fondo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Particles count={40} />
      </div>

      {/* Contenedor Principal */}
      <div 
        className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-[#0a1526]/90 border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500"
        onMouseEnter={() => setIsLoginHovered(true)}
        onMouseLeave={() => setIsLoginHovered(false)}
      >
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="relative w-24 h-28 mb-4 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <img src={logoShield} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
          </div>
          <h1 className={`text-2xl font-serif tracking-wide transition-colors duration-300 ${isLoginHovered ? 'text-[#c5a059]' : 'text-white'}`}>
            Plataforma Legal Transnacional
          </h1>
          <p className="text-[#c5a059] text-xs uppercase tracking-widest mt-1">Centro de Inteligencia Legal</p>
        </div>

        {/* --- FORMULARIOS --- */}
        <div className="space-y-4">
          {!isRegistering && !isRecovering && (
            // LOGIN
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Correo electrónico" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#030712] border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 focus:border-[#c5a059] outline-none text-sm" />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#030712] border border-gray-700 text-white rounded-xl py-3 pl-11 pr-11 outline-none text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#c5a059]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="button" onClick={() => setIsRecovering(true)} className="text-xs text-gray-400 hover:text-[#c5a059] w-full text-right">¿Olvidó su contraseña?</button>
              <button type="submit" className="w-full bg-gradient-to-r from-[#c5a059] to-[#8b6e3d] text-[#0a1526] font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all">Acceder</button>
              
              <div className="pt-6 border-t border-gray-800 text-center space-y-4">
                <button type="button" onClick={() => setIsRegistering(true)} className="text-sm text-gray-400 hover:text-[#c5a059]">¿No eres cliente? Solicita acceso</button>
                <button type="button" onClick={() => onLogin('guest')} className="block w-full text-[#c5a059] text-sm border border-[#c5a059]/30 py-2 rounded-full hover:bg-[#c5a059]/10">Entrar como Invitado</button>
              </div>
            </form>
          )}

          {isRegistering && (
            // REGISTRO
            <div className="space-y-4">
              <input type="text" placeholder="Nombre completo" value={registerName} onChange={(e) => setRegisterName(e.target.value)} className="w-full bg-[#030712] border border-gray-700 text-white rounded-xl py-3 px-4 outline-none text-sm" />
              <button onClick={() => { /* tu logica de registro */ }} className="w-full bg-[#c5a059] text-[#0a1526] font-bold py-3 rounded-xl">Enviar solicitud</button>
              <button onClick={resetToLogin} className="w-full text-gray-400 text-sm hover:text-white">Volver a inicio de sesión</button>
            </div>
          )}

          {isRecovering && (
            // RECUPERACIÓN
            <div className="space-y-4">
              <input type="email" placeholder="Correo registrado" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#030712] border border-gray-700 text-white rounded-xl py-3 px-4 outline-none text-sm" />
              <button onClick={() => { /* tu logica de recuperar */ }} className="w-full bg-[#c5a059] text-[#0a1526] font-bold py-3 rounded-xl">Enviar instrucciones</button>
              <button onClick={resetToLogin} className="w-full text-gray-400 text-sm hover:text-white">Volver a inicio de sesión</button>
            </div>
          )}
        </div>
      </div>
      <FloatingButtons />
    </div>
  );
}
