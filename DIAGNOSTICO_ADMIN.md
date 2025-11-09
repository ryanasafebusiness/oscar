# Diagnóstico - Área Administrativa

## Problema
Os votos e participantes não estão aparecendo na área administrativa.

## Possíveis Causas

### 1. Políticas RLS (Row Level Security) não configuradas

As políticas RLS podem estar bloqueando as consultas SELECT nas tabelas. Verifique:

#### Para Categorias e Participantes:
Execute o script `fix_rls_policies.sql` no SQL Editor do Supabase.

#### Para Votos:
Execute o script `fix_votes_rls.sql` no SQL Editor do Supabase.

### 2. Verificar se as políticas estão ativas

No Supabase Dashboard, vá em:
1. **Authentication** > **Policies**
2. Verifique se as políticas estão criadas para:
   - `categories` (SELECT, INSERT, UPDATE, DELETE)
   - `participants` (SELECT, INSERT, UPDATE, DELETE)
   - `votes` (SELECT, INSERT, UPDATE, DELETE)

### 3. Verificar logs do navegador

1. Abra o DevTools do navegador (F12)
2. Vá na aba **Console**
3. Procure por mensagens de erro que começam com:
   - "Erro ao buscar categorias:"
   - "Erro ao buscar participantes:"
   - "Erro ao buscar votos:"
4. Verifique o código do erro e a mensagem

### 4. Códigos de erro comuns

- **42501**: Permissão negada (RLS bloqueando)
- **PGRST116**: Recurso não encontrado (tabela não existe)
- **PGRST301**: Conexão recusada (problema de conexão)

### 5. Verificar se as tabelas existem

Execute no SQL Editor do Supabase:

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'participants', 'votes');

-- Verificar políticas RLS
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('categories', 'participants', 'votes');
```

### 6. Verificar dados nas tabelas

```sql
-- Verificar se há dados
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM participants;
SELECT COUNT(*) FROM votes;
```

## Solução Rápida

1. **Execute os scripts SQL no Supabase:**
   - `fix_rls_policies.sql` - Para categorias e participantes
   - `fix_votes_rls.sql` - Para votos

2. **Verifique no Console do navegador:**
   - Abra a área administrativa
   - Abra o DevTools (F12)
   - Veja os logs no Console
   - Procure por mensagens como:
     - "Categorias encontradas: X"
     - "Participantes encontrados: X"
     - "Votos encontrados: X"

3. **Se ainda não funcionar:**
   - Verifique as mensagens de erro no Console
   - Verifique se as políticas RLS estão ativas
   - Verifique se as tabelas têm dados

## Mensagens de Log Adicionadas

Agora o sistema adiciona logs detalhados no Console do navegador:

- ✅ "Buscando categorias e participantes..."
- ✅ "Categorias encontradas: X"
- ✅ "Participantes encontrados: X"
- ✅ "Votos encontrados: X"
- ✅ "Resultados calculados: [array]"

Se você não ver essas mensagens, ou se vir mensagens de erro, isso indicará qual é o problema específico.

## Próximos Passos

1. Abra a área administrativa
2. Abra o Console do navegador (F12)
3. Veja os logs
4. Se houver erros, execute os scripts SQL correspondentes
5. Recarregue a página

