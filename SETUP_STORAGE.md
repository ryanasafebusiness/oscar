# Configuração do Supabase Storage para Upload de Imagens

## Problema Resolvido
Agora é possível fazer upload de fotos reais dos participantes ao invés de apenas inserir URLs.

## Configuração Necessária

### 1. Criar o Bucket no Supabase Storage

Execute o script `setup_storage.sql` no SQL Editor do Supabase Dashboard:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `setup_storage.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Aguarde a confirmação de sucesso

### 2. Verificar o Bucket

Após executar o script:

1. Vá em **Storage** no menu lateral do Supabase
2. Verifique se o bucket `participant-images` foi criado
3. Confirme que está marcado como **Public**

## Funcionalidades Implementadas

### Upload de Imagens
- ✅ Upload de arquivos de imagem (PNG, JPG, GIF, WEBP)
- ✅ Validação de tipo de arquivo
- ✅ Validação de tamanho (máximo 5MB)
- ✅ Preview da imagem antes de salvar
- ✅ Geração automática de nomes únicos para evitar conflitos
- ✅ Remoção de imagem selecionada

### Interface
- ✅ Área de drag-and-drop para upload
- ✅ Preview da imagem selecionada
- ✅ Botão para remover imagem
- ✅ Indicador de progresso durante upload
- ✅ Opção alternativa de inserir URL (para compatibilidade)

### Armazenamento
- ✅ Imagens armazenadas no Supabase Storage
- ✅ URLs públicas geradas automaticamente
- ✅ Organização em pasta `participants/`

## Como Usar

1. **Adicionar Participante com Foto**:
   - Clique em "Adicionar Participante" na categoria desejada
   - Preencha o nome e descrição
   - Clique na área de upload ou use o botão para selecionar uma imagem
   - Selecione uma imagem do seu computador
   - Visualize o preview da imagem
   - Clique em "Adicionar" para fazer upload e salvar

2. **Remover Imagem Selecionada**:
   - Clique no botão "X" no preview da imagem
   - Ou selecione uma nova imagem para substituir

3. **Usar URL (Alternativa)**:
   - Se não quiser fazer upload, você ainda pode inserir uma URL de imagem
   - A opção de URL aparece quando nenhuma imagem está selecionada

## Troubleshooting

### Erro: "Bucket não encontrado"
- Execute o script `setup_storage.sql` no SQL Editor
- Verifique se o bucket `participant-images` foi criado no Storage

### Erro: "Permissão negada"
- Verifique se as políticas do Storage foram criadas corretamente
- Execute novamente o script `setup_storage.sql`

### Erro: "Arquivo muito grande"
- Reduza o tamanho da imagem (máximo 5MB)
- Use uma ferramenta de compressão de imagens se necessário

### Imagem não aparece após upload
- Verifique se o bucket está configurado como público
- Verifique as políticas de leitura no Storage
- Verifique o console do navegador para erros

## Nota de Segurança

⚠️ **Atenção**: As políticas criadas permitem que qualquer pessoa faça upload, leia, atualize e delete imagens. 

Para produção, considere:
- Adicionar autenticação ao Supabase
- Criar políticas mais restritivas baseadas em roles de usuário
- Implementar validação adicional de imagens
- Adicionar rate limiting para uploads

Para desenvolvimento, essas políticas são aceitáveis se você estiver usando a senha administrativa na aplicação.

