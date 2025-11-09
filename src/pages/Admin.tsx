import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, LogIn, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminDashboard from "@/components/admin/AdminDashboard";

const ADMIN_PASSWORD = "#midiaibae2025";

const Admin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Acesso autorizado!");
    } else {
      toast.error("Senha incorreta", {
        description: "Por favor, verifique a senha e tente novamente.",
      });
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--gold)/0.1)_0%,transparent_70%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-foreground hover:text-gold hover:bg-gold/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="shadow-[var(--shadow-elegant)]">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Área Administrativa
            </CardTitle>
            <p className="text-muted-foreground">
              Acesso restrito para administradores
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Senha de Acesso
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha administrativa"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-border focus:border-gold transition-colors"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:shadow-[var(--shadow-gold)] transition-all duration-500"
                size="lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Somente administradores autorizados podem acessar esta área.
                <br />
                Para suporte, entre em contato com a equipe de mídia.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
