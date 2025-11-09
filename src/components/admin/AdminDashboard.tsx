import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, LayoutDashboard, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CategoriesManager from "./CategoriesManager";
import VotingResults from "./VotingResults";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    categories: 0,
    participants: 0,
    votes: 0,
  });

  useEffect(() => {
    fetchStats();

    // Evita crash quando o backend ainda não inicializou
    if (!supabase) {
      console.warn("Backend não pronto - ignorando inscrições de realtime por enquanto");
      return;
    }

    // Set up realtime subscriptions
    const votesChannel = supabase
      .channel("stats-votes")
      .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, fetchStats)
      .subscribe();

    const categoriesChannel = supabase
      .channel("stats-categories")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, fetchStats)
      .subscribe();

    const participantsChannel = supabase
      .channel("stats-participants")
      .on("postgres_changes", { event: "*", schema: "public", table: "participants" }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, []);

  const fetchStats = async () => {
    if (!supabase) {
      console.error("Supabase não está inicializado");
      return;
    }
    
    try {
      console.log("Buscando estatísticas...");
      
      const [categoriesRes, participantsRes, votesRes] = await Promise.all([
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("participants").select("id", { count: "exact", head: true }),
        supabase.from("votes").select("id", { count: "exact", head: true }),
      ]);

      console.log("Resultado categorias:", categoriesRes);
      console.log("Resultado participantes:", participantsRes);
      console.log("Resultado votos:", votesRes);

      // Verificar erros em categorias
      if (categoriesRes.error) {
        console.error("Error fetching categories count:", categoriesRes.error);
        console.error("Código:", categoriesRes.error.code);
        console.error("Mensagem:", categoriesRes.error.message);
      }

      // Verificar erros em participantes
      if (participantsRes.error) {
        console.error("Error fetching participants count:", participantsRes.error);
        console.error("Código:", participantsRes.error.code);
        console.error("Mensagem:", participantsRes.error.message);
      }

      // Se houver erro ao contar votos, pode ser problema de RLS
      if (votesRes.error) {
        console.error("Error fetching votes count:", votesRes.error);
        console.error("Código:", votesRes.error.code);
        console.error("Mensagem:", votesRes.error.message);
        // Se for erro de permissão, não atualizar o contador
        if (votesRes.error.message?.includes('permission denied') || votesRes.error.code === '42501' || votesRes.error.message?.includes('row-level security')) {
          console.warn("Permissão negada para contar votos. Verifique se a política de SELECT está configurada. Execute fix_votes_rls.sql");
        }
      }

      setStats({
        categories: categoriesRes.error ? 0 : (categoriesRes.count || 0),
        participants: participantsRes.error ? 0 : (participantsRes.count || 0),
        votes: votesRes.error ? 0 : (votesRes.count || 0),
      });

      console.log("Estatísticas atualizadas:", {
        categories: categoriesRes.error ? 0 : (categoriesRes.count || 0),
        participants: participantsRes.error ? 0 : (participantsRes.count || 0),
        votes: votesRes.error ? 0 : (votesRes.count || 0),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    toast.info("Sessão encerrada");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Painel Administrativo
              </h1>
              <p className="text-xs text-muted-foreground">
                OSCAR ADOLS 2025
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-gold/30 hover:bg-gold/10 hover:border-gold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-secondary/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total de Categorias
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.categories}</p>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Participantes
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.participants}</p>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total de Votos
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.votes}</p>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border text-center space-y-4">
              <h2 className="text-2xl font-bold text-gold">
                Bem-vindo ao Painel Administrativo
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Gerencie categorias, participantes e acompanhe os resultados da votação em tempo real.
                Use as abas acima para navegar entre as diferentes seções.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="results">
            <VotingResults />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
