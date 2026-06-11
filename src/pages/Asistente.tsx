import { useState } from 'react';
import LoginPage, { type AccessMode } from '@/components/asistente/LoginPage';
import AsistenteVerificado from './AsistenteVerificado';
import AsistenteDemo from './AsistenteDemo';

export default function AsistentePage() {
  const [accessMode, setAccessMode] = useState<AccessMode>('none');
  const [username, setUsername] = useState('');

  const handleLoginSuccess = (mode: AccessMode, user?: string) => {
    setAccessMode(mode);
    setUsername(user || '');
  };

  const handleLogout = () => {
    if (window.confirm("¿Seguro que desea cerrar sesión de forma segura?")) {
      setAccessMode('none');
      setUsername('');
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  if (accessMode === 'none') {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  if (accessMode === 'client') {
    return <AsistenteVerificado username={username} onLogout={handleLogout} />;
  }

  return <AsistenteDemo onLogout={handleLogout} />;
}
