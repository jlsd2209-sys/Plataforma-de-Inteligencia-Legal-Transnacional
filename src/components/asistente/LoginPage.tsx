import { useState } from 'react';
import logoShield from '@/assets/logo.png.png';
import { Particles } from '@/components/Particles';
import { Lock, Eye, EyeOff, User, X, ShieldCheck} from 'lucide-react';
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
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);
  const [logoScale, setLogoScale] = useState(false);

  const [notification, setNotification] = useState<{ title: string; message: string; isError?: boolean } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'cliente123' && password === 'cliente123') {
      setLoginError(false);
      onLogin('client', username);
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
          fecha: fechaVE,
        }),
      });
      setNotification({
        title: 'Solicitud Enviada',
        message: 'Su solicitud de acceso ha sido recibida con éxito. Nuestro equipo de asesores verificará su perfil y se pondrá en contacto pronto.',
      });
      setIsRegistering(false);
      setUsername('');
      setPassword('');
      setRegisterName('');
      setRegisterPhone('');
    } catch (error) {
      console.error('Error al registrar:', error);
      setNotification({
        title: 'Error de Conexión',
        message: 'Hubo un error de conexión al enviar su solicitud. Por favor intente nuevamente en unos minutos.',
        isError: true,
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
        body: JSON.stringify({ correo: username, fecha: fechaVE }),
      });
      setNotification({
        title: 'Recuperación en Proceso',
        message: 'Si el correo ingresado coincide con nuestros registros seguros, recibirá instrucciones detalladas para restablecer su acceso.',
      });
      setIsRecovering(false);
      setUsername('');
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      setNotification({
        title: 'Error de Conexión',
        message: 'Hubo un error de comunicación con el servidor. Por favor intente nuevamente en unos minutos.',
        isError: true,
      });
    }
  };

  // Fondo original de los inputs: bg-[#1e2330]/80
  const inputClass = "w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 focus:border-[#d4af70] focus:ring-1 focus:ring-[#d4af70] outline-none transition-all text-[15px]";
  const submitBtnClass = "w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-[14px] text-sm rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95";
  const footerClass = "mt-4 pt-4 border-t border-gray-800 text-center space-y-3";
  // Efecto original: dorado sólido → blanco al hover, sin degradado
  const goldLink = "text-[#e2c792] hover:text-white transition-colors duration-300 font-medium";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a1526] font-sans overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src="/fondo-servicios.jpg.png" alt="." onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Particles count={40} />
      </div>

      {/* Modal de notificación */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onMouseEnter={() => setIsNotificationHovered(true)}
              onMouseLeave={() => setIsNotificationHovered(false)}
              className="bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] px-10 py-8 max-w-md w-full text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${notification.isError ? 'bg-red-600/15 border border-red-600/40' : 'bg-green-500/10 border border-green-500/30'}`}>
                {notification.isError ? <X size={44} className="text-red-500" /> : <ShieldCheck size={44} className="text-green-500" />}
              </div>
              <h3 className={`text-xl font-semibold uppercase mb-3 ${notification.isError ? 'text-red-500' : 'gradient-text-gold'}`}>
                {notification.title}
              </h3>
              <p className="text-white text-sm leading-relaxed mb-6">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
               className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-[14px] text-sm rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TARJETA ÚNICA ── */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500 overflow-hidden">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center text-center pt-8 px-10 group cursor-pointer"
        >
          {/* Logo — escala SOLO cuando el cursor está encima de él */}
          <div
            className={`relative w-24 h-28 mb-3 flex-shrink-0 flex items-center justify-center transition-transform duration-300 cursor-pointer ${logoScale ? 'scale-110' : 'scale-100'}`}
            onMouseEnter={() => setLogoScale(true)}
            onMouseLeave={() => setLogoScale(false)}
          >
            <img
              src={logoShield}
              alt="Logo"
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]"
            />
          </div>

          {/* Título — blanco fijo, mayúsculas */}
          <h1 className="relative text-xl font-serif tracking-widest uppercase">
            <span className="absolute inset-0 gradient-text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Plataforma Legal Transnacional
            </span>
            <span className="relative text-white group-hover:opacity-0 transition-opacity duration-300">
              Plataforma Legal Transnacional
            </span>
          </h1>
        </motion.div>

        {/* ── Cuerpo ── */}
        <div className="px-10 pb-6 pt-6">

          {/* ── LOGIN ── */}
          {!isRegistering && !isRecovering && (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${inputClass} pl-11`}
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-11 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e2c792] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {loginError && (
                  <p className="text-red-400 text-sm text-center animate-pulse">
                    Credenciales incorrectas. Verifique sus datos.
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsRecovering(true)}
                    className="text-xs text-gray-400 hover:text-[#e2c792] transition-colors"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>

                <button type="submit" className={submitBtnClass}>
                  Ingresar a la red
                </button>
              </form>

              <div className={footerClass}>
                <p className="text-gray-400 text-sm">
                  ¿No eres cliente aún?{' '}
                  <button
                    onClick={() => { setIsRegistering(true); setIsRecovering(false); setLoginError(false); }}
                    className={goldLink}
                  >
                    Solicita tu acceso
                  </button>
                </p>
                <button
                  onClick={() => onLogin('guest')}
                  className={`${goldLink} text-sm border border-[#c5a059]/30 px-6 py-2 rounded-full hover:bg-[#c5a059]/10`}
                >
                  Entrar a la versión Demo (Invitado)
                </button>
              </div>
            </>
          )}

          {/* ── REGISTRO ── */}
          {isRegistering && (
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" placeholder="Nombre completo" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required className={inputClass} />
                <input type="email" placeholder="Correo electrónico" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClass} />
                <input type="tel" placeholder="Teléfono" value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} required className={inputClass} />
                <input type="password" placeholder="Contraseña deseada" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                <button type="submit" className={submitBtnClass}>
                  Solicitar Acceso
                </button>
              </form>

              <div className={footerClass}>
                <p className="text-gray-400 text-sm">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    onClick={() => { setIsRegistering(false); setIsRecovering(false); }}
                    className={goldLink}
                  >
                    Inicia sesión
                  </button>
                </p>
                <button
                  onClick={() => onLogin('guest')}
                  className={`${goldLink} text-sm border border-[#c5a059]/30 px-6 py-2 rounded-full hover:bg-[#c5a059]/10`}
                >
                  Entrar a la versión Demo (Invitado)
                </button>
              </div>
            </>
          )}

          {/* ── RECUPERAR CONTRASEÑA ── */}
          {isRecovering && (
            <>
              <form onSubmit={handleRecoverPassword} className="space-y-4">
                <input type="email" placeholder="Correo electrónico registrado" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClass} />
                <button type="submit" className={submitBtnClass}>
                  Recuperar Acceso
                </button>
              </form>

              <div className={footerClass}>
                <p className="text-gray-400 text-sm">
                  ¿Recordó su contraseña?{' '}
                  <button
                    onClick={() => { setIsRecovering(false); setIsRegistering(false); }}
                    className={goldLink}
                  >
                    Inicia sesión
                  </button>
                </p>
                <button
                  onClick={() => onLogin('guest')}
                  className={`${goldLink} text-sm border border-[#c5a059]/30 px-6 py-2 rounded-full hover:bg-[#c5a059]/10`}
                >
                  Entrar a la versión Demo (Invitado)
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Chatbot flotante */}
      <FloatingButtons />
    </div>
  );
}
