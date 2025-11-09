import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Check, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Participant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface Category {
  id: string;
  name: string;
  participants: Participant[];
}

const Vote = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    if (!supabase) {
      console.warn("Supabase não inicializado ainda");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (categoriesError) throw categoriesError;

      // Fetch participants for all categories
      const { data: participantsData, error: participantsError } = await supabase
        .from("participants")
        .select("*")
        .order("created_at", { ascending: true });

      if (participantsError) throw participantsError;

      // Group participants by category
      const categoriesWithParticipants = (categoriesData || []).map((category) => ({
        ...category,
        participants: (participantsData || []).filter((p) => p.category_id === category.id),
      }));

      setCategories(categoriesWithParticipants as unknown as Category[]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados da votação");
    } finally {
      setLoading(false);
    }
  };

  const getVoterIdentifier = () => {
    // Generate unique identifier based on device
    let identifier = localStorage.getItem("voter_id");
    if (!identifier) {
      identifier = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("voter_id", identifier);
    }
    return identifier;
  };

  const handleVote = (categoryId: string, participantId: string) => {
    if (submitted) return;

    setVotes((prev) => ({
      ...prev,
      [categoryId]: participantId,
    }));

    toast.success("Voto registrado!", {
      description: "Você pode alterar seu voto antes de finalizar.",
    });
  };

  const handleSubmit = async () => {
    const totalVotes = Object.keys(votes).length;

    if (totalVotes === 0) {
      toast.error("Por favor, vote em pelo menos uma categoria.");
      return;
    }

    if (!supabase) {
      toast.error("Backend indisponível. Atualize a página e tente novamente.");
      return;
    }

    try {
      setSubmitting(true);
      const voterIdentifier = getVoterIdentifier();

      // Insert votes into database
      // For each vote, delete existing vote (if any) and insert new one
      const votesToInsert = Object.entries(votes).map(([categoryId, participantId]) => ({
        category_id: categoryId,
        participant_id: participantId,
        voter_identifier: voterIdentifier,
      }));

      // Process votes one by one to handle conflicts properly
      for (const vote of votesToInsert) {
        // First, delete any existing vote for this category and voter
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("category_id", vote.category_id)
          .eq("voter_identifier", vote.voter_identifier);

        // If delete fails due to RLS, that's OK - vote might not exist
        if (deleteError && !deleteError.message.includes('permission denied')) {
          console.warn("Error deleting existing vote:", deleteError);
        }

        // Then insert the new vote
        const { error: insertError } = await supabase
          .from("votes")
          .insert([vote]);

        if (insertError) {
          // If insert fails, try to update instead
          const { error: updateError } = await supabase
            .from("votes")
            .update({ participant_id: vote.participant_id })
            .eq("category_id", vote.category_id)
            .eq("voter_identifier", vote.voter_identifier);

          if (updateError) {
            console.error("Error inserting/updating vote:", updateError);
            throw new Error(`Erro ao registrar voto: ${updateError.message}`);
          }
        }
      }

      setSubmitted(true);
      toast.success("Votação concluída!", {
        description: `Seus ${totalVotes} votos foram registrados com sucesso.`,
      });
    } catch (error: any) {
      console.error("Error submitting votes:", error);
      
      let errorMessage = "Tente novamente mais tarde.";
      
      if (error?.message) {
        if (error.message.includes('row-level security') || error.message.includes('RLS')) {
          errorMessage = "Erro de permissão: As políticas RLS não estão configuradas corretamente. Execute o script fix_votes_rls.sql no Supabase.";
        } else if (error.message.includes('permission denied')) {
          errorMessage = "Permissão negada: Verifique se as políticas RLS da tabela votes estão configuradas corretamente.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error("Erro ao registrar votos", {
        description: errorMessage,
        duration: 10000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!supabase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 text-gold/50 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Conectando ao backend…</h2>
          <p className="text-muted-foreground">Atualize a página ou aguarde alguns segundos.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
            Recarregar
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-gold mx-auto" />
          <p className="text-muted-foreground">Carregando votação...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 text-gold/50 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Nenhuma categoria disponível</h2>
          <p className="text-muted-foreground">A votação ainda não foi configurada.</p>
          <Button onClick={() => navigate("/")} variant="outline" className="mt-4">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 md:py-12">
      <div className="container mx-auto px-3 md:px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6 md:mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-3 md:mb-6 text-foreground hover:text-gold hover:bg-gold/10 p-2 md:p-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm md:text-base">Voltar</span>
          </Button>

          <div className="text-center space-y-2 md:space-y-4">
            <div className="flex items-center justify-center gap-2 text-gold">
              <Trophy className="w-4 h-4 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm uppercase tracking-widest font-semibold">
                OSCAR ADOLS 2025 - Votação
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground px-2">
              Vote nos Seus Favoritos
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              Selecione um participante em cada categoria. Seus votos são anônimos e serão contabilizados em tempo real.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8 md:space-y-12">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3 md:space-y-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gold border-b border-gold/30 pb-2 md:pb-3 px-2">
                {category.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {category.participants.map((participant) => {
                  const isSelected = votes[category.id] === participant.id;

                  return (
                    <Card
                      key={participant.id}
                      className={`group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-gold)] ${
                        isSelected
                          ? "ring-2 ring-gold shadow-[var(--shadow-gold)]"
                          : "hover:ring-1 hover:ring-gold/50"
                      } ${submitted ? "cursor-not-allowed opacity-70" : ""}`}
                      onClick={() => !submitted && handleVote(category.id, participant.id)}
                    >
                      <CardContent className="p-0 relative overflow-hidden">
                        {/* Image */}
                        <div className="relative aspect-[16/10] sm:aspect-[4/3] md:aspect-square overflow-hidden">
                          <img
                            src={
                              participant.image_url ||
                              "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
                            }
                            alt={participant.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          {/* Overlay on hover or selected */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent transition-opacity duration-300 ${
                              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          />

                          {/* Check icon */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-gold text-primary-foreground rounded-full p-1.5 md:p-2 animate-in zoom-in-50">
                              <Check className="w-4 h-4 md:w-6 md:h-6" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 md:p-6 space-y-1 md:space-y-2">
                          <h3 className="text-base md:text-xl font-bold text-foreground group-hover:text-gold transition-colors">
                            {participant.name}
                          </h3>
                          {participant.description && (
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                              {participant.description}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="flex justify-center pt-6 md:pt-12 px-4">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={Object.keys(votes).length === 0 || submitting}
              className="w-full sm:w-auto bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:shadow-[var(--shadow-gold)] transition-all duration-500 text-base md:text-lg px-8 md:px-12 py-4 md:py-6 rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Finalizar Votação
                </>
              )}
            </Button>
          </div>
        )}

        {/* Thank you message */}
        {submitted && (
          <div className="text-center py-6 md:py-12 space-y-3 md:space-y-4 animate-in fade-in-50 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/20 text-gold mb-2 md:mb-4">
              <Trophy className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gold">Obrigado por Votar!</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Sua participação é muito importante para nós. Os resultados serão anunciados em breve.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="mt-4 md:mt-6 border-gold/30 text-foreground hover:bg-gold/10 hover:border-gold text-sm md:text-base"
            >
              Voltar ao Início
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vote;
