import { Linkedin, Twitter, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import logoShield from '@/assets/logo.png.png';

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: MessageCircle, href: 'https://wa.me/5491126770449', label: 'WhatsApp' }
];

const navLinks = [
  { label: 'Inicio', href: '#home' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' }
];

const contactInfo = [
  { icon: Mail, text: 'unidaddeia@gmail.com', href: 'mailto:unidaddeia@gmail.com' },
  { icon: Phone, text: '+58 424-4958585', href: 'tel:+54 9 11 2677-0449' },
  { icon: MapPin, text: 'Caracas, Venezuela', href: null },
  { icon: MapPin, text: 'Buenos Aires, Argentina', href: null }
];

export const Footer = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-charcoal-dark py-8 border-t border-gold/20 pt-[15px] pb-[15px]">
      <div className="container pb-0 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          
          <div className="flex flex-col items-start md:col-span-2">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-3 font-serif text-xl font-bold mb-1 group"
            >
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img src={logoShield} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
              </div>
              <div className="relative whitespace-normal lg:whitespace-nowrap">
                <span className="absolute inset-0 gradient-text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Plataforma Legal Transnacional
                </span>
                <span className="relative text-white group-hover:opacity-0 transition-opacity duration-300">
                  Plataforma Legal Transnacional
                </span>
              </div>
            </a>
            
            <p className="text-cream-light/80 leading-relaxed mb-6 ml-0 md:ml-[60px] max-w-[350px]">
              Ingeniería Jurídica de Vanguardia. Automatización avanzada combinada con precisión algorítmica y estricto criterio legal.              
            </p>
            
            <div className="flex gap-4 ml-0 md:ml-[60px]">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-navy-dark transition-all hover:-translate-y-1"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* AJUSTE: Quitamos "md:mx-auto" de este div para que la columna se mueva hacia la izquierda */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-serif mb-6 relative group inline-block cursor-default">
              <span className="absolute inset-0 gradient-text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Navegación
              </span>
              <span className="relative text-white group-hover:opacity-0 transition-opacity duration-300 whitespace-nowrap">
                Navegación
              </span>
            </h3>
            <ul className="flex flex-col gap-3 items-start">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="relative group inline-block hover:translate-x-1 transition-transform"
                  >
                    <span className="absolute inset-0 gradient-text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {link.label}
                    </span>
                    <span className="relative text-cream-light/80 group-hover:opacity-0 transition-opacity duration-300 whitespace-nowrap">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start md:ml-auto">
            <h3 className="text-lg font-serif mb-6 relative group inline-block cursor-default">
              <span className="absolute inset-0 gradient-text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Contacto
              </span>
              <span className="relative text-white group-hover:opacity-0 transition-opacity duration-300 whitespace-nowrap">
                Contacto
              </span>
            </h3>
            <ul className="flex flex-col gap-4 items-start">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-cream-light/80">
                  <info.icon className="text-gold mt-0.5 flex-shrink-0" size={18} />
                  {info.href ? (
                    <a 
                      href={info.href} 
                      className="relative group inline-block text-left"
                    >
                      <span className="absolute inset-0 gradient-text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {info.text}
                      </span>
                      <span className="relative text-cream-light/80 group-hover:opacity-0 transition-opacity duration-300 whitespace-nowrap">
                        {info.text}
                      </span>
                    </a>
                  ) : (
                    <span className="text-left">{info.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-gold/10">
          <p className="text-cream-light/60 text-sm">
            © 2026 Plataforma Legal Transnacional. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
