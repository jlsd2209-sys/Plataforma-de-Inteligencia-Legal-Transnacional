import { useState } from 'react';
import logoShield from '@/assets/logo.png.png';
import { useSearchParams } from 'react-router-dom';
import { Particles } from '@/components/Particles';
import {
  Sun, Moon, Send, Menu, X, Lock, Eye, EyeOff, LogOut, User,
  Trash2, Paperclip, FileText, Mic, Square, Share, ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { AccessMode } from '@/types/chat.types';
import { MODULES_DB, COLOR_PALETTES } from '@/lib/modules.config';
import { BotMessageActions } from '@/components/asistente/BotMessageActions';
import { UserMessageBubble } from '@/components/asistente/UserMessageBubble';
import { useChat } from '@/hooks/useChat';

export default function AsistentePage() {
  const [accessMode, setAccessMode] = useState<AccessMode>('none');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    isError?: boolean;
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('modulo') || 'webhook-riesgo';
  const initialModule = MODULES_DB.find((m) => m.hook === urlParam) || MODULES_DB[0];

  const chat = useChat(accessMode, username);
  const currentColors = COLOR_PALETTES[theme];
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // ==========================================
  // HANDLERS DE AUTENTICACIÓN
  // ==========================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'cliente123' && password === 'cliente123') {
      setLoginError(false);
      setAccessMode('client');
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
        message:
          'Hubo un error de conexión al enviar su solicitud. Por favor intente nuevamente en unos minutos.',
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
        message:
          'Hubo un error de comunicación con el servidor. Por favor intente nuevamente en unos minutos.',
        isError: true,
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Seguro que desea cerrar sesión de forma segura?')) {
      setAccessMode('none');
      setUsername('');
      setPassword('');
      setRegisterName('');
      setRegisterPhone('');
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  // ==========================================
  // PANTALLA DE ACCESO
  // ==========================================
  if (accessMode === 'none') {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a1526] font-sans overflow-hidden">
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

        {/* Modal de notificación */}
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
                    <X
                      size={28}
                      className="text-red-400"
                    />
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

        {/* Tarjeta de login */}
        <div
          className="relative z-10 w-full max-w-md mx-4"
          onMouseEnter={() => setIsLoginHovered(true)}
          onMouseLeave={() => setIsLoginHovered(false)}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className={`w-20 h-24 mb-4 transition-transform duration-300 ${
                isLoginHovered ? 'scale-110' : 'scale-100'
              }`}
            >
              <img
                src={logoShield}
                alt="Logo"
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]"
              />
            </div>
            <h1 className="text-white text-2xl font-light tracking-widest uppercase text-center">
              Plataforma Legal Transnacional
            </h1>
            <p className="text-[#c5a059] text-xs tracking-widest uppercase mt-1">
              Centro de Inteligencia Legal
            </p>
          </div>

          {!isRegistering && !isRecovering && (
            <>
              <form
                onSubmit={handleLogin}
                className="bg-[#0d1d35]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-2xl p-8 shadow-2xl space-y-5"
              >
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Correo electrónico"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0a1526] border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                  />
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c5a059] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginError && (
                  <p className="text-red-400 text-xs text-center">
                    Credenciales incorrectas. Verifique sus datos.
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsRecovering(true)}
                    className="text-gray-400 hover:text-[#c5a059] text-xs transition-colors"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-xl py-3 font-medium hover:bg-[#c5a059]/20 transition-all"
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
                  onClick={() => setAccessMode('guest')}
                  className="text-[#c5a059] hover:text-white text-sm font-medium transition-colors border border-[#c5a059]/30 px-6 py-2 rounded-full hover:bg-[#c5a059]/10"
                >
                  Entrar a la versión Demo (Invitado)
                </button>
              </div>
            </>
          )}

          {isRegistering && (
            <>
              <form
                onSubmit={handleRegister}
                className="bg-[#0d1d35]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-2xl p-8 shadow-2xl space-y-4"
              >
                <h2 className="text-white text-lg font-light text-center mb-2">
                  Solicitar acceso verificado
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
                  placeholder="Teléfono (con código de país)"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
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
                  className="w-full bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-xl py-3 font-medium hover:bg-[#c5a059]/20 transition-all"
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

          {isRecovering && (
            <>
              <form
                onSubmit={handleRecoverPassword}
                className="bg-[#0d1d35]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-2xl p-8 shadow-2xl space-y-4"
              >
                <h2 className="text-white text-lg font-light text-center mb-2">
                  Recuperar acceso
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
                  className="w-full bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-xl py-3 font-medium hover:bg-[#c5a059]/20 transition-all"
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
      </div>
    );
  }

  // ==========================================
  // INTERFAZ PRINCIPAL DE CHAT
  // ==========================================
  return (
    <div
      className={`fixed inset-0 flex w-screen overflow-hidden overscroll-none ${currentColors.appBG} font-sans transition-colors duration-300`}
    >
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 h-full flex flex-col border-r border-gray-800 overflow-x-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'
        } ${isDesktopSidebarCollapsed ? 'md:w-[80px]' : 'md:w-[260px]'}`}
      >
        <button
          className="absolute top-4 right-4 z-50 md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/fondo-servicios.jpg.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 ${currentColors.sidebarOverlay} transition-colors duration-300`}
          ></div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <Particles count={25} />
        </div>

        <div
          className={`hidden md:flex relative z-20 w-full pt-5 px-5 transition-all duration-300 ${
            isDesktopSidebarCollapsed ? 'justify-center px-0' : 'justify-end'
          }`}
        >
          <button
            onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
            className={`p-2 rounded-lg transition-all text-gray-400 hover:text-[#c5a059] ${currentColors.sidebarBtnHover}`}
            title={isDesktopSidebarCollapsed ? 'Expandir panel' : 'Minimizar panel'}
          >
            <Menu size={22} />
          </button>
        </div>

        <div
          className="pt-2 pb-6 px-6 relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-300"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <div
            className={`relative ${
              isDesktopSidebarCollapsed ? 'md:w-10 md:h-12 w-20 h-24' : 'w-20 h-24'
            } mb-3 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
          >
            <img
              src={logoShield}
              alt="."
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]"
            />
          </div>
          <h2
            className={`text-center text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${
              isLogoHovered ? 'gradient-text-gold' : 'text-white'
            } ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}
          >
            Plataforma Legal Transnacional
          </h2>
        </div>

        <nav
          className={`flex-1 overflow-y-auto px-3 space-y-1 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${currentColors.sidebarBtnText}`}
        >
          <p
            className={`text-[10px] text-gray-500 font-bold px-3 mb-2 uppercase ${
              isDesktopSidebarCollapsed ? 'md:hidden' : ''
            }`}
          >
            Centro de Inteligencia Legal
          </p>
          {MODULES_DB.map((mod) => (
            <button
              key={mod.hook}
              onClick={() => {
                chat.cambiarModulo(mod.name, mod.hook);
                setIsMobileMenuOpen(false);
              }}
              title={isDesktopSidebarCollapsed ? mod.name : undefined}
              className={`w-full flex items-center p-3 rounded-lg text-sm transition-all ${currentColors.sidebarBtnHover} border-l-4 ${
                chat.moduloActivo === mod.name
                  ? currentColors.sidebarBtnActive
                  : 'border-transparent hover:border-[#c5a059]'
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5 text-lg flex-shrink-0">
                {mod.icon}
              </div>
              <span
                className={`ml-3 whitespace-nowrap ${
                  isDesktopSidebarCollapsed ? 'md:hidden' : ''
                }`}
              >
                {mod.name}
              </span>
            </button>
          ))}
        </nav>

        <div
          className={`border-t border-gray-800 relative z-10 flex transition-all duration-300 ${
            isDesktopSidebarCollapsed
              ? 'p-4 flex-col items-center gap-4'
              : 'p-4 flex-row items-center justify-between'
          }`}
        >
          <div
            className="flex items-center gap-3 overflow-hidden"
            title={
              isDesktopSidebarCollapsed
                ? accessMode === 'client'
                  ? username
                  : 'Invitado'
                : undefined
            }
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c5a059]/20 to-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center flex-shrink-0 font-bold shadow-lg">
              {accessMode === 'client' ? <User size={18} /> : 'G'}
            </div>
            <div
              className={`flex flex-col truncate transition-opacity duration-300 ${
                isDesktopSidebarCollapsed ? 'hidden' : 'block'
              }`}
            >
              <span className="text-[15px] md:text-[16px] font-medium text-gray-200 truncate">
                {accessMode === 'client' ? username : 'Invitado'}
              </span>
              <span className="text-[10px] text-[#c5a059] uppercase tracking-wider truncate">
                {accessMode === 'client' ? 'Cuenta Verificada' : 'Modo Demo'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 bg-gray-500/10 text-gray-400 hover:bg-[#c5a059]/10 hover:text-[#c5a059] rounded-xl transition-all"
            title="Cerrar sesión segura"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col relative w-full h-full min-w-0 min-h-0 overflow-hidden overscroll-none transition-all duration-300">
        {/* HEADER */}
        <header
          className={`w-full flex-shrink-0 min-h-[4rem] border-b ${currentColors.mainHeaderBorder} flex items-center justify-between px-4 md:px-6 ${currentColors.mainHeaderBG} backdrop-blur-md z-30 transition-colors duration-300`}
        >
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <button
              className={`md:hidden p-2 -ml-2 rounded-full transition-all flex-shrink-0 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-[#1e2a40]'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3 flex-1">
              <h2
                className={`font-medium ${currentColors.mainTitle} tracking-wide text-[15px] md:text-lg leading-tight`}
              >
                {chat.moduloActivo}
              </h2>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium border ${
                  accessMode === 'client'
                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                    : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                }`}
              >
                {accessMode === 'client' ? 'Verificado' : 'Modo Demo'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 items-center flex-shrink-0">
            {chat.currentMessages.length > 0 && (
              <>
                <button
                  onClick={chat.handleShareChat}
                  className={`p-2 rounded-full ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#1e2a40]'
                      : 'text-[#2a303c] hover:text-[#c5a059] hover:bg-[#eee7d5]'
                  } transition-all`}
                  title="Compartir historial completo"
                >
                  <Share size={18} />
                </button>
                <button
                  onClick={chat.handleClearChat}
                  className={`p-2 rounded-full ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-red-400 hover:bg-[#1e2a40]'
                      : 'text-[#2a303c] hover:text-red-500 hover:bg-[#eee7d5]'
                  } transition-all`}
                  title="Limpiar historial de este módulo"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-[#1e2a40]'
                  : 'text-[#2a303c] hover:bg-[#eee7d5]'
              } transition-all`}
              title={theme === 'dark' ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="flex gap-2 items-center">
              <span className="hidden sm:inline text-xs text-gray-500">Esperando...</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
          </div>
        </header>

        {/* ÁREA DE MENSAJES */}
        <section
          className={`flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-none px-4 md:px-12 py-4 md:py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative ${currentColors.textArea}`}
          ref={chat.scrollAreaRef}
          onScroll={chat.handleChatScroll}
        >
          <div className="flex flex-col space-y-6 w-full max-w-3xl mx-auto flex-shrink-0">
            {chat.currentMessages.length === 0 && (
              <div className="flex gap-4 items-start mb-4">
                <img
                  src={logoShield}
                  className="w-8 h-10 md:w-10 md:h-12 object-contain"
                  alt="."
                />
                <div className="space-y-4 mt-1">
                  <p className={`text-lg md:text-xl font-light ${currentColors.mainTitle}`}>
                    Conectado a la red de <strong>{chat.moduloActivo}</strong>.
                  </p>
                  <p
                    className={`${currentColors.greetingP} leading-relaxed text-[15px] md:text-[16px]`}
                  >
                    ¿En qué asunto legal específico puedo ayudarle?
                  </p>
                </div>
              </div>
            )}

            {chat.currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start mt-2'
                }`}
              >
                {msg.sender === 'user' && (
                  <UserMessageBubble
                    msg={msg}
                    theme={theme}
                    currentColors={currentColors}
                    onEdit={chat.handleEditUserMessage}
                  />
                )}
                {msg.sender === 'loading' && (
                  <div className="text-[#c5a059] text-[15px] font-medium animate-pulse ml-2">
                    {msg.text}
                  </div>
                )}
                {msg.sender === 'bot' && (
                  <div className="flex flex-col gap-1 max-w-[90%]">
                    <div
                      className={`${currentColors.botBubble} p-3 md:p-4 px-4 md:px-5 rounded-3xl rounded-tl-none border-l-4 shadow-md overflow-hidden`}
                    >
                      <div
                        className={`leading-normal md:leading-relaxed bot-message-html-content max-w-none ${
                          theme === 'dark' ? 'text-gray-200' : 'text-[#2a303c]'
                        } [&_*]:font-sans [&_*]:text-current [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h4]:text-[16px] [&_h4]:font-bold [&_h4]:mt-4 [&_h4]:mb-2 [&_p]:text-[15px] md:[&_p]:text-[16px] [&_p]:mb-2 md:[&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul_ul]:list-[circle] [&_ul_ul]:mt-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:mt-2 [&_li]:text-[15px] md:[&_li]:text-[16px] [&_li]:mb-1 [&_strong]:font-bold [&_li:has(h4)]:list-none [&_li_h4]:-ml-4 [&_li_h4]:block`}
                        dangerouslySetInnerHTML={{
                          __html: msg.text.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong>$1</strong>'
                          ),
                        }}
                      />
                    </div>
                    <BotMessageActions
                      text={msg.text}
                      theme={theme}
                      accessMode={accessMode}
                      showToast={chat.showToast}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 min-h-[1px]"></div>
          <div ref={chat.messagesEndRef} />

          <AnimatePresence>
            {chat.showScrollBottom && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={chat.scrollToBottomChat}
                className={`fixed bottom-28 md:bottom-32 right-6 md:right-12 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentColors.scrollBtn}`}
              >
                <ArrowDown size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </section>

        {/* TOAST */}
        {chat.toastMsg && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-[#0a1526] text-[#c5a059] border border-[#c5a059]/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center gap-3 text-[14px] font-medium animate-in fade-in zoom-in-95 duration-300 text-center whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis">
            <span className="truncate">{chat.toastMsg}</span>
          </div>
        )}

        {/* FOOTER / INPUT */}
        <footer className="flex-shrink-0 w-full px-4 py-2 sm:p-4 pb-4 md:pb-8 bg-transparent relative z-20">
          <div className="max-w-3xl mx-auto relative group">
            {chat.selectedFile && (
              <div
                className={`absolute -top-10 left-4 ${
                  theme === 'dark'
                    ? 'bg-[#1e2a40] border-gray-700'
                    : 'bg-[#eee7d5] border-[#c5a059]/30'
                } text-[#c5a059] text-xs py-1.5 px-3 rounded-t-xl border border-b-0 flex items-center gap-2 shadow-lg`}
              >
                <FileText size={14} />
                <span className="truncate max-w-[200px] font-medium">
                  {chat.selectedFile.name}
                </span>
                <button
                  onClick={() => {
                    chat.setSelectedFile(null);
                    if (chat.fileInputRef.current) chat.fileInputRef.current.value = '';
                  }}
                  className="hover:text-red-400 ml-1 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div
              className={`${currentColors.footerBG} ${
                chat.selectedFile ? 'rounded-tl-none' : ''
              } rounded-[24px] md:rounded-3xl border border-gray-700 p-1.5 flex flex-row items-end gap-1 focus-within:border-[#c5a059] transition-all shadow-2xl duration-300 min-h-[50px]`}
            >
              <div className="flex-shrink-0 mb-0.5">
                <input
                  type="file"
                  ref={chat.fileInputRef}
                  className="hidden"
                  onChange={(e) => chat.setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xlsx,.jpg,.jpeg,.png,.webp,.mp3,.wav,.ogg,.m4a,.aac,.mp4,.mov,.avi,.mkv"
                />
                <button
                  onClick={() => {
                    if (accessMode === 'guest') {
                      chat.showToast('Verifique su cuenta para adjuntar archivos.');
                    } else {
                      chat.fileInputRef.current?.click();
                    }
                  }}
                  className={`p-2.5 rounded-full transition-all ${
                    chat.selectedFile
                      ? 'bg-[#c5a059]/20 text-[#c5a059]'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-[#c5a059] hover:bg-[#c5a059]/10'
                      : 'text-gray-500 hover:text-[#c5a059] hover:bg-gray-200'
                  }`}
                  title="Adjuntar Archivo, Audio o Video"
                >
                  <Paperclip size={20} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center min-h-[44px]">
                {chat.isRecording ? (
                  <div className="flex items-center gap-3 text-red-500 animate-pulse px-2 h-full">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-[15px] font-medium tracking-wide">
                      Escuchando...
                    </span>
                  </div>
                ) : (
                  <textarea
                    id="userInput"
                    value={chat.inputText}
                    onChange={(e) => {
                      chat.setInputText(e.target.value);
                      e.target.style.height = '24px';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        chat.handleSend();
                      }
                    }}
                    placeholder={
                      accessMode === 'client'
                        ? 'Escriba o adjunte archivos...'
                        : 'Escriba o adjunte (Demo)...'
                    }
                    rows={1}
                    className={`w-full bg-transparent outline-none text-[16px] resize-none max-h-[120px] md:max-h-[220px] py-3 px-1 [&::-webkit-scrollbar]:hidden ${currentColors.textArea} ${
                      accessMode === 'guest' ? 'pl-2' : ''
                    }`}
                    style={{ minHeight: '44px', lineHeight: '20px' }}
                  />
                )}
              </div>

              <div className="flex-shrink-0 mb-0.5 ml-1">
                {chat.isRecording ? (
                  <button
                    onClick={chat.stopRecording}
                    className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    title="Detener transcripción"
                  >
                    <Square size={20} className="fill-current" />
                  </button>
                ) : chat.inputText.trim() || chat.selectedFile ? (
                  <button
                    onClick={chat.handleSend}
                    className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`}
                    title="Enviar mensaje"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={chat.startRecording}
                    className={`${currentColors.sendBtn} p-2.5 rounded-full transition-all active:scale-95`}
                    title="Grabar mensaje de voz"
                  >
                    <Mic size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
