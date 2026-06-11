import { useState } from 'react';
import logoShield from '@/assets/logo.png.png';
import { Particles } from '@/components/Particles';
import { Lock, Eye, EyeOff, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Importamos el componente de los botones flotantes
import { FloatingButtons } from '@/components/FloatingButtons';

// ==========================================
// TIPOS
// ==========================================
export type AccessMode = 'none' | 'client' | 'guest';

interface LoginPageProps {
  onLogin: (mode: AccessMode, username?: string) => void;
}

// ==========================================
// COMPONENTE: PANTALLA DE ACCESO
// ==========================================
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

  const [notification, setNotification] = useState<{ title: string; message: string; isError?: boolean } | null>(null);

  // ==========================================
  // HANDLERS
  // ==========================================
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
        message:
          'Su solicitud de acceso ha sido recibida con éxito. Nuestro equipo de asesores verificará su perfil y se pondrá en contacto pronto.',
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
        message:
          'Si el correo ingresado coincide con nuestros registros seguros, recibirá instrucciones detalladas para restablecer su acceso.',
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

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a1526] font-sans overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/fondo-servicios.jpg.png"
          alt="Fondo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Particles count={40} />
      </div>

      {/* Modal de notificación con Framer Motion */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onMouseEnter={() => setIsNotificationHovered(true)}
              onMouseLeave={() => setIsNotificationHovered(false)}
              className="bg-[#0d1d35] border border-[#c5a059]/30 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  notification.isError
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-[#c5a059]/10 border border-[#c5a059]/30'
                }`}
              >
                {notification.isError ? (
                  <X size={28} className="text-red-400" />
                ) : (
                  <Lock size={28} className="text-[#c5a059]" />
                )}
              </div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  notification.isError ? 'text-red-400' : 'text-[#c5a059]'
                }`}
              >
                {notification.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  notification.isError
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                    : 'bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/20 border border-[#c5a059]/30'
                }`}
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor Principal (Tarjeta de login) */}
      <div
        className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500"
        onMouseEnter={() => setIsLoginHovered(true)}
        onMouseLeave={() => setIsLoginHovered(false)}
      >
        <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <div
            className={`relative w-24 h-28 mb-4 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110'
            }`}
          >
            <img
              src={logoShield}
              alt="Logo"
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]"
            />
          </div>
          <h1 
            className={`text-2xl font-serif tracking-wide transition-colors duration-300 ${
                  isLoginHovered ? 'gradient-text-gold' : 'text-white'
            }`}
          >
            Plataforma Legal Transnacional
          </h1>
          <p className="text-[#c5a059] text-xs uppercase tracking-widest mt-1">
            Centro de Inteligencia Legal
          </p>
        </div>

        {/* Formulario de Login */}
        {!isRegistering && !isRecovering && (
          <>
            <form
              onSubmit={handleLogin}
              className="bg-[#0d1d35]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-2xl p-8 shadow-2xl space-y-5"
            >
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Correo electrónico"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#c5a059] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  className="text-xs text-gray-400 hover:text-[#c5a059] transition-colors"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95 mt-2"
              >
                Acceder de forma segura
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-4">
              <p className="text-gray-400 text-sm">
                ¿No eres cliente aún?{' '}
                <button
                  onClick={() => setIsRegistering(true)}
                  className="text-[#c5a059] hover:text-white transition-colors font-medium"
                >
                  Solicita tu acceso
                </button>
              </p>
              <button
                onClick={() => onLogin('guest')}
                className="text-[#c5a059] hover:text-white text-sm font-medium transition-colors border border-[#c5a059]/30 px-6 py-2 rounded-full hover:bg-[#c5a059]/10"
              >
                Entrar a la versión Demo (Invitado)
              </button>
            </div>
          </>
        )}

        {/* Formulario de Registro */}
        {isRegistering && (
          <>
            <form
              onSubmit={handleRegister}
              className="bg-[#0d1d35]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-2xl p-8 shadow-2xl space-y-4"
            >
              <h2 className="text-white text-lg font-light text-center mb-2 uppercase tracking-widest">
                Nuevo Registro
              </h2>
              <input
                type="text"
                placeholder="Nombre completo"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 px-4 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 px-4 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
              />
              <input
                type="tel"
                placeholder="Teléfono (Ej: +54 9 11...)"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                required
                className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 px-4 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
              />
              <input
                type="password"
                placeholder="Contraseña deseada"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 px-4 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95 mt-2"
              >
                Enviar solicitud
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <p className="text-gray-400 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => setIsRegistering(false)}
                  className="text-[#c5a059] hover:text-white transition-colors font-medium"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </>
        )}

        {/* Formulario de Recuperación */}
        {isRecovering && (
          <>
            <form
              onSubmit={handleRecoverPassword}
              className="bg-[#0d1d35]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-2xl p-8 shadow-2xl space-y-4"
            >
              <h2 className="text-white text-lg font-light text-center mb-2 uppercase tracking-widest">
                Recuperar Acceso
              </h2>
              <input
                type="email"
                placeholder="Correo electrónico registrado"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 px-4 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95 mt-2"
              >
                Enviar instrucciones
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <p className="text-gray-400 text-sm">
                ¿Recordó su contraseña?{' '}
                <button
                  onClick={() => setIsRecovering(false)}
                  className="text-[#c5a059] hover:text-white transition-colors font-medium"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Aquí colocamos el Chatbot para que flote sobre el login */}
      <FloatingButtons />
    </div>
  );
}
