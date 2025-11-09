# Como Corrigir o Erro de Votação (RLS Policy)

## Problema
Erro ao registrar votos: "new row violates row-level security policy for table 'votes'"

## Solução

### Passo 1: Executar Script SQL no Supabase

Execute o script `fix_votes_rls.sql` no SQL Editor do Supabase Dashboard:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `fix_votes_rls.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Aguarde a confirmação de sucesso

### Passo 2: Verificar as Políticas

Para verificar se as políticas foram criadas corretamente, execute:

```sql
SELECT * FROM pg_policies WHERE tablename = 'votes';
```

Você deve ver três políticas:
- "Anyone can insert votes" (INSERT)
- "Anyone can update votes" (UPDATE)
- "Anyone can delete votes" (DELETE)

### Passo 3: Testar a Votação

Após executar o script:
1. Acesse a aplicação
2. Tente votar novamente
3. O erro deve desaparecer

## O que o Script Faz

O script `fix_votes_rls.sql`:

1. Remove políticas existentes que possam estar causando conflitos
2. Cria política para INSERT (permitir criar votos)
3. Cria política para UPDATE (permitir atualizar votos existentes)
4. Cria política para DELETE (permitir deletar votos para substituição)

## Nota de Segurança

⚠️ **Atenção**: As políticas criadas permitem que qualquer pessoa possa inserir, atualizar e deletar votos. 

Para produção, considere:
- Adicionar autenticação ao Supabase
- Criar políticas mais restritivas baseadas em roles de usuário
- Implementar validação adicional de votos
- Adicionar rate limiting para prevenir spam

Para desenvolvimento, essas políticas são aceitáveis se você estiver usando a senha administrativa na aplicação.

## Troubleshooting

### Erro persiste após executar o script

1. Verifique se o script foi executado com sucesso
2. Verifique se as políticas foram criadas: `SELECT * FROM pg_policies WHERE tablename = 'votes';`
3. Verifique se há outras políticas conflitantes
4. Tente executar o script novamente

### Erro: "policy already exists"

- O script remove políticas existentes antes de criar novas
- Se ainda houver erro, execute manualmente:
  ```sql
  DROP POLICY IF EXISTS "Anyone can insert votes" ON public.votes;
  DROP POLICY IF EXISTS "Anyone can update votes" ON public.votes;
  DROP POLICY IF EXISTS "Anyone can delete votes" ON public.votes;
  ```
- Depois execute o script novamente

### Ainda não consegue votar

1. Verifique os logs do console do navegador
2. Verifique os logs do Supabase Dashboard
3. Confirme que as variáveis de ambiente estão configuradas
4. Verifique se a conexão com o Supabase está funcionando

