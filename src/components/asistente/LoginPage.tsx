import { useState } from 'react';
import logoShield from '@/assets/logo.png.png';
import { Particles } from '@/components/Particles';
import { Lock, Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import { FloatingButtons } from '@/components/FloatingButtons';

// ==========================================
// ESTILOS DE ANIMACIÓN PARA EL BRILLO
// ==========================================
const shineStyle = `
  @keyframes shine {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shine {
    background: linear-gradient(90deg, #ffffff 0%, #c5a059 50%, #ffffff 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shine 2s linear infinite;
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
      <style>{shineStyle}</style>
      
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
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
            <h3 className={`text-2xl font-serif mb-4 ${notification.isError ? 'text-red-400' : 'text-white'}`}>{notification.title}</h3>
            <p className="text-gray-400 mb-8">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="w-full py-3.5 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase rounded-xl">Aceptar</button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8 group" onMouseEnter={() => setIsLoginHovered(true)} onMouseLeave={() => setIsLoginHovered(false)}>
              <div className="w-24 h-28 mb-4 transition-transform duration-300 group-hover:scale-110">
                <img src={logoShield} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
              </div>
              <h2 className={`text-xl font-serif tracking-wide transition-all duration-300 ${isLoginHovered ? 'animate-shine' : 'text-white'}`}>
                {isRegistering ? 'Nuevo Registro' : isRecovering ? 'Recuperar Acceso' : 'Acceso Seguro'}
              </h2>
              <p className="text-[#c5a059] text-xs uppercase tracking-widest mt-1">Plataforma de Inteligencia Legal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {isRegistering && (
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" placeholder="Nombre completo" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required className="w-full bg-[#1e2330]/80 text-white pl-12 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] outline-none" />
                </div>
              )}
              
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Usuario o Correo" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-[#1e2330]/80 text-white pl-12 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] outline-none" />
              </div>

              {isRegistering && (
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="tel" placeholder="Teléfono" value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} required className="w-full bg-[#1e2330]/80 text-white pl-12 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] outline-none" />
                </div>
              )}

              {!isRecovering && (
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#1e2330]/80 text-white pl-12 pr-12 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#c5a059]">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              {loginError && <p className="text-red-400 text-sm text-center">Credenciales incorrectas.</p>}

              <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase py-4 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95 mt-2">
                {isRegistering ? 'Solicitar Registro' : isRecovering ? 'Enviar Enlace' : 'Ingresar a la red'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-4">
              <button onClick={() => isRegistering || isRecovering ? (setIsRegistering(false), setIsRecovering(false)) : setIsRegistering(true)} className="text-gray-400 text-sm hover:text-[#c5a059]">
                {isRegistering || isRecovering ? 'Volver al inicio' : '¿No eres cliente aún? Solicita acceso'}
              </button>
              <button onClick={() => onLogin('guest')} className="block mx-auto text-[#c5a059] hover:text-white text-sm border border-[#c5a059]/30 px-6 py-2 rounded-full">
                Entrar como Invitado
              </button>
            </div>
          </>
        )}
      </div>

      <FloatingButtons />
    </div>
  );
}
