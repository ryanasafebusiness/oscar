import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Users, Loader2, Image as ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Participant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  participants?: Participant[];
}

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    description: "",
    image_url: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (categoriesError) throw categoriesError;

      const { data: participantsData, error: participantsError } = await supabase
        .from("participants")
        .select("*");

      if (participantsError) throw participantsError;

      const categoriesWithParticipants = categoriesData.map(category => ({
        ...category,
        participants: participantsData.filter(p => p.category_id === category.id),
      }));

      setCategories(categoriesWithParticipants);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    if (!supabase) {
      toast.info("Conectando ao backend... tente novamente em alguns segundos.");
      return;
    }

    try {
      const { data, error } = await supabase.from("categories").insert([
        {
          name: newCategory.name,
          description: newCategory.description || null,
          display_order: categories.length,
        },
      ]).select();

      if (error) {
        console.error("Supabase error:", error);
        if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy')) {
          toast.error("Erro de permissão: As políticas RLS não permitem esta operação. Verifique as políticas do banco de dados.", {
            description: error.message,
            duration: 10000,
          });
        } else {
          toast.error(`Erro ao adicionar categoria: ${error.message}`, {
            description: error.details || error.hint,
            duration: 10000,
          });
        }
        return;
      }

      toast.success("Categoria adicionada com sucesso!");
      setNewCategory({ name: "", description: "" });
      setShowAddForm(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Error adding category:", error);
      toast.error(`Erro ao adicionar categoria: ${error?.message || 'Erro desconhecido'}`, {
        duration: 10000,
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!supabase) {
      toast.info("Conectando ao backend... tente novamente em alguns segundos.");
      return;
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy')) {
          toast.error("Erro de permissão: As políticas RLS não permitem esta operação.", {
            description: error.message,
            duration: 10000,
          });
        } else {
          toast.error(`Erro ao remover categoria: ${error.message}`, {
            description: error.details || error.hint,
            duration: 10000,
          });
        }
        return;
      }

      toast.success("Categoria removida");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(`Erro ao remover categoria: ${error?.message || 'Erro desconhecido'}`, {
        duration: 10000,
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione um arquivo de imagem");
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setSelectedImageFile(file);
    
    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setNewParticipant({ ...newParticipant, image_url: "" });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!supabase) {
      toast.error("Erro: Supabase não está configurado");
      return null;
    }

    try {
      setUploadingImage(true);
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `participants/${fileName}`;

      // Fazer upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('participant-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('participant-images')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Não foi possível obter a URL pública da imagem");
      }

      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(`Erro ao fazer upload da imagem: ${error?.message || 'Erro desconhecido'}`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddParticipant = async () => {
    if (!selectedCategory || !newParticipant.name.trim()) {
      toast.error("Nome do participante é obrigatório");
      return;
    }

    if (!supabase) {
      toast.info("Conectando ao backend... tente novamente em alguns segundos.");
      return;
    }

    try {
      let imageUrl = newParticipant.image_url;

      // Se houver uma imagem selecionada, fazer upload
      if (selectedImageFile) {
        toast.info("Fazendo upload da imagem...");
        const uploadedUrl = await uploadImage(selectedImageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast.error("Falha ao fazer upload da imagem. Tentando continuar sem imagem...");
        }
      }

      const { data, error } = await supabase.from("participants").insert([
        {
          category_id: selectedCategory,
          name: newParticipant.name,
          description: newParticipant.description || null,
          image_url: imageUrl || null,
        },
      ]).select();

      if (error) {
        console.error("Supabase error:", error);
        if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy')) {
          toast.error("Erro de permissão: As políticas RLS não permitem esta operação. Verifique as políticas do banco de dados.", {
            description: error.message,
            duration: 10000,
          });
        } else {
          toast.error(`Erro ao adicionar participante: ${error.message}`, {
            description: error.details || error.hint,
            duration: 10000,
          });
        }
        return;
      }

      toast.success("Participante adicionado com sucesso!");
      setNewParticipant({ name: "", description: "", image_url: "" });
      setSelectedImageFile(null);
      setImagePreview(null);
      setShowParticipantForm(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error("Error adding participant:", error);
      toast.error(`Erro ao adicionar participante: ${error?.message || 'Erro desconhecido'}`, {
        duration: 10000,
      });
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (!supabase) {
      toast.info("Conectando ao backend... tente novamente em alguns segundos.");
      return;
    }

    try {
      const { error } = await supabase.from("participants").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy')) {
          toast.error("Erro de permissão: As políticas RLS não permitem esta operação.", {
            description: error.message,
            duration: 10000,
          });
        } else {
          toast.error(`Erro ao remover participante: ${error.message}`, {
            description: error.details || error.hint,
            duration: 10000,
          });
        }
        return;
      }

      toast.success("Participante removido");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting participant:", error);
      toast.error(`Erro ao remover participante: ${error?.message || 'Erro desconhecido'}`, {
        duration: 10000,
      });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gold">Gerenciar Categorias</h2>
          <p className="text-muted-foreground mt-1">
            Adicione, edite ou remova categorias e participantes
          </p>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:shadow-[var(--shadow-gold)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <Card className="shadow-lg border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold">Adicionar Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nome da Categoria</Label>
              <Input
                id="category-name"
                placeholder="Ex: Melhor Vídeo"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-desc">Descrição (opcional)</Label>
              <Textarea
                id="category-desc"
                placeholder="Descreva esta categoria..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="bg-secondary/50 min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddCategory}
                className="bg-gold hover:bg-gold-light text-primary-foreground"
              >
                Adicionar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategory({ name: "", description: "" });
                }}
                className="border-border"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{category.participants?.length || 0} participante(s)</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="border-destructive/30 hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Participants */}
              {category.participants && category.participants.length > 0 && (
                <div className="space-y-3 mb-4">
                  {category.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg"
                    >
                      {participant.image_url ? (
                        <img
                          src={participant.image_url}
                          alt={participant.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{participant.name}</h4>
                        {participant.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {participant.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Dialog
                open={showParticipantForm && selectedCategory === category.id}
                onOpenChange={(open) => {
                  setShowParticipantForm(open);
                  if (!open) setSelectedCategory(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gold/30 hover:bg-gold/10 hover:border-gold"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Participante
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-gold">Adicionar Participante</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="participant-name">Nome</Label>
                      <Input
                        id="participant-name"
                        placeholder="Nome do participante"
                        value={newParticipant.name}
                        onChange={(e) =>
                          setNewParticipant({ ...newParticipant, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participant-desc">Descrição</Label>
                      <Textarea
                        id="participant-desc"
                        placeholder="Descrição do participante"
                        value={newParticipant.description}
                        onChange={(e) =>
                          setNewParticipant({ ...newParticipant, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participant-image">Foto do Participante</Label>
                      
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gold/30"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gold/30 rounded-lg p-6 text-center">
                          <Input
                            id="participant-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <Label
                            htmlFor="participant-image"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Upload className="w-8 h-8 text-gold" />
                            <span className="text-sm text-muted-foreground">
                              Clique para fazer upload de uma imagem
                            </span>
                            <span className="text-xs text-muted-foreground">
                              PNG, JPG, GIF até 5MB
                            </span>
                          </Label>
                        </div>
                      )}

                      {/* Opção alternativa: URL (mantida para compatibilidade) */}
                      {!imagePreview && (
                        <div className="mt-2">
                          <Label htmlFor="participant-image-url" className="text-xs text-muted-foreground">
                            Ou insira uma URL de imagem:
                          </Label>
                          <Input
                            id="participant-image-url"
                            type="url"
                            placeholder="https://exemplo.com/imagem.jpg (opcional)"
                            value={newParticipant.image_url}
                            onChange={(e) =>
                              setNewParticipant({ ...newParticipant, image_url: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddParticipant}
                        className="bg-gold hover:bg-gold-light text-primary-foreground"
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          "Adicionar"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowParticipantForm(false);
                          setSelectedCategory(null);
                          setNewParticipant({ name: "", description: "", image_url: "" });
                          setSelectedImageFile(null);
                          setImagePreview(null);
                        }}
                        disabled={uploadingImage}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma categoria cadastrada ainda. Clique em "Nova Categoria" para começar.
          </p>
        </Card>
      )}
    </div>
  );
};

export default CategoriesManager;
