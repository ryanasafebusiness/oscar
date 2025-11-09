import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ParticipantResult {
  id: string;
  name: string;
  votes: number;
  percentage: number;
}

interface CategoryResult {
  id: string;
  category: string;
  participants: ParticipantResult[];
  totalVotes: number;
}

const VotingResults = () => {
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();

    if (!supabase) return;

    // Set up realtime subscription for vote updates
    const channel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchResults = async () => {
    if (!supabase) {
      console.error("Supabase não está inicializado");
      toast.error("Erro: Backend não está disponível");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log("Iniciando busca de resultados...");

      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name")
        .order("display_order", { ascending: true });

      if (categoriesError) {
        console.error("Erro ao buscar categorias:", categoriesError);
        throw categoriesError;
      }

      console.log("Categorias encontradas:", categories?.length || 0, categories);

      // Fetch participants
      const { data: participants, error: participantsError } = await supabase
        .from("participants")
        .select("id, category_id, name");

      if (participantsError) {
        console.error("Erro ao buscar participantes:", participantsError);
        throw participantsError;
      }

      console.log("Participantes encontrados:", participants?.length || 0, participants);

      // Fetch votes
      const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("category_id, participant_id");

      if (votesError) {
        console.error("Erro ao buscar votos:", votesError);
        console.error("Código do erro:", votesError.code);
        console.error("Mensagem do erro:", votesError.message);
        
        // Se for erro de permissão, mostrar mensagem específica mas continuar com os dados disponíveis
        if (votesError.message?.includes('permission denied') || votesError.message?.includes('row-level security') || votesError.code === '42501') {
          toast.error("Erro de permissão ao ler votos", {
            description: "As políticas RLS não permitem ler votos. Execute o script fix_votes_rls.sql no Supabase para adicionar a política de SELECT.",
            duration: 10000,
          });
          // Continuar processamento com array vazio de votos
          const resultsData = (categories || []).map((category) => {
            const categoryParticipants = (participants || []).filter(
              (p) => p.category_id === category.id
            );
            
            const participantResults: ParticipantResult[] = categoryParticipants
              .map((participant) => ({
                id: participant.id,
                name: participant.name,
                votes: 0,
                percentage: 0,
              }))
              .sort((a, b) => b.votes - a.votes);

            return {
              id: category.id,
              category: category.name,
              participants: participantResults,
              totalVotes: 0,
            };
          });

          setResults(resultsData);
          setLoading(false);
          return;
        }
        throw votesError;
      }

      console.log("Votos encontrados:", votes?.length || 0, votes);

      // Calculate results
      const resultsData: CategoryResult[] = (categories || []).map((category) => {
        const categoryParticipants = (participants || []).filter(
          (p) => p.category_id === category.id
        );
        
        const categoryVotes = (votes || []).filter((v) => v.category_id === category.id);
        const totalVotes = categoryVotes.length;

        const participantResults: ParticipantResult[] = categoryParticipants
          .map((participant) => {
            const participantVotes = categoryVotes.filter(
              (v) => v.participant_id === participant.id
            ).length;
            
            return {
              id: participant.id,
              name: participant.name,
              votes: participantVotes,
              percentage: totalVotes > 0 ? Math.round((participantVotes / totalVotes) * 100) : 0,
            };
          })
          .sort((a, b) => b.votes - a.votes);

        return {
          id: category.id,
          category: category.name,
          participants: participantResults,
          totalVotes,
        };
      });

      console.log("Resultados calculados:", resultsData);
      setResults(resultsData);
    } catch (error: any) {
      console.error("Error fetching results:", error);
      
      let errorMessage = "Erro ao carregar resultados da votação.";
      
      if (error?.message) {
        if (error.message.includes('permission denied') || error.message.includes('row-level security') || error.code === '42501') {
          errorMessage = "Erro de permissão: As políticas RLS não estão configuradas corretamente. Execute o script fix_votes_rls.sql no Supabase para adicionar a política de SELECT na tabela votes.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error("Erro ao carregar resultados", {
        description: errorMessage,
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gold">Resultados em Tempo Real</h2>
        <p className="text-muted-foreground mt-1">
          Acompanhe a contagem de votos por categoria
        </p>
      </div>

      <div className="space-y-6">
        {results.map((category) => (
          <Card key={category.id} className="shadow-lg">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl text-gold">{category.category}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Total: {category.totalVotes} voto(s)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {category.participants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum participante cadastrado nesta categoria
                </p>
              ) : category.totalVotes === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum voto registrado ainda
                </p>
              ) : (
                category.participants.map((participant, pIdx) => {
                  const isLeading = pIdx === 0 && participant.votes > 0;

                  return (
                    <div key={participant.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isLeading && <Trophy className="w-5 h-5 text-gold" />}
                          <span className="font-semibold text-foreground">
                            {participant.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {participant.votes} voto(s)
                          </span>
                          <span className="text-lg font-bold text-gold min-w-[4rem] text-right">
                            {participant.percentage}%
                          </span>
                        </div>
                      </div>

                      <Progress value={participant.percentage} className="h-3" />

                      {isLeading && (
                        <div className="flex items-center gap-2 text-sm text-gold">
                          <TrendingUp className="w-4 h-4" />
                          <span>Liderando a categoria</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma categoria cadastrada ainda. Configure as categorias primeiro.
          </p>
        </Card>
      )}
    </div>
  );
};

export default VotingResults;
