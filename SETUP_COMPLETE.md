# Guia Completo de Configuração do Supabase

Este guia contém TODOS os scripts SQL que você precisa executar no Supabase para que a aplicação funcione corretamente.

## 📋 Ordem de Execução

Execute os scripts na seguinte ordem:

### 1. Criar Tabelas (Obrigatório)

**Arquivo**: `supabase/migrations/20251109184548_f57b959a-d6b8-4f5e-97ef-dfa859b6454f.sql`

Este script cria as tabelas básicas:
- `categories` - Categorias de votação
- `participants` - Participantes de cada categoria
- `votes` - Votos dos usuários

**Como executar**:
1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo
4. Execute (Ctrl+Enter)

### 2. Configurar Políticas RLS para Categorias e Participantes (Obrigatório)

**Arquivo**: `fix_rls_policies.sql`

Este script permite criar, editar e deletar categorias e participantes.

**Como executar**:
1. No SQL Editor do Supabase
2. Copie e cole o conteúdo do arquivo `fix_rls_policies.sql`
3. Execute

### 3. Configurar Políticas RLS para Votos (Obrigatório) ⚠️

**Arquivo**: `fix_votes_rls.sql`

Este script permite que usuários possam votar. **SEM ESTE SCRIPT, A VOTAÇÃO NÃO FUNCIONARÁ!**

**Como executar**:
1. No SQL Editor do Supabase
2. Copie e cole o conteúdo do arquivo `fix_votes_rls.sql`
3. Execute
4. Verifique se as políticas foram criadas:
   ```sql
   SELECT policyname, cmd FROM pg_policies WHERE tablename = 'votes';
   ```
5. Você deve ver 3 políticas:
   - Public can insert votes
   - Public can update votes
   - Public can delete votes

### 4. Configurar Storage para Upload de Imagens (Opcional)

**Arquivo**: `setup_storage.sql`

Este script configura o Supabase Storage para permitir upload de imagens dos participantes.

**Como executar**:
1. No SQL Editor do Supabase
2. Copie e cole o conteúdo do arquivo `setup_storage.sql`
3. Execute
4. Vá em **Storage** e verifique se o bucket `participant-images` foi criado

## ✅ Checklist de Configuração

Use este checklist para garantir que tudo está configurado:

- [ ] Tabelas criadas (categories, participants, votes)
- [ ] Políticas RLS para categories (INSERT, UPDATE, DELETE)
- [ ] Políticas RLS para participants (INSERT, UPDATE, DELETE)
- [ ] Políticas RLS para votes (INSERT, UPDATE, DELETE) ⚠️ **ESSENCIAL**
- [ ] Storage configurado (bucket participant-images)
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Teste de votação funcionando

## 🔍 Verificação Rápida

Execute este comando no SQL Editor para verificar todas as políticas:

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Você deve ver:
- **categories**: 4 políticas (SELECT, INSERT, UPDATE, DELETE)
- **participants**: 4 políticas (SELECT, INSERT, UPDATE, DELETE)
- **votes**: 3 políticas (INSERT, UPDATE, DELETE)

## 🚨 Problemas Comuns

### Erro: "new row violates row-level security policy for table 'votes'"

**Solução**: Execute o script `fix_votes_rls.sql` no Supabase Dashboard.

### Erro: "permission denied for table categories"

**Solução**: Execute o script `fix_rls_policies.sql` no Supabase Dashboard.

### Erro: "bucket does not exist"

**Solução**: Execute o script `setup_storage.sql` no Supabase Dashboard.

### Votos não são registrados

**Solução**: 
1. Verifique se as políticas RLS da tabela votes foram criadas
2. Execute: `SELECT * FROM pg_policies WHERE tablename = 'votes';`
3. Se não houver políticas, execute `fix_votes_rls.sql` novamente

## 📚 Documentação Adicional

- [FIX_CATEGORIES.md](./FIX_CATEGORIES.md) - Detalhes sobre políticas de categorias
- [FIX_VOTES.md](./FIX_VOTES.md) - Detalhes sobre políticas de votação
- [SETUP_STORAGE.md](./SETUP_STORAGE.md) - Detalhes sobre configuração de Storage
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Configuração no Vercel

## 🆘 Precisa de Ajuda?

Se após executar todos os scripts ainda houver problemas:

1. Verifique os logs do Supabase Dashboard
2. Verifique o console do navegador
3. Verifique se as variáveis de ambiente estão configuradas
4. Verifique se todas as políticas foram criadas corretamente

