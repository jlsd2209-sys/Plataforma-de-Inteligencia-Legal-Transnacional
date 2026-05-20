import logoShield from '@/assets/logo-shield.png';

export const DividerBanner = () => {
  return (
    <div className="relative">
      {/* Top gold line */}
      <div className="h-[3px] bg-gradient-to-r from-gold/60 via-gold-bright to-gold/60" />
      
      {/* Main banner */}
      <div className="relative bg-cream py-3 px-4 md:px-8">
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-4 md:gap-6 max-w-5xl mx-auto">
          {/* Logo */}
          <img 
            src={logoShield} 
            alt="LAP Global Logo" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          
          {/* Text */}
          <div className="flex items-baseline gap-3 md:gap-5">
            <span className="font-serif font-bold text-navy-dark text-lg md:text-2xl tracking-wider">
              LAP G<span className="text-base md:text-xl">LOBAL</span>
            </span>
            <span className="text-gold-bright font-semibold text-xs md:text-sm tracking-[0.2em] uppercase">
              Plataforma de Inteligencia Legal Transnacional
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom gold line */}
      <div className="h-[3px] bg-gradient-to-r from-gold/60 via-gold-bright to-gold/60" />
    </div>
  );
};
