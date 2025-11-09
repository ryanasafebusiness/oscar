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

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Oscar Trophy with float animation */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
            <img src={oscarTrophy} alt="Oscar Trophy" className="relative w-48 md:w-64 h-auto drop-shadow-2xl" />
          </div>

          {/* Title with shimmer effect */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-gold">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="text-sm md:text-base uppercase tracking-widest font-semibold">
                Gala Ibae 2025
              </span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold via-gold-light to-champagne animate-shimmer bg-[length:1000px_100%]">OSCAR ADOLS 2025</h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Celebrando a excelência e o talento em nossa comunidade. 
              Vote nos seus favoritos e faça parte desta noite especial.
            </p>
          </div>

          {/* Event Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="text-lg font-bold text-foreground">29 NOV | 18H</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-lg p-4 text-center">
              <MapPin className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Evento</p>
              <p className="text-lg font-bold text-foreground">Jantar de Gala</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-lg p-4 text-center">
              <Ticket className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Ingresso</p>
              <p className="text-lg font-bold text-gold">R$ 40,00</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" onClick={() => navigate("/vote")} className="group relative overflow-hidden bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:shadow-[var(--shadow-gold)] transition-all duration-500 text-lg px-8 py-6 rounded-xl font-semibold">
              <span className="relative z-10 flex items-center gap-2">
                <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Votar Agora
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-champagne opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>

            <Button size="lg" variant="outline" onClick={() => navigate("/admin")} className="border-2 border-gold/30 text-foreground hover:bg-gold/10 hover:border-gold transition-all duration-300 text-lg px-8 py-6 rounded-xl font-semibold backdrop-blur-sm">
              Área Administrativa
            </Button>
          </div>

          {/* Decorative line */}
          <div className="pt-12 w-full max-w-2xl">
            <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>

          {/* Social Media Section */}
          <div className="pt-8 space-y-4">
            <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">
              NOSSAS REDES SOCIAIS
            </h3>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open("https://www.instagram.com/adolsaliancados_sb/", "_blank", "noopener,noreferrer")}
              className="group border-2 border-gold/30 text-foreground hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:border-pink-500 hover:text-white transition-all duration-300 text-lg px-8 py-6 rounded-xl font-semibold backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>@adolsaliancados_sb</span>
              </span>
            </Button>
          </div>

          {/* Additional info */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p>Um evento que celebra o melhor da nossa mídia e ministério</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/20 to-transparent" />
    </div>;
};
export default Index;