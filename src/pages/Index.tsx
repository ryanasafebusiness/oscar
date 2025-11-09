import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, Star, Calendar, MapPin, Ticket, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import oscarTrophy from "@/assets/oscar-trophy.png";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--gold)/0.15)_0%,transparent_70%)]" />
      
      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => <Star key={i} className="absolute text-gold/20 animate-pulse" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        width: `${Math.random() * 10 + 10}px`,
        height: `${Math.random() * 10 + 10}px`
      }} />)}
      </div>

      <div className="relative z-10 container mx-auto px-3 md:px-4 py-8 md:py-12 lg:py-20">
        <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
          {/* Oscar Trophy with float animation */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
            <img src={oscarTrophy} alt="Oscar Trophy" className="relative w-20 md:w-32 lg:w-40 h-auto drop-shadow-2xl max-w-[160px] md:max-w-[256px] lg:max-w-[320px]" />
          </div>

          {/* Title with shimmer effect */}
          <div className="space-y-3 md:space-y-4 px-2">
            <div className="flex items-center justify-center gap-2 text-gold">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
              <span className="text-xs md:text-sm lg:text-base uppercase tracking-widest font-semibold">
                OSCAR ADOLS 2025
              </span>
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold via-gold-light to-champagne animate-shimmer bg-[length:1000px_100%]">OSCAR ADOLS 2025</h1>
            
            <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Celebrando a excelência e o talento em nossa comunidade. 
              Vote nos seus favoritos e faça parte desta noite especial.
            </p>
          </div>

          {/* Event Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-6 md:mb-8 w-full px-2">
            <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-lg p-3 md:p-4 text-center">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-gold mx-auto mb-2" />
              <p className="text-xs md:text-sm text-muted-foreground">Data</p>
              <p className="text-base md:text-lg font-bold text-foreground">29 NOV | 18H</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-lg p-3 md:p-4 text-center">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gold mx-auto mb-2" />
              <p className="text-xs md:text-sm text-muted-foreground">Evento</p>
              <p className="text-base md:text-lg font-bold text-foreground">Jantar de Gala</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-lg p-3 md:p-4 text-center">
              <Ticket className="w-6 h-6 md:w-8 md:h-8 text-gold mx-auto mb-2" />
              <p className="text-xs md:text-sm text-muted-foreground">Ingresso</p>
              <p className="text-base md:text-lg font-bold text-gold">R$ 40,00</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 w-full max-w-md mx-auto px-2">
            <Button size="lg" onClick={() => navigate("/vote")} className="group relative overflow-hidden bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:shadow-[var(--shadow-gold)] transition-all duration-500 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl font-semibold w-full sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                Votar Agora
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-champagne opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>

            <Button size="lg" variant="outline" onClick={() => navigate("/admin")} className="border-2 border-gold/30 text-foreground hover:bg-gold/10 hover:border-gold transition-all duration-300 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl font-semibold backdrop-blur-sm w-full sm:w-auto">
              Área Administrativa
            </Button>
          </div>

          {/* Decorative line */}
          <div className="pt-8 md:pt-12 w-full max-w-2xl px-2">
            <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>

          {/* Social Media Section */}
          <div className="pt-6 md:pt-8 space-y-3 md:space-y-4 px-2">
            <h3 className="text-base md:text-lg font-semibold text-foreground uppercase tracking-wider">
              NOSSAS REDES SOCIAIS
            </h3>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open("https://www.instagram.com/adolsaliancados_sb/", "_blank", "noopener,noreferrer")}
              className="group border-2 border-gold/30 text-foreground hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:border-pink-500 hover:text-white transition-all duration-300 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl font-semibold backdrop-blur-sm w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2 md:gap-3">
                <Instagram className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm md:text-base">@adolsaliancados_sb</span>
              </span>
            </Button>
          </div>

          {/* Local do Evento Section */}
          <div className="pt-4 md:pt-6 space-y-3 md:space-y-4 px-2">
            <h3 className="text-base md:text-lg font-semibold text-foreground uppercase tracking-wider">
              LOCAL DO EVENTO
            </h3>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open("https://www.google.com/maps/dir//IGREJA+BATISTA+ALIAN%C3%87A+ETERNA+-+SANTA+LUZIA+-+R.+Yara,+135+-+S%C3%A3o+Benedito,+Santa+Luzia+-+MG,+33125-570/@-19.7854722,-43.9408568,17z/data=!4m17!1m7!3m6!1s0xa68589a36277a7:0xb83ee4d5c45bdf7b!2sIGREJA+BATISTA+ALIAN%C3%87A+ETERNA+-+SANTA+LUZIA!8m2!3d-19.7855952!4d-43.9406685!16s%2Fg%2F11c40wh85f!4m8!1m0!1m5!1m1!1s0xa68589a36277a7:0xb83ee4d5c45bdf7b!2m2!1d-43.9406685!2d-19.7855952!3e3?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D", "_blank", "noopener,noreferrer")}
              className="group border-2 border-gold/30 text-foreground hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:border-blue-500 hover:text-white transition-all duration-300 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl font-semibold backdrop-blur-sm w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2 md:gap-3">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm md:text-base">Ver no Google Maps</span>
              </span>
            </Button>
          </div>

          {/* Additional info */}
          <div className="pt-6 md:pt-8 text-xs md:text-sm text-muted-foreground px-2">
            <p>Um evento que celebra o melhor da nossa mídia e ministério</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/20 to-transparent" />
    </div>;
};
export default Index;