import { useState } from 'react';
import logoShield from '@/assets/logo.png.png';
import { Particles } from '@/components/Particles';
import { Lock, Eye, EyeOff } from 'lucide-react';
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
        <img src="/fondo-servicios.jpg.png" alt="Fondo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a1526]/85 backdrop-blur-[2px]"></div>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Particles count={40} />
      </div>

      {/* Tarjeta */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-gradient-to-br from-[#151f32]/95 via-[#0a1526]/95 to-[#030712]/95 backdrop-blur-xl border border-[#c5a059]/30 rounded-3xl shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500">

        {/* ---- MODAL DE NOTIFICACIÓN ---- */}
        {notification ? (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
            <div
              className="flex flex-col items-center mb-4 group cursor-pointer"
              onMouseEnter={() => setIsNotificationHovered(true)}
              onMouseLeave={() => setIsNotificationHovered(false)}
            >
              <div className="relative w-24 h-28 mb-4 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={logoShield}
                  alt="."
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                />
              </div>
              <h3
                className={`text-2xl font-serif tracking-wide transition-colors duration-300 ${
                  isNotificationHovered && !notification.isError
                    ? 'gradient-text-gold text-[#c5a059]'
                    : notification.isError
                    ? 'text-red-400'
                    : 'text-white'
                }`}
              >
                {notification.title}
              </h3>
            </div>
            <p className={`text-[15px] mb-8 leading-relaxed px-2 ${notification.isError ? 'text-red-400' : 'text-gray-400'}`}>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className="w-full flex justify-center items-center py-3.5 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95"
            >
              Aceptar
            </button>
          </div>
        ) : (
          <>
            {/* ---- ENCABEZADO / LOGO ---- */}
            <div
              className="flex flex-col items-center mb-8 group cursor-pointer"
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
            >
              <div className="relative w-24 h-28 mb-4 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={logoShield}
                  alt="."
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                />
              </div>
              <h2
                className={`text-xl font-serif tracking-wide transition-colors duration-300 ${
                  isLoginHovered ? 'gradient-text-gold' : 'text-white'
                }`}
              >
                {isRegistering ? 'Nuevo Registro' : isRecovering ? 'Recuperar Acceso' : 'Acceso Seguro'}
              </h2>
              <p className="text-[#c5a059] text-xs uppercase tracking-widest mt-1">Plataforma de Inteligencia Legal</p>
            </div>

            {/* ---- FORMULARIO ---- */}
            <form
              onSubmit={isRegistering ? handleRegister : isRecovering ? handleRecoverPassword : handleLogin}
              className="space-y-4"
            >
              {isRegistering && (
                <div>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <input
                  type="text"
                  placeholder={isRegistering || isRecovering ? 'Correo electrónico' : 'Usuario o Correo'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all"
                />
              </div>

              {isRegistering && (
                <div>
                  <input
                    type="tel"
                    placeholder="Número de teléfono (Ej: +54 9 11...)"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    required
                    className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all"
                  />
                </div>
              )}

              {!isRecovering && (
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-[#1e2330]/80 text-white placeholder-gray-500 border border-gray-700 rounded-xl p-4 pr-12 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#c5a059] transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {!isRegistering && (
                    <div className="flex justify-end pr-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsRecovering(true)}
                        className="text-xs text-gray-400 hover:text-[#c5a059] transition-colors"
                      >
                        ¿Olvidó su contraseña?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {loginError && !isRegistering && !isRecovering && (
                <p className="text-red-400 text-sm text-center animate-pulse">Credenciales incorrectas. Intente nuevamente.</p>
              )}

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c5a059] via-[#e2c792] to-[#c5a059] text-[#0a1526] font-bold uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all active:scale-95 mt-2"
              >
                <Lock size={18} />
                {isRegistering ? 'Solicitar Registro' : isRecovering ? 'Enviar Enlace' : 'Ingresar a la red'}
              </button>
            </form>

            {/* ---- LINKS INFERIORES ---- */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-4">
              {isRecovering ? (
                <p className="text-gray-400 text-sm">
                  ¿Recordó su contraseña?{' '}
                  <button
                    onClick={() => setIsRecovering(false)}
                    className="text-[#c5a059] hover:text-white transition-colors font-medium"
                  >
                    Inicia sesión
                  </button>
                </p>
              ) : isRegistering ? (
                <p className="text-gray-400 text-sm">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="text-[#c5a059] hover:text-white transition-colors font-medium"
                  >
                    Inicia sesión
                  </button>
                </p>
              ) : (
                <p className="text-gray-400 text-sm">
                  ¿No eres cliente aún?{' '}
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-[#c5a059] hover:text-white transition-colors font-medium"
                  >
                    Solicita tu acceso
                  </button>
                </p>
              )}

              <button
                onClick={() => onLogin('guest')}
                className="text-[#c5a059] hover:text-white text-sm font-medium transition-colors border border-[#c5a059]/30 px-6 py-2 rounded-full hover:bg-[#c5a059]/10"
              >
                Entrar a la versión Demo (Invitado)
              </button>
            </div>
          </>
        )}
      </div>

      {/* Aquí colocamos el Chatbot para que flote sobre el login */}
      <FloatingButtons />
    </div>
  );
}
